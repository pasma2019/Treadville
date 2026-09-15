const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BASE = url + '/storage/v1/object/public/site-images';
const H = { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' };

const keys = [
  { key: 'category_hero_coffee', value: `${BASE}/categories/coffee/hero-coffee.png` },
  { key: 'category_hero_tea', value: `${BASE}/categories/tea/hero-tea.png` },
  { key: 'category_hero_horticulture', value: `${BASE}/categories/horticulture/hero-horticulture.png` },
  { key: 'category_hero_grains', value: `${BASE}/categories/grains/hero-grains.png` },
];

(async () => {
  for (const k of keys) {
    const r = await fetch(`${url}/rest/v1/site_content?key=eq.${encodeURIComponent(k.key)}&select=key`, { headers: H });
    const existing = await r.json();
    if (existing.length) {
      const u = await fetch(`${url}/rest/v1/site_content?key=eq.${encodeURIComponent(k.key)}`, {
        method: 'PATCH', headers: H, body: JSON.stringify({ value: k.value, updated_at: new Date().toISOString() })
      });
      console.log('UPDATE', k.key, '→', u.status);
    } else {
      const c = await fetch(`${url}/rest/v1/site_content`, {
        method: 'POST', headers: H, body: JSON.stringify({ key: k.key, value: k.value })
      });
      console.log('INSERT', k.key, '→', c.status);
    }
  }
})();
