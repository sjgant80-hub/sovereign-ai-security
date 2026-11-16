// sovereign-ai-security · tools/receipts.mjs — every tool the map claims must answer at its receipt URL, live, and the
// pages the map says are locked must still be locked.
// 1. A "built" row on the page is only as good as the page it links; this fails unless each one answers 200.
// 2. No tool page may load a script from another site.
// 3. Every page in tools/guarded.mjs must carry a security policy that forbids calls to any other server.
//   node tools/receipts.mjs
import K from '../kernel.mjs';
import { GUARDED, connectOk } from './guarded.mjs';

const ids = Object.keys(K.ORGANS);
const seen = new Map();
let bad = 0;
for (const id of ids) {
  const u = K.ORGANS[id].url;
  if (!seen.has(u)) {
    let status = 'no answer', html = '';
    for (let tries = 0; tries < 3 && status !== 200; tries++) {
      try { const r = await fetch(u, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(20000) }); status = r.status; html = status === 200 ? await r.text() : ''; }
      catch (e) { status = 'no answer'; }
    }
    seen.set(u, { status, html });
  }
  const { status, html } = seen.get(u);
  const outside = [...html.matchAll(/<script[^>]+\bsrc=["'](https?:)?\/\//gi)].length;
  const lock = GUARDED.includes(id) ? connectOk(html, id) : null;
  const fail = status !== 200 || outside > 0 || (lock && !lock.ok);
  if (fail) bad++;
  console.log((fail ? 'FAIL' : 'ok  ') + ' ' + status + ' ' + u
    + (outside ? ' · loads ' + outside + ' outside script(s)' : '')
    + (lock ? ' · locked: ' + (lock.ok ? 'yes, ' : 'NO, ') + lock.why : ''));
}
if (!K.receiptsOk()) { console.error('the map fails its own receipt rule'); process.exit(1); }
if (GUARDED.some((id) => !ids.includes(id))) { console.error('tools/guarded.mjs names a tool the map does not claim'); process.exit(1); }
if (bad) { console.error(bad + ' of ' + ids.length + ' tool checks failed'); process.exit(1); }
console.log('every receipt answers, no tool page loads an outside script, and ' + GUARDED.length + ' pages are locked: ' + seen.size + ' live tools');
