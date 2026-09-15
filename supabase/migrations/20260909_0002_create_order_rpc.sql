-- ============================================================
-- Treadville — atomic order creation RPC
-- Slice 2 hardening — single-transaction order submission
--
-- Replaces the Server Action's three separate writes
--   customers -> orders -> order_items
-- with one PostgreSQL function. The whole operation — customer
-- create/reuse decision, order insert, and every line item — now
-- commits or rolls back together. A failure at any point discards
-- the entire submission; no header-only orders can be left behind.
--
-- Functions added:
--   public.canonical_ke_phone(text) -> text      normalization helper
--   public.consistent_customer_name(text,text) -> boolean
--                                                reuse-corroboration helper
--   public.create_order(...) -> table            atomic submission RPC
--
-- Threading the Slice 1 conventions:
--   * reference_number and status(='pending') are NEVER supplied by the
--     caller. public.assign_order_reference() (Slice 1) generates the
--     reference inside this same transaction, so the returned
--     reference_number is authoritative.
--   * product_name snapshots come from the down-read here (status =
--     'published'), the same filter RLS exposes to the storefront, so a
--     drafted/removed product can never enter an order.
--   * All writes go through this SECURITY DEFINER function owned by the
--     migration role and are EXECUTE-granted ONLY to service_role. The
--     storefront's RLS denies anon/authenticated DML on every commerce
--     table (Slice 1), and this migration additionally revokes direct
--     EXECUTE on the function from public/anon/authenticated.
--   * The commercial bound MAX_QUANTITY_PER_LINE = 1000 is enforced in
--     the Server Action AND here at the database layer. Keep the two in
--     sync (src/lib/order-actions.ts).
--
-- CUSTOMER REUSE POLICY (single email anchor — the ONLY reuse signal).
-- A row is reached for reuse ONLY through normalized (lowercased) email.
-- Name and phone are corroboration/verifying signals, never triggers:
--
--   normalized email match + matching canonical phone      -> reuse
--   normalized email match + existing phone null/empty     -> reuse + gap-fill
--   normalized email match + submitted phone null/empty    -> reuse ONLY if
--                                                             name consistent
--                                                             (phone never
--                                                              overwritten)
--   normalized email match + different non-empty phones    -> identity
--                                                             conflict:
--                                                             NEW customer,
--                                                             existing row
--                                                             untouched
--   no normalized email match                              -> new customer
--
-- identity_conflict is returned to the caller and recorded in the audit
-- trail for manual review. We never merge or overwrite a materially
-- different record.
--
-- Stored phone format: new rows and gap-fills store the canonical
-- Kenyan-dial form (2547xxxxxxxx) so the phone column is normalized
-- going forward; order snapshots keep the customer's as-typed number.
-- Comparisons always run through canonical_ke_phone regardless.
--
-- This migration is re-runnable (create or replace functions, plain
-- grant/revoke statements).
-- ============================================================

-- ============================================================
-- PHONE NORMALIZATION
-- ------------------------------------------------------------
-- Mirrors the Server Action's canonicalizeKenyanPhone():
--   drop everything except digits and leading '+'
--   strip the leading '+'
--   a leading 0 (Kenyan trunk prefix) becomes '254'
--   -> '07xx xxx xxx' / '254 7xx...' / '+2547xx...' all become '2547xx...'
-- Returns NULL for empty/unusable input. Only the Kenyan 0/254 pair is
-- handled — no general international normalization in this slice.
-- ============================================================

create or replace function public.canonical_ke_phone(p_phone text)
returns text
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_clean text;
begin
  if p_phone is null or btrim(p_phone) = '' then
    return null;
  end if;

  v_clean := regexp_replace(p_phone, '[^0-9+]', '', 'g');

  if v_clean = '' then
    return null;
  end if;

  if left(v_clean, 1) = '+' then
    v_clean := substr(v_clean, 2);
  end if;

  if left(v_clean, 1) = '0' then
    v_clean := '254' || substr(v_clean, 2);
  end if;

  return v_clean;
end;
$$;

-- ============================================================
-- NAME CONSISTENCY (reuse corroboration only)
-- ------------------------------------------------------------
-- True when the two names are equal after normalization (lowercase,
-- whitespace collapsed), or share the same first and last word —
-- the common Kenyan given + family-name pattern, e.g.
-- "Grace Wanjiru Muthoni" vs "Grace Muthoni".
-- Deliberately narrow: this guard only decides reuse-vs-new-customer,
-- and erring toward "new customer" never corrupts history.
-- ============================================================

