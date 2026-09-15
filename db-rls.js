const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const svc = process.env.SUPABASE_SERVICE_ROLE_KEY;
const A = { 'apikey': anon, 'Authorization': 'Bearer ' + anon, 'Content-Type': 'application/json' };
const S = { 'apikey': svc, 'Authorization': 'Bearer ' + svc, 'Content-Type': 'application/json' };
const j = { 'apikey': anon, 'Authorization': 'Bearer ' + anon, 'Content-Type': 'application/json', 'Prefer': 'return=representation' };
const t = async (r) => { const txt = await r.text(); let body; try { body = JSON.parse(txt); } catch { body = txt.slice(0, 200); } return { status: r.status, body }; };
(async () => {
  const out = {};
  out.productsFull = (await t(await fetch(url + '/rest/v1/products?select=id,slug,name,status,featured,created_at,updated_at,category_id&order=created_at.asc'))).body;

  const TEST_KEY = 'zz_rls_probe_' + Date.now();
  const ins = await t(await fetch(url + '/rest/v1/site_content', { method: 'POST', headers: j, body: JSON.stringify({ key: TEST_KEY, value: 'probe' }) }));
  out.anonInsert = { status: ins.status, body: (typeof ins.body === 'string' ? ins.body : (ins.body[0]?.key || ins.body)) };
  if (ins.status < 400) {
    const del = await t(await fetch(url + '/rest/v1/site_content?key=eq.' + TEST_KEY, { method: 'DELETE', headers: j }));
    out.anonDelete = del.status;
  }

  const svcIns = await t(await fetch(url + '/rest/v1/site_content', { method: 'POST', headers: { ...j, 'Authorization': 'Bearer ' + svc, 'apikey': svc }, body: JSON.stringify({ key: TEST_KEY, value: 'probe' }) }));
  out.svcInsert = { status: svcIns.status, body: (typeof svcIns.body === 'string' ? svcIns.body : (svcIns.body[0]?.key || svcIns.body)) };
  if (svcIns.status < 400) {
    const del = await t(await fetch(url + '/rest/v1/site_content?key=eq.' + TEST_KEY, { method: 'DELETE', headers: { ...j, 'Authorization': 'Bearer ' + svc, 'apikey': svc } }));
    out.svcCleanupDelete = del.status;
  }

  out.contentRule = await t(await fetch(url + '/rest/v1/rpc/', { headers: A })).catch(() => ({ status: 0, body: 'skip' }));
  fs = require('fs'); fs.writeFileSync('db-rls.json', JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });