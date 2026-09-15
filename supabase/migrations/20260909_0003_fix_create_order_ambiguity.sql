-- ============================================================
-- Treadville — additive bugfix migration
-- 0003: qualify ambiguous reference_number in create_order RETURNING
--
-- Fixes: PL/pgSQL 42702 "column reference \"reference_number\" is ambiguous"
-- in public.create_order. Inside a function whose RETURNS TABLE includes a
-- column named reference_number, the RETURNING clause's unqualified
-- reference_number matches BOTH the orders table column and the return
-- variable, so PostgreSQL refuses to choose. Qualifying it as
-- public.orders.reference_number forces the table-column interpretation.
--
-- This migration ONLY re-creates public.create_order with that one-line
-- qualification. Nothing else changes: signature, atomic single-transaction
-- behavior, dedup hierarchy, Kenyan phone canonicalization, validation,
-- product verification, delivery_location handling, SECURITY DEFINER,
-- search_path and EXECUTE grants are all preserved verbatim from 0002.
-- 0001 and 0002 are untouched (history preserved); 0003 is additive and
-- safe to apply over the already-applied sequence.
--
-- Re-runnable: create or replace function + plain grant/revoke statements.
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
  returning id, public.orders.reference_number into v_order_id, v_ref;

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
-- EXECUTE PRIVILEGES — idempotent re-assertion
-- ------------------------------------------------------------
-- CREATE OR REPLACE keeps existing grants, but re-asserting them keeps this
-- migration self-contained and guarantees anon/authenticated remain unable
-- to invoke the function regardless of prior state.
-- ============================================================

revoke all on function public.create_order(text, text, text, text, text, jsonb) from public;
revoke all on function public.create_order(text, text, text, text, text, jsonb) from anon;
revoke all on function public.create_order(text, text, text, text, text, jsonb) from authenticated;
grant execute on function public.create_order(text, text, text, text, text, jsonb) to service_role;