create or replace function public.consistent_customer_name(p_submitted text, p_existing text)
returns boolean
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_submitted text;
  v_existing text;
  v_submitted_tokens text[];
  v_existing_tokens text[];
begin
  if p_submitted is null or p_existing is null then
    return false;
  end if;

  v_submitted := lower(regexp_replace(btrim(p_submitted), '\s+', ' ', 'g'));
  v_existing  := lower(regexp_replace(btrim(p_existing),  '\s+', ' ', 'g'));

  if v_submitted = '' or v_existing = '' then
    return false;
  end if;

  if v_submitted = v_existing then
    return true;
  end if;

  v_submitted_tokens := string_to_array(v_submitted, ' ');
  v_existing_tokens  := string_to_array(v_existing, ' ');

  return v_submitted_tokens[1] = v_existing_tokens[1]
     and v_submitted_tokens[array_upper(v_submitted_tokens, 1)]
         = v_existing_tokens[array_upper(v_existing_tokens, 1)];
end;
$$;

-- ============================================================
-- ATOMIC ORDER CREATION
-- ------------------------------------------------------------
-- SECURITY DEFINER: executes with the privileges of the migration
-- owner so the function can write to the commerce tables regardless
-- of the caller's RLS standing. Combined with the EXECUTE revocation
-- below, only service_role can invoke it, and only server-side code
-- ever holds a service_role key — anon/authenticated clients can
-- never reach this path or the underlying tables.
--
-- The function is a single implicit transaction: any RAISE EXCEPTION
-- inverts everything — customer reuse/creation, the order, and every
-- inserted line item.
-- ============================================================

create or replace function public.create_order(
  p_full_name text,
  p_email text,
  p_phone text,
  p_delivery_location text,
  p_customer_notes text,
  p_items jsonb
)
returns table (order_id uuid, reference_number text, customer_id uuid, identity_conflict boolean)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_full_name text;
  v_email text;
  v_phone_submitted text;        -- raw as-typed, for order snapshot & new rows
  v_phone_canonical text;        -- canonical form, for matching + storage
  v_delivery_location text;
  v_customer_notes text;

  v_existing_id uuid;
  v_existing_name text;
  v_existing_phone text;
  v_existing_location text;

  v_customer_id uuid;
  v_conflict boolean := false;

  v_order_id uuid;
  v_ref text;

  v_items_count integer;
  v_idx integer;
  v_product_id uuid;
  v_quantity integer;
  v_product_name text;
