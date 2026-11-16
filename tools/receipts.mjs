// sovereign-ai-security · tools/receipts.mjs — every tool the map claims must answer at its receipt URL, live; its source
// must be public; its page must load nothing from another site; and the pages the map says are locked must still be.
// 1. A "built" row on the page is only as good as the page it links; this fails unless each one answers 200.
// 2. Each tool's source repository must answer 200 to an anonymous visitor (public, so anyone can read and re-run it).
// 3. No tool page may load anything from another site: no script, style, font, image or frame (tools/guarded.mjs
//    outsideRefs), so a copy hosted inside your own network needs no internet connection.
// 4. Every page in tools/guarded.mjs must carry a security policy that forbids calls to any other server.
//   node tools/receipts.mjs
import K from '../kernel.mjs';
import { GUARDED, connectOk, outsideRefs } from './guarded.mjs';

const answer = async (u, keep) => {
  let status = 'no answer', html = '';
  for (let tries = 0; tries < 3 && status !== 200; tries++) {
    try {
      const r = await fetch(u, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(20000) });
      status = r.status; html = status === 200 && keep ? await r.text() : '';
    } catch (e) { status = 'no answer'; }
    if (status !== 200) await new Promise((ok) => setTimeout(ok, 1500));
  }
  return { status, html };
};

const ids = Object.keys(K.ORGANS);
const pages = new Map();
let bad = 0;
for (const id of ids) {
  const o = K.ORGANS[id];
  if (!pages.has(o.url)) pages.set(o.url, await answer(o.url, true));
  const { status, html } = pages.get(o.url);
  const src = await answer(o.src, false);
  const outside = outsideRefs(html);
  const lock = GUARDED.includes(id) ? connectOk(html, id) : null;
  const fail = status !== 200 || src.status !== 200 || outside.length > 0 || (lock && !lock.ok);
  if (fail) bad++;
  console.log((fail ? 'FAIL' : 'ok  ') + ' ' + status + ' ' + o.url + ' · source ' + src.status
    + (outside.length ? ' · loads from outside: ' + outside.join(', ') : '')
    + (lock ? ' · locked: ' + (lock.ok ? 'yes, ' : 'NO, ') + lock.why : ''));
}
if (!K.receiptsOk()) { console.error('the map fails its own receipt rule'); process.exit(1); }
if (GUARDED.some((id) => !ids.includes(id))) { console.error('tools/guarded.mjs names a tool the map does not claim'); process.exit(1); }
if (bad) { console.error(bad + ' of ' + ids.length + ' tool checks failed'); process.exit(1); }
console.log('every receipt answers, every source is public, no tool page loads anything from outside, and '
  + GUARDED.length + ' pages are locked: ' + pages.size + ' live tools');
