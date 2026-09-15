const fs = require('fs');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('Missing env'); process.exit(1); }
const H = { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json', 'Prefer': 'return=representation' };

const BASE = url + '/storage/v1/object/public/site-images';

const updates = [
  // 4 category cards
  { table: 'categories', match: { slug: 'coffee' }, set: { image_url: `${BASE}/categories/coffee/cat-coffee-card.png` }, select: 'id,slug,image_url' },
  { table: 'categories', match: { slug: 'tea' }, set: { image_url: `${BASE}/categories/tea/cat-tea-card.png` }, select: 'id,slug,image_url' },
  { table: 'categories', match: { slug: 'horticulture' }, set: { image_url: `${BASE}/categories/horticulture/cat-hort-card.png` }, select: 'id,slug,image_url' },
  { table: 'categories', match: { slug: 'grains' }, set: { image_url: `${BASE}/categories/grains/cat-grains-card.png` }, select: 'id,slug,image_url' },
  // 2 published coffee product primaries
  { table: 'products', match: { slug: 'masai-coffee-moka-espresso' }, set: { image_url: `${BASE}/products/masai-coffee-moka-espresso/primary.png` }, select: 'id,slug,image_url,gallery' },
  { table: 'products', match: { slug: 'masai-coffee-supreme' }, set: { image_url: `${BASE}/products/masai-coffee-supreme/primary.png` }, select: 'id,slug,image_url,gallery' },
];

(async () => {
  // First, record old values for rollback
  const rollback = [];
  for (const u of updates) {
    const qs = Object.entries(u.match).map(([k,v]) => `${k}=eq.${v}`).join('&');
    const r = await fetch(`${url}/rest/v1/${u.table}?${qs}&select=${u.select}`, { headers: H });
    const rows = await r.json();
    if (!rows.length) { console.log('MISS', u.table, u.match); continue; }
    const rec = { table: u.table, id: rows[0].id, slug: rows[0].slug, old_image_url: rows[0].image_url };
    if (rows[0].gallery !== undefined) rec.old_gallery = rows[0].gallery;
    rollback.push(rec);
  }
  fs.writeFileSync('db-rollback.json', JSON.stringify(rollback, null, 2));
  console.log('Old values recorded for rollback.');

  // Now apply
  for (const u of updates) {
    const qs = Object.entries(u.match).map(([k,v]) => `${k}=eq.${v}`).join('&');
    const r = await fetch(`${url}/rest/v1/${u.table}?${qs}`, { method: 'PATCH', headers: H, body: JSON.stringify(u.set) });
    if (!r.ok) { console.log('FAIL', u.table, u.match, r.status, await r.text()); continue; }
    const rows = await r.json();
    console.log('OK   ', u.table, u.match.slug || u.match, '→', rows[0]?.image_url);
  }
})();
