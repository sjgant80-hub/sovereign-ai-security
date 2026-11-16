// sovereign-ai-security · kernel.mjs — which proven organ covers a security threat, and how honestly.
// The map is data: each threat is BUILT (a live, CI-green organ covers it), PARTIAL (the core is built, the rest is
// named), or NEXT (not built — named, never claimed). Every built organ carries its receipt (a live page you can open
// and break) and its honest limit. Pure; garbage in never throws. Inlined byte-for-byte into index.html (a parity
// test holds them equal) and mutation-gated in CI, so the picker a visitor uses IS the gated logic.

export const STATUS = Object.freeze({ BUILT: 'built', PARTIAL: 'partial', NEXT: 'next' });

export const ORGANS = Object.freeze({
  door: Object.freeze({ name: 'The signed-message door (BREAK IT)', url: 'https://sjgant80-hub.github.io/break-it/', src: 'https://github.com/sjgant80-hub/break-it',
    does: 'Verifies every message on its raw bytes — Ed25519 signature, counter, exact layout — before anything parses it. Forgeries are refused and remembered by a living immune system; an independent referee keeps score.',
    limit: 'A signed-message gateway. Putting it in front of a particular MCP server is the deployment work, not a packaged proxy yet.' }),
  liveware: Object.freeze({ name: 'Liveware', url: 'https://sjgant80-hub.github.io/liveware/', src: 'https://github.com/sjgant80-hub/liveware',
    does: 'A whole living system you verify in your own browser in ten minutes, including a self-defending door under a sealed attack test you re-run yourself.',
    limit: 'A demonstration system you can re-run end to end; it is not your production stack.' }),
  scopeguard: Object.freeze({ name: 'ScopeGuard', url: 'https://sjgant80-hub.github.io/kar-scopeguard/', src: 'https://github.com/sjgant80-hub/kar-scopeguard',
    does: 'Flags an AI coding agent that skipped, loosened, deleted or neutered tests, told CI to ignore failures, or edited files outside its task — each with its line. CLI, GitHub Action and a Claude Code hook.',
    limit: 'Judges the honesty of a diff’s tests and scope. It is not a full static analyser or a software bill of materials.' }),
  witness: Object.freeze({ name: 'The mutation gate (witness)', url: 'https://sjgant80-hub.github.io/witness/', src: 'https://github.com/sjgant80-hub/witness',
    does: 'Breaks your code on purpose, one small change at a time, and fails unless your tests notice every break.',
    limit: 'Proves the tests notice changes; it does not prove the code is right for a case nobody tested.' }),
  glyphguard: Object.freeze({ name: 'GlyphGuard', url: 'https://sjgant80-hub.github.io/kar-glyphguard/', src: 'https://github.com/sjgant80-hub/kar-glyphguard',
    does: 'Finds invisible characters, homoglyphs, bidi overrides, hidden Unicode-tag payloads (ASCII smuggling) and fullwidth evasion in text an agent is about to read.',
    limit: 'Finds the characters and names them; deciding intent stays with you.' }),
  conform: Object.freeze({ name: 'Conform', url: 'https://sjgant80-hub.github.io/kar-conform/', src: 'https://github.com/sjgant80-hub/kar-conform',
    does: 'Checks AI structured output against your JSON Schema: PASS or FAIL, with the exact path of every violation.',
    limit: 'Checks the schema you give it; a wrong value that is still valid passes.' }),
  canon: Object.freeze({ name: 'Canon', url: 'https://sjgant80-hub.github.io/kar-canon/', src: 'https://github.com/sjgant80-hub/kar-canon',
    does: 'Proves two JSON documents are byte-identical after canonical form (RFC 8785-aligned), or shows exactly where they diverge.',
    limit: 'Proves two documents are the same; not that either one is true.' }),
  citelock: Object.freeze({ name: 'CiteLock', url: 'https://sjgant80-hub.github.io/kar-citelock/', src: 'https://github.com/sjgant80-hub/kar-citelock',
    does: 'Checks that a claimed quote is verbatim in the source: VERIFIED, NEAR MATCH or NOT FOUND, with a receipt anyone can recompute.',
    limit: 'Exact text only; a faithful paraphrase is reported, not confirmed.' }),
  shingle: Object.freeze({ name: 'Shingle', url: 'https://sjgant80-hub.github.io/kar-shingle/', src: 'https://github.com/sjgant80-hub/kar-shingle',
    does: 'Near-duplicate detection (word shingling and MinHash) that catches disguised copies, with a verdict you can re-derive.',
    limit: 'Measures similar wording, not similar meaning.' }),
  bes: Object.freeze({ name: 'Behavioural Entropy Signatures, inward', url: 'https://sjgant80-hub.github.io/bes-inward/', src: 'https://github.com/sjgant80-hub/bes-inward',
    does: 'Catches a hijacked or scripted session by how it behaves, even when the credential is valid. After Gary W. Floyd’s Behavioral Entropy Signatures.',
    limit: 'Learns each identity’s normal behaviour first; it is a behavioural signal, not proof.' }),
  perimeter: Object.freeze({ name: 'Perimeter Post', url: 'https://sjgant80-hub.github.io/perimeter-post/', src: 'https://github.com/sjgant80-hub/perimeter-post',
    does: 'An operator-issued capability — who may do what, within what budget, until when — verified before anything is acted on.',
    limit: 'A capability checkpoint for one hub. A broker issuing short-lived credentials across many services is the next build.' }),
  isolation: Object.freeze({ name: 'IsolationGate', url: 'https://sjgant80-hub.github.io/kar-isolationgate/', src: 'https://github.com/sjgant80-hub/kar-isolationgate',
    does: 'Blocks the differencing attack: two released totals that subtract to one person’s data.',
    limit: 'Built on the membership of the released sets; it is not differential privacy.' }),
  sovereign: Object.freeze({ name: 'Sovereign by architecture', url: 'https://www.ai-nativesolutions.com/', src: 'https://github.com/sjgant80-hub/ai-nativesolutions',
    does: 'Every tool runs on your device — in your browser, or on servers you run — and none sends what you give it to us or to a model provider. Open any tool page with your browser’s Network tab and watch: the only requests are for the page’s own files. Our own front door shows a live network ledger of what it fetched and what it sent — nothing is sent up.',
    limit: 'An architecture property you can watch, not a hardware enclave (TEE or SGX).' }),
});

