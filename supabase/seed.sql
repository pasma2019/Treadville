-- Treadville — V1 seed
--
-- Coffee content is real Treadville information (existing site / verified live
-- catalogue). Tea, Horticulture and Grains category text and products are
-- clearly-labelled demo content pending the client's real catalogue.
--
-- Images reference the project's `site-images` storage bucket (the current
-- application's storage scheme). Replace via the admin content/product forms
-- when the client supplies final imagery.
--
-- Re-runnable: every insert is guarded with ON CONFLICT DO NOTHING.

insert into categories (name, slug, description, image_url, active, sort_order) values
  ('Coffee', 'coffee', 'Specialty Arabica from the volcanic highlands of Mt. Kenya.', 'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/1789898476752-r23mh1uw.png', true, 1),
  ('Tea', 'tea', 'Demo category — real Treadville tea catalogue to be supplied by client.', 'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/1789567580450-efjcth5f.png', true, 2),
  ('Horticulture', 'horticulture', 'Demo category — real Treadville horticulture catalogue to be supplied by client.', 'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/1789567423152-pvs64b83.png', true, 3),
  ('Grains', 'grains', 'Demo category — real Treadville grains catalogue to be supplied by client.', 'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/1789567799583-zal77eka.png', true, 4)
on conflict (slug) do nothing;

-- ---- Products ---------------------------------------------------------------
-- Published coffee (real Treadville information) and demo catalogue for the
-- remaining categories. Prices are intentionally null (quote-first model).

insert into products (category_id, name, slug, description, price, image_url, featured, stock, status)
select id, 'Anaerobic Processed', 'anaerobic-processed', null, null,
  'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/1790317861352-kyvrndp1.png', false, 0, 'published'
from categories where slug = 'coffee'
on conflict (slug) do nothing;

insert into products (category_id, name, slug, description, price, image_url, featured, stock, status)
select id, 'Premium AB Grade', 'premium-ab-grade',
  'A premium washed Kenyan Arabica offering a refined balance of sweetness, acidity and body. Carefully selected screen 15–16 beans deliver a smooth, complex cup with rich chocolate and caramel character, complemented by berry and floral notes. An excellent choice for specialty roasters and carefully crafted blends.',
  null,
  'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/1790316379527-qqw77xxw.png', false, 0, 'published'
from categories where slug = 'coffee'
on conflict (slug) do nothing;

insert into products (category_id, name, slug, description, price, image_url, featured, stock, status)
select id, 'FAQ++ AA Grade', 'faq-aa-grade',
  'Our flagship specialty coffee, selected from exceptional lots in Kirinyaga and distinguished by its large 18+ screen size. Carefully hand-sorted for uniformity, this single-origin Arabica delivers a full-bodied cup with bright acidity and complex fruit and wine notes.',
  null,
  'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/1790314836866-qghpav7r.png', false, 0, 'published'
from categories where slug = 'coffee'
on conflict (slug) do nothing;

insert into products (category_id, name, slug, description, price, image_url, featured, stock, status)
select id, 'Treadville Specialty Coffee', 'treadville-specialty-coffee',
  'A strong, aromatic espresso blend with a rich body and smooth crema, balanced with roasted cocoa, caramel sweetness, and subtle citrus brightness.',
  null,
  'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/products/masai-coffee-moka-espresso/primary.png', false, 0, 'published'
from categories where slug = 'coffee'
on conflict (slug) do nothing;

insert into products (category_id, name, slug, description, price, image_url, featured, stock, status)
select id, 'Premium Black Tea', 'premium-black-tea',
  'Carefully selected Kenyan black tea with a rich, aromatic character and a clean, satisfying cup profile. Prepared for buyers seeking dependable quality and consistent supply for retail, blending and international markets.',
  null,
  'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/1790320135906-pzn3chz7.png', false, 0, 'published'
from categories where slug = 'tea'
on conflict (slug) do nothing;

