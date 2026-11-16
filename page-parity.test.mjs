// sovereign-ai-security · page-parity.test.mjs — the promises the live page makes, checked from the files.
// 1. The kernel inlined in index.html is byte for byte the gated kernel.mjs (so the picker IS the gated logic).
// 2. The page makes no claim the kernel does not hold: every estate tool it links is one of the kernel's organs.
// 3. The page carries its credits in full, names its supplier, and holds no prices and no private notation.
// 4. The inlined code runs and agrees with the module.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import K from './kernel.mjs';
import { GUARDED } from './tools/guarded.mjs';

const page = readFileSync(new URL('./index.html', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const kernel = readFileSync(new URL('./kernel.mjs', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const body = kernel.slice(kernel.indexOf('export const STATUS'), kernel.indexOf('export default')).replace(/\bexport /g, '').trimEnd();
const text = page.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

test('index.html inlines kernel.mjs byte for byte', () => {
  assert.ok(body.length > 2000, 'kernel body extracted');
  assert.ok(page.includes('/*KERNEL:BEGIN*/\n' + body + '\n/*KERNEL:END*/'), 'the exact kernel body must sit between the page markers');
});

test('the inlined kernel runs and agrees with the gated module', () => {
  const ctx = {};
  vm.runInNewContext(body + '\n;globalThis.__k = { tally, receiptsOk, cover };', ctx);
  assert.equal(JSON.stringify(ctx.__k.tally()), JSON.stringify(K.tally()), 'objects from another VM context differ in prototype, so compare their values');
  assert.equal(ctx.__k.receiptsOk(), true);
  assert.equal(ctx.__k.cover('fake-green').organs.length, 2);
});

test('every estate tool the page links is one the kernel claims (no unverified receipts)', () => {
  const organUrls = new Set(Object.values(K.ORGANS).map((o) => o.url));
  const linked = [...page.matchAll(/https:\/\/sjgant80-hub\.github\.io\/[a-z0-9-]+\//g)].map((m) => m[0]);
  for (const u of linked) assert.ok(organUrls.has(u), 'the page links ' + u + ', which the kernel does not claim');
});

test('every GitHub link on the page is a tool source the kernel gates, its test runs, or this repository', () => {
  const allowed = new Set(['https://github.com/sjgant80-hub/sovereign-ai-security', 'https://github.com/sjgant80-hub/sovereign-ai-security/actions']);
  for (const o of Object.values(K.ORGANS)) { allowed.add(o.src); allowed.add(o.src + '/actions'); }
  const hrefs = [...page.matchAll(/href="(https:\/\/github\.com\/[^"]+)"/g)].map((m) => m[1]);
  assert.ok(hrefs.length >= 2, 'the page links the gate and its own runs');
  for (const u of hrefs) assert.ok(allowed.has(u), 'the page links ' + u + ', which is not a gated source');
});

test('the run-it-yourself commands are the ones CI runs', () => {
  const cmd = page.slice(page.indexOf('<pre class="cmd"'), page.indexOf('</pre>'));
  const ci = readFileSync(new URL('./.github/workflows/gate.yml', import.meta.url), 'utf8');
  const tests = 'node --test kernel.test.mjs guarded.test.mjs page-parity.test.mjs';
  assert.ok(cmd.includes(tests) && ci.includes(tests), 'the same test line on the page and in CI');
  const tag = (ci.match(/--branch (v[0-9.]+) https:\/\/github\.com\/sjgant80-hub\/witness\.git/) || [])[1];
  assert.ok(tag, 'CI pins a witness tag');
  assert.ok(cmd.includes('git clone --depth 1 --branch ' + tag + ' https://github.com/sjgant80-hub/witness.git'), 'the page pins the same witness tag as CI');
  assert.ok(cmd.includes('mutate kernel.mjs --test node --test kernel.test.mjs') && ci.includes('mutate "$1"'), 'the page runs the gate CI runs');
});

test('no prices, no private notation, the public name only', () => {
  assert.ok(!/[£€]\s?\d|\$\s?\d/.test(text), 'a price on the page');
  assert.ok(!/[κφ◊]/.test(page), 'private notation on the page');
  assert.ok(!new RegExp(['karma', 'didy'].join('-'), 'i').test(page), 'the internal name on the page');
  assert.match(text, /This page holds no prices/);
});

test('the supplier, the licence and the credits are on the page in full', () => {
  assert.match(page, /href="https:\/\/www\.ai-nativesolutions\.com\/">AI Native Solutions<\/a>/);
  assert.match(text, /MIT, © Simon Gant/);
  assert.ok(text.includes('Powered by the Konomi architecture, created by Thomas Frumkin'), 'Konomi credit');
  for (const title of ['“GEP-Based Security: Behavioral Entropy Signatures for Cybersecurity and DevOps,” 2025',
    '“Bayesian Entropy Similarity (BES): Alignment Salience for Entropy-Regulated AI Systems,” Technical Report, December 2025']) {
    assert.ok(text.includes('Gary W. Floyd, Lumiea Systems Research Division — ThunderStruck Service LLC — ' + title), 'Gary W. Floyd credit: ' + title);
  }
});

test('the page explains itself: every section a buyer needs is on it', () => {
  for (const id of ['what', 'start-here', 'map', 'try', 'how', 'check', 'blueprint', 'rules', 'roles', 'security', 'risks', 'next', 'paper', 'start']) {
    assert.ok(page.includes('id="' + id + '"'), 'section #' + id);
  }
  for (const words of ['Defensive first', 'Scope and authorization', 'Responsible disclosure', 'No tools for defeating AI safety', 'Sovereign by architecture', 'Proven, not trusted']) {
    assert.ok(text.includes(words), 'rule: ' + words);
  }
  for (const words of ['That nothing leaves', 'That the tests are real', 'That a verdict is right', 'What your auditors get', 'No third-party security audit or certification is claimed']) {
    assert.ok(text.includes(words), 'check-it-yourself: ' + words);
  }
});

test('the pages the page says are locked are exactly the ones CI checks are locked', () => {
  const block = page.slice(page.indexOf('<ul id="guarded">'), page.indexOf('</ul>', page.indexOf('<ul id="guarded">')));
  assert.ok(block.length > 20, 'the #guarded list is on the page');
  const listed = [...block.matchAll(/href="([^"]+)"/g)].map((m) => m[1]).sort();
  const checked = GUARDED.map((id) => K.ORGANS[id].url).sort();
  assert.deepEqual(listed, checked, 'the page must name exactly the pages tools/receipts.mjs checks');
});

test('no inline event handlers, and the page loads nothing from elsewhere', () => {
  assert.ok(!/\son[a-z]+="/.test(page), 'an inline event handler');
  assert.ok(!/<script[^>]+src=/.test(page), 'an external script');
  assert.ok(!/<link[^>]+rel="stylesheet"/.test(page), 'an external stylesheet');
});