export const THREATS = Object.freeze([
  Object.freeze({ id: 'poisoned-message', threat: 'A forged or poisoned message reaches an agent (the MCP tool-poisoning class)', status: STATUS.BUILT, organs: Object.freeze(['door', 'liveware']), note: 'The gateway is built and attacked in the open; wiring it in front of your own MCP servers is the engagement.' }),
  Object.freeze({ id: 'fake-green', threat: 'An AI coding agent fakes a passing build', status: STATUS.BUILT, organs: Object.freeze(['scopeguard', 'witness']), note: 'Runs on every pull request, in your own CI.' }),
  Object.freeze({ id: 'smuggled-text', threat: 'Hidden instructions are smuggled into text an agent reads', status: STATUS.BUILT, organs: Object.freeze(['glyphguard']), note: 'Scan before the agent reads it.' }),
  Object.freeze({ id: 'bad-output', threat: 'AI output breaks the format your systems trust', status: STATUS.BUILT, organs: Object.freeze(['conform', 'canon']), note: 'Check it before it enters a system of record.' }),
  Object.freeze({ id: 'fabricated-citation', threat: 'An answer cites a source that does not say it', status: STATUS.BUILT, organs: Object.freeze(['citelock']), note: 'Every quote checked against the source you supply.' }),
  Object.freeze({ id: 'disguised-copy', threat: 'Disguised copies slip past review', status: STATUS.BUILT, organs: Object.freeze(['shingle']), note: 'A re-derivable similarity verdict, no model judging.' }),
  Object.freeze({ id: 'stolen-credential', threat: 'A stolen but valid credential is used', status: STATUS.PARTIAL, organs: Object.freeze(['bes']), note: 'Behavioural detection is built; automatic revocation on detection is the next step.' }),
  Object.freeze({ id: 'over-reach', threat: 'An agent acts beyond what it was allowed', status: STATUS.PARTIAL, organs: Object.freeze(['perimeter']), note: 'The capability checkpoint is built; a multi-service broker with short-lived credentials is next.' }),
  Object.freeze({ id: 'reidentification', threat: 'Released figures re-identify a person', status: STATUS.BUILT, organs: Object.freeze(['isolation']), note: 'A release gate in front of any published totals.' }),
  Object.freeze({ id: 'data-leaves', threat: 'Sensitive data leaves the building', status: STATUS.BUILT, organs: Object.freeze(['sovereign']), note: 'Nothing you give the tools is sent to us or to a model provider — and you can check that yourself without us.' }),
  Object.freeze({ id: 'untested-system', threat: 'You need proof your own system resists attack before you ship', status: STATUS.BUILT, organs: Object.freeze(['door', 'witness']), note: 'Always scoped to your own systems, with your authorization on record.' }),
  Object.freeze({ id: 'alert-flood', threat: 'A flood of SIEM or EDR alerts needs triage', status: STATUS.NEXT, organs: Object.freeze([]), note: 'Next: log triage on our verified-pattern engine, run on your own logs.' }),
  Object.freeze({ id: 'incident', threat: 'An incident on your own hosts needs a response', status: STATUS.NEXT, organs: Object.freeze([]), note: 'Next: an incident-response agent for your own hosts.' }),
  Object.freeze({ id: 'framework-vulns', threat: 'The open-source AI frameworks you depend on have vulnerabilities', status: STATUS.NEXT, organs: Object.freeze([]), note: 'Next: research with responsible disclosure first, then the public write-up.' }),
]);