insert into products (category_id, name, slug, description, price, image_url, featured, stock, status)
select id, 'Fresh Tea Leaves', 'fresh-tea-leaves',
  'Freshly harvested Kenyan tea leaves selected for freshness and careful handling. Suitable for buyers seeking quality green leaf supply for tea processing and value-added production.',
  null,
  'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/1790320923126-wvsx3qa6.png', false, 0, 'published'
from categories where slug = 'tea'
on conflict (slug) do nothing;

insert into products (category_id, name, slug, description, price, image_url, featured, stock, status)
select id, 'Hass Avocado', 'hass-avocado', null, null,
  'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/1790329338217-khmy7kyc.jpeg', false, 0, 'published'
from categories where slug = 'horticulture'
on conflict (slug) do nothing;

insert into products (category_id, name, slug, description, price, image_url, featured, stock, status)
select id, 'Kenyan Beans', 'kenyan-beans', null, null,
  'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/1790322410899-0jo3t5gt.png', false, 0, 'published'
from categories where slug = 'grains'
on conflict (slug) do nothing;

insert into products (category_id, name, slug, description, price, image_url, featured, stock, status)
select id, 'Green Grams', 'green-grams',
  'Carefully selected Kenyan green grams prepared for dependable supply across food, retail and agricultural markets. Naturally nutritious and suitable for buyers seeking quality, clean presentation and professional bulk supply.',
  null,
  'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/1790323237270-b5523hlz.png', false, 0, 'published'
from categories where slug = 'grains'
on conflict (slug) do nothing;

insert into products (category_id, name, slug, description, price, image_url, featured, stock, status)
select id, 'Kenyan Rice', 'kenyan-rice', null, null,
  'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/1790324754779-nbj6fia8.jpeg', false, 0, 'published'
from categories where slug = 'grains'
on conflict (slug) do nothing;

-- ---- Product metadata -------------------------------------------------------
-- Verified attributes for the current live catalogue. Keys match the display
-- labels consumed in src/app/(storefront)/product/[slug]/page.tsx.

insert into product_metadata (product_id, key, value)
select p.id, m.key, m.value
from products p, (values
  ('anaerobic-processed', 'altitude', '1600-1850'),
  ('anaerobic-processed', 'grade', 'Experimental Specialty'),
  ('anaerobic-processed', 'origin', 'Kirinyaga, Kenya'),
  ('anaerobic-processed', 'processing', 'Anaerobic Fermentation'),
  ('anaerobic-processed', 'region', 'Mt. Kenya'),
  ('anaerobic-processed', 'sca_score', '85+'),
  ('anaerobic-processed', 'tasting_notes', 'Tropical Fruit, Fermented, Sweet, Complex'),
  ('anaerobic-processed', 'variety', 'Arabica'),
  ('premium-ab-grade', 'altitude', '1600-1850'),
  ('premium-ab-grade', 'grade', 'AB'),
  ('premium-ab-grade', 'origin', 'Kirinyaga, Kenya'),
  ('premium-ab-grade', 'processing', 'Wet processed in fresh water'),
  ('premium-ab-grade', 'region', 'Mt. Kenya'),
  ('premium-ab-grade', 'sca_score', '80–84'),
  ('premium-ab-grade', 'tasting_notes', 'Chocolate, Caramel, Berry, Floral'),
  ('premium-ab-grade', 'variety', 'Arabica'),
  ('faq-aa-grade', 'altitude', '1600-1850'),
  ('faq-aa-grade', 'grade', 'AA'),
  ('faq-aa-grade', 'origin', 'Kirinyaga, Kenya'),
  ('faq-aa-grade', 'processing', 'Hand-sorted'),
  ('faq-aa-grade', 'region', 'Mt. Kenya'),
  ('faq-aa-grade', 'sca_score', '84+'),
  ('faq-aa-grade', 'tasting_notes', 'Blackcurrant, Citrus, Tomato, Wine'),
  ('faq-aa-grade', 'variety', 'Arabica'),
  ('premium-black-tea', 'elevation', '1500'),
  ('premium-black-tea', 'grade', 'Premium'),
  ('premium-black-tea', 'leaf_style', 'Black Tea'),
  ('premium-black-tea', 'origin', 'Kirinyaga, Kenya'),
  ('premium-black-tea', 'tasting_notes', 'Rich, Aromatic, Brisk'),
  ('fresh-tea-leaves', 'elevation', '1500'),
  ('fresh-tea-leaves', 'grade', 'Fresh Green Leaf'),
  ('fresh-tea-leaves', 'leaf_style', 'Green Leaf'),
  ('fresh-tea-leaves', 'origin', 'Kirinyaga, Kenya'),
  ('fresh-tea-leaves', 'tasting_notes', 'Fresh, Green, Vegetal'),
  ('kenyan-beans', 'grade', 'Selected'),
  ('kenyan-beans', 'origin', 'Kenya'),
  ('kenyan-beans', 'packaging', '50Kg Bags'),
  ('kenyan-beans', 'variety', 'Beans'),
  ('green-grams', 'grade', 'Selected'),
  ('green-grams', 'origin', 'Kenya'),
  ('green-grams', 'packaging', '50Kg Bags'),
  ('green-grams', 'variety', 'Green Grams'),
  ('hass-avocado', 'grade', 'Selected'),
  ('hass-avocado', 'origin', 'Kenya'),
  ('hass-avocado', 'pack_sizes', '10kg'),
  ('hass-avocado', 'seasonality', 'Year-round'),
  ('hass-avocado', 'variety', 'Hass')
) as m(slug, key, value)
where p.slug = m.slug
on conflict (product_id, key) do nothing;

