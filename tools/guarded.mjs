// sovereign-ai-security · tools/guarded.mjs — the tool pages the live page says are LOCKED by a browser security policy.
// One list, read by two checks: page-parity.test.mjs holds the page's #guarded list equal to it, and tools/receipts.mjs
// fetches each live page and fails CI unless its policy still forbids calls to any other server.
export const GUARDED = Object.freeze(['door', 'liveware', 'scopeguard', 'bes', 'alerttriage', 'irhelper', 'sovereign']);

// The front door may download an in-browser AI model, only when the visitor asks for one. These are the only outside
// hosts its policy may name; every other guarded page may connect to its own address and nothing else.
export const MODEL_HOSTS = Object.freeze({
  sovereign: Object.freeze(['https://cdn.jsdelivr.net', 'https://huggingface.co', 'https://*.huggingface.co', 'https://*.hf.co', 'https://raw.githubusercontent.com']),
});

// outsideRefs(html) → every resource the page itself would load from another site: a script, image, frame, media,
// stylesheet, icon, font or CSS import whose address starts with http(s):// or //. Links a visitor clicks are not
// loads, and neither are navigational <link> rels (canonical, licence and the like). Empty means a copy of the page
// hosted inside your own network loads nothing from outside it.
const NAV = /\b(canonical|alternate|author|license|me|bookmark|help|next|prev|search|external)\b/;
const isOutside = (u) => /^\s*(https?:)?\/\//i.test(u);
export function outsideRefs(html) {
  const s = typeof html === 'string' ? html : '';
  const out = [];
  for (const m of s.matchAll(/<(script|img|iframe|frame|source|video|audio|embed|track|input)\b[^>]*?\bsrc\s*=\s*["']([^"']*)["']/gi)) {
    if (isOutside(m[2])) out.push(m[1].toLowerCase() + ' ' + m[2].trim());
  }
  for (const m of s.matchAll(/<link\b[^>]*>/gi)) {
    const rel = ((m[0].match(/\brel\s*=\s*["']([^"']*)["']/i) || [])[1] || '').toLowerCase();
    const href = (m[0].match(/\bhref\s*=\s*["']([^"']*)["']/i) || [])[1] || '';
    if (isOutside(href) && !NAV.test(rel)) out.push('link ' + href.trim());
  }
  for (const m of s.matchAll(/<object\b[^>]*?\bdata\s*=\s*["']([^"']*)["']/gi)) if (isOutside(m[1])) out.push('object ' + m[1].trim());
  for (const m of s.matchAll(/url\(\s*["']?([^"')]*)/gi)) if (isOutside(m[1])) out.push('css ' + m[1].trim());
  for (const m of s.matchAll(/@import\s+["']([^"']*)["']/gi)) if (isOutside(m[1])) out.push('css ' + m[1].trim());
  return out;
}

// connectOk(html, id) → { ok, why }: the page carries a Content-Security-Policy meta whose connect-src (or default-src,
// when connect-src is absent) allows only 'self' / 'none' plus that page's listed model hosts.
export function connectOk(html, id) {
  // read strings only: coercing an unknown value would run its own toString, which can throw
  const m = (typeof html === 'string' ? html : '').match(/http-equiv=["']Content-Security-Policy["'][^>]*\bcontent="([^"]+)"/i);
  if (!m) return { ok: false, why: 'no security policy on the page' };
  const dirs = Object.fromEntries(m[1].split(';').map((d) => d.trim().split(/\s+/)).filter((d) => d[0]).map((d) => [d[0].toLowerCase(), d.slice(1)]));
  const src = dirs['connect-src'] || dirs['default-src'];
  if (!src) return { ok: false, why: 'the policy does not limit connections' };
  const allowed = new Set(["'self'", "'none'", ...(MODEL_HOSTS[id] || [])]);
  const extra = src.filter((s) => !allowed.has(s));
  return extra.length ? { ok: false, why: 'connections allowed to ' + extra.join(' ') } : { ok: true, why: 'connect-src ' + src.join(' ') };
}