const RECEIPT = /^https:\/\/(sjgant80-hub\.github\.io|www\.ai-nativesolutions\.com)\//;
const SOURCE = /^https:\/\/github\.com\/sjgant80-hub\/[a-z0-9-]+$/;
const arr = (x) => (Array.isArray(x) ? x : []);
const isObj = (x) => x !== null && typeof x === 'object';

// organ(id, organs) → { id, name, url, does, limit } for a known organ, else null (own keys only, never the prototype)
export function organ(id, organs = ORGANS) {
  if (typeof id !== 'string' || !isObj(organs) || !Object.prototype.hasOwnProperty.call(organs, id) || !isObj(organs[id])) return null;
  return { id, ...organs[id] };
}

// cover(id, threats) → the threat, its status, the organs that cover it (with receipts and limits) and the note;
// or a refusal. threats defaults to this page's map.
export function cover(id, threats = THREATS, organs = ORGANS) {
  if (typeof id !== 'string') return { ok: false, why: 'pick a threat from the map' };
  const t = arr(threats).find((x) => isObj(x) && x.id === id);
  if (!t) return { ok: false, why: 'that threat is not on this map' };
  return { ok: true, id: t.id, threat: t.threat, status: t.status, organs: arr(t.organs).map((x) => organ(x, organs)).filter(Boolean), note: t.note };
}

// tally(threats) → how many threats are built, partial and next, out of the total
export function tally(threats = THREATS) {
  const list = arr(threats);
  const out = { built: 0, partial: 0, next: 0, total: list.length };
  for (const t of list) {
    if (!isObj(t)) continue;
    if (t.status === STATUS.BUILT) out.built++;
    else if (t.status === STATUS.PARTIAL) out.partial++;
    else if (t.status === STATUS.NEXT) out.next++;
  }
  return out;
}

// receiptsOk(threats) → true only if every built or partial threat has at least one organ, each with a receipt on a
// live estate page, a public source repository on the estate and a stated limit, and every next threat claims no organ
// at all (named, never claimed). An empty or malformed map proves nothing, so it is refused.
export function receiptsOk(threats = THREATS, organs = ORGANS) {
  const list = arr(threats);
  if (list.length === 0) return false;
  for (const t of list) {
    if (!isObj(t) || !Array.isArray(t.organs)) return false;
    const os = t.organs.map((x) => organ(x, organs));
    if (t.status === STATUS.NEXT) {
      if (os.length > 0) return false;
      continue;
    }
    if (t.status !== STATUS.BUILT && t.status !== STATUS.PARTIAL) return false;
    if (os.length === 0) return false;
    for (const o of os) {
      if (o === null || typeof o.url !== 'string' || !RECEIPT.test(o.url) || typeof o.limit !== 'string' || o.limit.length === 0) return false;
      if (typeof o.src !== 'string' || !SOURCE.test(o.src)) return false;
    }
  }
  return true;
}

export default { STATUS, ORGANS, THREATS, organ, cover, tally, receiptsOk };