-- ---- Site content -----------------------------------------------------------
-- Keys are exactly what the storefront reads (see src/lib/cms-fields.ts).
-- homepage_hero_subheadline and provenance_intro carry the live-edited values
-- (verified against the current site); the remaining text keys match the
-- application fallbacks so a fresh install renders identically.

insert into site_content (key, value) values
  ('homepage_hero', 'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/1790437770194-6uwbk918.png'),
  ('homepage_hero_headline', E'From Kenyan soil\nto global markets.'),
  ('homepage_hero_subheadline', 'Premium Kenyan agricultural products — specialty coffee, tea, horticulture, and grains sourced with traceability and delivered to global markets.'),
  ('story_eyebrow', 'The Treadville approach'),
  ('story_headline', 'Three decades of Kenyan agriculture — now growing beyond coffee.'),
  ('about_blurb', 'Over 30 years of expertise in Kenyan agriculture — now expanding from specialty coffee into tea, horticulture, and grains, with the same standard of quality and traceability.'),
  ('story_closing', E'Est. 30+ years · Kenya'),
  ('provenance_eyebrow', 'Origin · Kenya'),
  ('provenance_headline', 'Where it begins.'),
  ('provenance_intro', 'Every Treadville product travels the same arc from the soils that grow it, through the hands that refine it, to the markets that receive it. The work between those moments is where quality is made.'),
  ('provenance_image', 'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/editorial/provenance/provenance-landscape.png'),
  ('provenance_closing', 'Discover our origins'),
  ('about_hero', 'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/pages/about/page-about-hero.png'),
  ('quality_hero', 'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/pages/quality/page-quality.png'),
  ('origins_body_kirinyaga', 'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/editorial/provenance/provenance-landscape.png'),
  ('origins_body_terroir', 'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/1790431137926-0ofbslt5.png'),
  ('export_hero', 'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/pages/export/hero-export.png'),
  ('category_hero_coffee', 'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/1790435075274-pea1xk4q.png'),
  ('category_hero_tea', 'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/1790435232209-lcmnamsg.png'),
  ('category_hero_horticulture', 'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/1790435274734-07bue1al.png'),
  ('category_hero_grains', 'https://hqdovxqxperwprbqbyqo.supabase.co/storage/v1/object/public/site-images/1790435761176-tzvzv0w9.png')
on conflict (key) do nothing;