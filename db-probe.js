const fs = require('fs');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const svc = process.env.SUPABASE_SERVICE_ROLE_KEY;
const A = { 'apikey': anon, 'Authorization': 'Bearer ' + anon, 'Content-Type': 'application/json' };
const S = { 'apikey': svc, 'Authorization': 'Bearer ' + svc, 'Content-Type': 'application/json' };
const q = async (headers, path) => { const r = await fetch(url + path, { headers }); const t = await r.text(); return { status: r.status, body: (() => { try { return JSON.parse(t); } catch { return t.slice(0, 300); } })() }; };
(async () => {
  const out = {};
  out.projectRef = url.replace(/^https:\/\/([^.]+)\..*/, '$1');

  out.anonCategories = (await q(A, '/rest/v1/categories?select=id,slug,name,image_url,active,sort_order&order=sort_order')).body;
  out.svcCategories  = (await q(S, '/rest/v1/categories?select=id,slug,name,image_url,active,sort_order&order=sort_order')).body;

  out.anonProducts = (await q(A, '/rest/v1/products?select=id,slug,name,status,featured,category_id,image_url')).body;
  out.svcProducts  = (await q(S, '/rest/v1/products?select=id,slug,name,status,featured,category_id,image_url')).body;

  out.anonContent = (await q(A, '/rest/v1/site_content?select=key,value&limit=200')).body;
  out.svcContent  = (await q(S, '/rest/v1/site_content?select=key,value&limit=200')).body;

  out.buckets = (await q(S, '/storage/v1/bucket')).body;

  const probe = async (headers, p) => {
    const url2 = url + '/storage/v1/object/info/public/' + p;
    const r = await fetch(url2, { headers });
    return r.status;
  };
  const paths = [
    'site-images/categories/coffee/cat-coffee-card.png',
    'site-images/categories/tea/cat-tea-card.png',
    'site-images/categories/horticulture/cat-hort-card.png',
    'site-images/categories/grains/cat-grains-card.png',
    'site-images/categories/coffee/hero-coffee.png',
    'site-images/categories/tea/hero-tea.png',
    'site-images/categories/horticulture/hero-horticulture.png',
    'site-images/categories/grains/hero-grains.png',
    'site-images/homepage/hero-home-portrait.png',
    'site-images/products/masai-coffee-moka-espresso/primary.png',
    'site-images/products/masai-coffee-supreme/primary.png',
  ];
  out.storage = {};
  for (const p of paths) { out.storage[p] = await probe(S, p); }

  fs.writeFileSync('db-state.json', JSON.stringify(out, null, 2));
  console.log('written');
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });