-- Seed: Coffee data is real (pulled from the live treadville.co.ke site).
-- Tea / Horticulture / Grains are placeholder demo content — swap once
-- Eunice supplies the real catalogue.

insert into categories (name, slug, description, image_url, sort_order) values
  ('Coffee', 'coffee', 'Specialty Arabica from the volcanic highlands of Mt. Kenya.', '/images/category-coffee.jpg', 1),
  ('Tea', 'tea', 'Demo category — real Treadville tea catalogue to be supplied by client.', '/images/category-tea.jpg', 2),
  ('Horticulture', 'horticulture', 'Demo category — real Treadville horticulture catalogue to be supplied by client.', '/images/category-horticulture.jpg', 3),
  ('Grains', 'grains', 'Demo category — real Treadville grains catalogue to be supplied by client.', '/images/category-grains.jpg', 4);

insert into products (category_id, name, slug, description, price, image_url, featured, stock, status)
select id, 'Masai Coffee Moka Espresso', 'masai-coffee-moka-espresso',
  'A strong, aromatic espresso blend with a rich body and smooth crema, balanced with roasted cocoa, caramel sweetness, and subtle citrus brightness.',
  900, '/images/product-moka-espresso.jpg', true, 25, 'published'
from categories where slug = 'coffee';

insert into products (category_id, name, slug, description, price, image_url, featured, stock, status)
select id, 'Masai Coffee Supreme', 'masai-coffee-supreme',
  'Full-bodied with a smooth finish — roasted cocoa, subtle berry brightness, and a lingering aromatic warmth. Packaging inspired by Maasai heritage.',
  900, '/images/product-supreme.jpg', false, 30, 'published'
from categories where slug = 'coffee';

insert into products (category_id, name, slug, description, price, image_url, featured, stock, status)
select id, 'Masai Coffee Kenya AA — Gold Enticing', 'masai-coffee-kenya-aa-gold',
  'Premium AA-grade coffee from Kenya''s high-altitude regions — large beans, rich oils, and an exceptional flavor profile.',
  1300, '/images/product-kenya-aa.jpg', true, 15, 'published'
from categories where slug = 'coffee';

-- Demo content for the remaining three categories (placeholder — clearly not real Treadville products)
insert into products (category_id, name, slug, description, price, image_url, featured, stock, status)
select id, 'Black Tea (Demo)', 'black-tea-demo', 'Placeholder — real Treadville tea catalogue pending.', null, '/images/product-placeholder-tea.jpg', false, 0, 'draft'
from categories where slug = 'tea';

insert into products (category_id, name, slug, description, price, image_url, featured, stock, status)
select id, 'Specialty Tea (Demo)', 'specialty-tea-demo', 'Placeholder — real Treadville tea catalogue pending.', null, '/images/product-placeholder-tea.jpg', false, 0, 'draft'
from categories where slug = 'tea';

insert into products (category_id, name, slug, description, price, image_url, featured, stock, status)
select id, 'Fresh Produce (Demo)', 'fresh-produce-demo', 'Placeholder — real Treadville horticulture catalogue pending.', null, '/images/product-placeholder-hort.jpg', false, 0, 'draft'
from categories where slug = 'horticulture';

insert into products (category_id, name, slug, description, price, image_url, featured, stock, status)
select id, 'Export Horticulture (Demo)', 'export-horticulture-demo', 'Placeholder — real Treadville horticulture catalogue pending.', null, '/images/product-placeholder-hort.jpg', false, 0, 'draft'
from categories where slug = 'horticulture';

insert into products (category_id, name, slug, description, price, image_url, featured, stock, status)
select id, 'Maize (Demo)', 'maize-demo', 'Placeholder — real Treadville grains catalogue pending.', null, '/images/product-placeholder-grain.jpg', false, 0, 'draft'
from categories where slug = 'grains';

insert into products (category_id, name, slug, description, price, image_url, featured, stock, status)
select id, 'Rice (Demo)', 'rice-demo', 'Placeholder — real Treadville grains catalogue pending.', null, '/images/product-placeholder-grain.jpg', false, 0, 'draft'
from categories where slug = 'grains';

insert into site_content (key, value) values
  ('hero_headline', 'Premium African Products. From Coffee to Grain.'),
  ('hero_subheadline', 'Sourced across Kenya''s volcanic highlands and fertile plains — delivered worldwide, or to your doorstep in Nairobi.'),
  ('hero_image', '/images/hero-coffee.jpg'),
  ('about_blurb', 'Over 30 years of expertise in Kenyan agriculture — now expanding from specialty coffee into tea, horticulture, and grains, with the same standard of quality and traceability.');
