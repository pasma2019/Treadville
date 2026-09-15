const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const k = process.env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: k, Authorization: 'Bearer ' + k, 'Content-Type': 'application/json', Prefer: 'return=representation' };
const BASE = url + '/storage/v1/object/public/site-images';
(async () => {
  for (const slug of ['black-tea-demo', 'specialty-tea-demo']) {
    const r = await fetch(url + '/rest/v1/products?slug=eq.' + slug, { method: 'PATCH', headers: H, body: JSON.stringify({ image_url: `${BASE}/categories/tea/cat-tea-card.png` }) });
    const rows = await r.json();
    console.log(r.status, slug, '->', rows[0]?.image_url);
  }
})();