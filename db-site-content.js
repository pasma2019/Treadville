const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BASE = url + '/storage/v1/object/public/site-images';
const H = { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' };

const keys = [
  { key: 'about_hero', value: `${BASE}/pages/about/page-about-hero.png` },
  { key: 'quality_hero', value: `${BASE}/pages/quality/page-quality.png` },
  { key: 'export_hero', value: `${BASE}/pages/export/hero-export.png` },
  { key: 'export_doc', value: `${BASE}/pages/export/page-export-doc.png` },
  { key: 'provenance_image', value: `${BASE}/editorial/provenance/provenance-landscape.png` },
  { key: 'journal_card_coffee', value: `${BASE}/editorial/journal/journal-coffee.png` },
  { key: 'journal_card_horticulture', value: `${BASE}/editorial/journal/journal-hort.png` },
  { key: 'journal_card_tea', value: `${BASE}/editorial/journal/journal-tea.png` },
  { key: 'origins_body_kirinyaga', value: `${BASE}/editorial/provenance/provenance-landscape.png` },
  { key: 'origins_body_terroir', value: `${BASE}/editorial/provenance/provenance-macro.png` },
  { key: 'homepage_hero', value: `${BASE}/homepage/hero-home-portrait.png` },
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