begin
  -- --- input normalization -----------------------------------
  v_full_name         := nullif(btrim(p_full_name), '');
  v_email             := nullif(lower(btrim(p_email)), '');
  v_phone_submitted   := nullif(btrim(p_phone), '');
  v_phone_canonical   := public.canonical_ke_phone(v_phone_submitted);
  v_delivery_location := nullif(btrim(p_delivery_location), '');
  v_customer_notes    := nullif(btrim(p_customer_notes), '');

  if v_full_name is null then
    raise exception 'invalid_input';
  end if;
  if v_email is null or position('@' in v_email) = 0 then
    raise exception 'invalid_input';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'invalid_items';
  end if;

  -- --- customer: email is the ONLY anchor --------------------
  select id, full_name, phone, delivery_location
    into v_existing_id, v_existing_name, v_existing_phone, v_existing_location
    from public.customers
   where lower(email) = v_email
   order by created_at desc
   limit 1;

  if v_existing_id is null then
    -- No anchor -> always a new customer. No other signal may trigger reuse.
    insert into public.customers (full_name, phone, email, delivery_location)
    values (v_full_name, v_phone_canonical, v_email, v_delivery_location)
    returning id into v_customer_id;

  elsif v_phone_canonical is not null then
    -- Submitted phone present. Existing empty -> gap-fill (reuse).
    -- Existing matching -> reuse. Existing different -> conflict.
    if public.canonical_ke_phone(v_existing_phone) is null then
      update public.customers
         set phone             = v_phone_canonical,
             delivery_location = coalesce(delivery_location, v_delivery_location),
             updated_at        = now()
       where id = v_existing_id;
      v_customer_id := v_existing_id;

    elsif public.canonical_ke_phone(v_existing_phone) = v_phone_canonical then
      update public.customers
         set delivery_location = coalesce(delivery_location, v_delivery_location),
             updated_at        = now()
       where id = v_existing_id;
      v_customer_id := v_existing_id;

    else
      -- Same email, materially different phone. Do not merge or overwrite:
      -- preserve both histories, surface the ambiguity for review.
      insert into public.customers (full_name, phone, email, delivery_location)
      values (v_full_name, v_phone_canonical, v_email, v_delivery_location)
      returning id into v_customer_id;
      v_conflict := true;
    end if;

  else
    -- Submitted phone empty. Reuse ONLY if the name corroborates; the
    -- existing phone is never overwritten.
    if public.consistent_customer_name(v_full_name, v_existing_name) then
      update public.customers
         set delivery_location = coalesce(delivery_location, v_delivery_location),
             updated_at        = now()
       where id = v_existing_id;
      v_customer_id := v_existing_id;
    else
      insert into public.customers (full_name, phone, email, delivery_location)
      values (v_full_name, v_phone_canonical, v_email, v_delivery_location)
      returning id into v_customer_id;
      v_conflict := true;
    end if;
  end if;

  -- --- order -------------------------------------------------
  -- reference_number and status are intentionally omitted: the Slice 1
  -- trigger assigns the reference inside this same transaction and
  -- status falls to its default ('pending').
  insert into public.orders
    (customer_id, customer_name, customer_phone, customer_email,
     delivery_location, customer_notes)
  values
    (v_customer_id, v_full_name, v_phone_submitted, v_email,
     v_delivery_location, v_customer_notes)
  returning id, reference_number into v_order_id, v_ref;

  -- --- line items ---------------------------------------------
  v_items_count := jsonb_array_length(p_items);
  v_idx := 0;
  while v_idx < v_items_count loop
    v_idx := v_idx + 1;
    begin
      v_product_id := (p_items -> (v_idx - 1) ->> 'product_id')::uuid;
      v_quantity   := (p_items -> (v_idx - 1) ->> 'quantity')::integer;
    exception when others then
      raise exception 'invalid_items';
    end;

    if v_quantity < 1 or v_quantity > 1000 then
      raise exception 'invalid_quantity';
    end if;

    -- Authoritative product read: only published products are orderable,
    -- mirroring what the storefront's RLS exposes. Missing/drafted/deleted
    -- -> entire transaction rolls back, so an order can never contain an
    -- invalid product.
    select name
      into v_product_name
      from public.products
     where id = v_product_id
       and status = 'published';

    if v_product_name is null then
      raise exception 'product_not_available';
    end if;

    insert into public.order_items (order_id, product_id, product_name, quantity)
    values (v_order_id, v_product_id, v_product_name, v_quantity);
  end loop;

  -- --- result -------------------------------------------------
  return query select v_order_id, v_ref, v_customer_id, v_conflict;
end;
$$;

-- ============================================================
-- EXECUTE PRIVILEGES
-- ------------------------------------------------------------
-- Default new-function privilege is EXECUTE to PUBLIC, which would let
-- anon/authenticated reach the SECURITY DEFINER body. Explicitly revoke
-- from public, anon and authenticated, then grant ONLY to service_role.
-- PostgREST exposes a function as an /rpc endpoint only to roles that
-- hold EXECUTE on it — with the grant carved down to service_role, an
-- unauthenticated or browser-user client gets 404/403 instead.
-- ============================================================

revoke all on function public.create_order(text, text, text, text, text, jsonb) from public;
revoke all on function public.create_order(text, text, text, text, text, jsonb) from anon;
revoke all on function public.create_order(text, text, text, text, text, jsonb) from authenticated;
grant execute on function public.create_order(text, text, text, text, text, jsonb) to service_role;

revoke all on function public.canonical_ke_phone(text) from public;
revoke all on function public.canonical_ke_phone(text) from anon;
revoke all on function public.canonical_ke_phone(text) from authenticated;
grant execute on function public.canonical_ke_phone(text) to service_role;

revoke all on function public.consistent_customer_name(text, text) from public;
revoke all on function public.consistent_customer_name(text, text) from anon;
revoke all on function public.consistent_customer_name(text, text) from authenticated;
grant execute on function public.consistent_customer_name(text, text) to service_role;