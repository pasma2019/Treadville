const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('Missing env'); process.exit(1); }

const H = { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' };
const PHOTO = path.join(process.cwd(), 'Photography');
const ORIGINALS = path.join(PHOTO, '_originals');

// Read PNG, compute sha256, upload to site-images/<storagePath>
// Return {ok, publicUrl, sha256, size} or {ok:false, error}
async function uploadOne(storagePath, localPath) {
  if (!fs.existsSync(localPath)) return { ok: false, error: 'local not found: ' + localPath };
  const buf = fs.readFileSync(localPath);
  const sha = crypto.createHash('sha256').update(buf).digest('hex');
  const r = await fetch(`${url}/storage/v1/object/${storagePath}`, {
    method: 'POST',
    headers: { ...H, 'Content-Type': 'image/png', 'x-upsert': 'true' },
    body: buf,
  });
  if (!r.ok) {
    const t = await r.text();
    return { ok: false, error: r.status + ' ' + t };
  }
  const publicUrl = `${url}/storage/v1/object/public/${storagePath}`;
  return { ok: true, publicUrl, sha256: sha, size: buf.length };
}

async function verify(publicUrl) {
  const r = await fetch(publicUrl, { method: 'HEAD' });
  return r.status === 200;
}

// Build upload plan: storage path -> local source file
// ACCEPT assets only. Never uploads _originals. Never uploads REVIEW without explicit approval.
const plan = [
  // 4 category cards
  { storage: 'site-images/categories/coffee/cat-coffee-card.png', local: 'categories/coffee/cat-coffee-card.png' },
  { storage: 'site-images/categories/tea/cat-tea-card.png', local: 'categories/tea/cat-tea-card.png' },
  { storage: 'site-images/categories/horticulture/cat-hort-card.png', local: 'categories/horticulture/cat-hort-card.png' },
  { storage: 'site-images/categories/grains/cat-grains-card.png', local: 'categories/grains/cat-grains-card.png' },
  // 4 category heroes
  { storage: 'site-images/categories/coffee/hero-coffee.png', local: 'categories/coffee/hero-coffee.png' },
  { storage: 'site-images/categories/tea/hero-tea.png', local: 'categories/tea/hero-tea.png' },
  { storage: 'site-images/categories/horticulture/hero-horticulture.png', local: 'categories/horticulture/hero-horticulture.png' },
  { storage: 'site-images/categories/grains/hero-grains.png', local: 'categories/grains/hero-grains.png' },
  // 2 coffee product primaries (only published products)
  { storage: 'site-images/products/masai-coffee-moka-espresso/primary.png', local: 'products/coffee/prod-coffee-pdp.png' },
  { storage: 'site-images/products/masai-coffee-supreme/primary.png', local: 'products/coffee/prod-coffee-cherry.png' },
  // 4 coffee product gallery candidates (per preflight — DO NOT assign to DB until Pascal picks)
  { storage: 'site-images/products/coffee-gallery/pdp-alt.png', local: 'products/coffee/prod-coffee-raw.png' },
  { storage: 'site-images/products/coffee-gallery/lifestyle.png', local: 'products/coffee/prod-coffee-lifestyle.png' },
  { storage: 'site-images/products/coffee-gallery/macro.png', local: 'products/coffee/prod-coffee-macro.png' },
  { storage: 'site-images/products/coffee-gallery/process.png', local: 'products/coffee/prod-coffee-process.png' },
  // Page heroes (5 pages)
  { storage: 'site-images/pages/about/page-about-hero.png', local: 'pages/about/page-about-hero.png' },
  { storage: 'site-images/pages/quality/page-quality.png', local: 'pages/quality/page-quality.png' },
  { storage: 'site-images/pages/export/hero-export.png', local: 'pages/export/hero-export.png' },
  { storage: 'site-images/pages/export/page-export-doc.png', local: 'pages/export/page-export-doc.png' },
  // Provenance
  { storage: 'site-images/editorial/provenance/provenance-landscape.png', local: 'provenance/provenance-landscape.png' },
  { storage: 'site-images/editorial/provenance/provenance-macro.png', local: 'provenance/provenance-macro.png' },
  // Journal preview
  { storage: 'site-images/editorial/journal/journal-coffee.png', local: 'journal/journal-coffee.png' },
  { storage: 'site-images/editorial/journal/journal-hort.png', local: 'journal/journal-hort.png' },
  { storage: 'site-images/editorial/journal/journal-tea.png', local: 'journal/journal-tea.png' },
  // Homepage hero (deferred to component change — uploaded so it can be referenced)
  { storage: 'site-images/homepage/hero-home-portrait.png', local: 'hero/hero-home-portrait.png' },
];

(async () => {
  const results = [];
  for (const item of plan) {
    const local = path.join(PHOTO, item.local);
    if (local.includes('_originals')) {
      results.push({ ...item, ok: false, error: 'REFUSED: _originals' });
      continue;
    }
    const u = await uploadOne(item.storage, local);
    if (!u.ok) { results.push({ ...item, ...u }); console.log('FAIL', item.storage, u.error); continue; }
    const verified = await verify(u.publicUrl);
    results.push({ ...item, ...u, verified });
    console.log(verified ? 'OK   ' : 'UNVER', item.storage, '→', u.publicUrl);
  }
  fs.writeFileSync('upload-results.json', JSON.stringify(results, null, 2));
  const ok = results.filter(r => r.ok && r.verified).length;
  console.log(`\nUploaded+verified: ${ok}/${results.length}`);
})();
