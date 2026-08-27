# Treadville Prototype

One vertical-slice prototype: storefront (Home → Shop → Product → Cart → Checkout concept)
+ a minimal real admin (Categories, Products, Content) backed by Supabase.

## Setup (5 minutes)

1. Create a free Supabase project at supabase.com.
2. In the SQL editor, run `supabase/schema.sql`, then `supabase/seed.sql`.
3. Copy `.env.local.example` to `.env.local` and fill in your project URL + anon key
   (Project Settings → API).
4. `npm install && npm run dev` — visit http://localhost:3000.
5. Add real images to `public/images/` (hero-coffee.jpg, category-*.jpg,
   product-*.jpg) or point the admin's image URL fields at hosted images —
   the app doesn't require local files, any URL works.

## The demo moment

Storefront → switch category tabs (Coffee → Tea, products change) → open a
product → Admin → add/edit a category or product → back to storefront,
refresh → the change is live. That loop is the whole pitch.

## Deploy

Push to GitHub, import into Vercel, set the two env vars there. No other
config needed.

## Deliberately not built (see roadmap doc)

Auth, RLS beyond "public read/write", payments, orders, customers, shipping,
analytics. All are anticipated by the data model, none are needed for this
review.
