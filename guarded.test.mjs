// sovereign-ai-security · guarded.test.mjs — the lock check the page's "Lock it" claim rests on.
import test from 'node:test';
import assert from 'node:assert/strict';
import { GUARDED, MODEL_HOSTS, connectOk, outsideRefs } from './tools/guarded.mjs';
import K from './kernel.mjs';

const page = (csp) => '<html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="' + csp + '"></head></html>';

test('a page limited to its own address is locked', () => {
  const r = connectOk(page("default-src 'self'; script-src 'self'; connect-src 'self'; base-uri 'none'"), 'door');
  assert.equal(r.ok, true);
  assert.equal(r.why, "connect-src 'self'");
  assert.equal(connectOk(page("default-src 'none'; connect-src 'none'"), 'scopeguard').ok, true);
});

test('without connect-src, default-src decides', () => {
  assert.equal(connectOk(page("default-src 'self'; script-src 'self'"), 'bes').ok, true);
  const r = connectOk(page("default-src https:; script-src 'self'"), 'bes');
  assert.equal(r.ok, false);
  assert.equal(r.why, 'connections allowed to https:');
});

test('connect-src wins over a strict default-src', () => {
  const r = connectOk(page("default-src 'self'; connect-src 'self' https://evil.example"), 'door');
  assert.deepEqual(r, { ok: false, why: 'connections allowed to https://evil.example' });
});

test('a page with no policy, or one that does not limit connections, is not locked', () => {
  assert.deepEqual(connectOk('<html><head></head></html>', 'door'), { ok: false, why: 'no security policy on the page' });
  assert.deepEqual(connectOk(page("script-src 'self'; style-src 'self'"), 'door'), { ok: false, why: 'the policy does not limit connections' });
  assert.equal(connectOk(page("default-src 'self'; connect-src *"), 'door').ok, false);
});

test('only the front door may name its model hosts, and only those', () => {
  const hosts = MODEL_HOSTS.sovereign.join(' ');
  assert.equal(connectOk(page("default-src 'self'; connect-src 'self' " + hosts), 'sovereign').ok, true);
  assert.equal(connectOk(page("default-src 'self'; connect-src 'self' " + hosts), 'door').ok, false, 'another page may not borrow them');
  assert.deepEqual(connectOk(page("default-src 'self'; connect-src 'self' " + hosts + ' https:'), 'sovereign'), { ok: false, why: 'connections allowed to https:' });
});

test('directive names are read case-insensitively and empty pieces are skipped', () => {
  assert.equal(connectOk(page("Default-Src 'self';; CONNECT-SRC 'self' https://x.example ;"), 'door').why, 'connections allowed to https://x.example');
  assert.equal(connectOk(page("  ; default-src 'self' "), 'door').ok, true);
});

test('the policy is read from the meta tag only, attribute quotes either way', () => {
  const single = "<meta http-equiv='Content-Security-Policy' content=\"connect-src 'self'\">";
  assert.equal(connectOk(single, 'door').ok, true);
  assert.equal(connectOk('<p>Content-Security-Policy content="connect-src *"</p>', 'door').why, 'no security policy on the page');
});

test('garbage never throws', () => {
  for (const x of [undefined, null, 0, {}, [], 'x', '<meta http-equiv="Content-Security-Policy" content="">']) {
    assert.equal(typeof connectOk(x, 'door').ok, 'boolean');
  }
});

test('every guarded page is a tool the map claims, and the lists are frozen', () => {
  for (const id of GUARDED) assert.ok(Object.prototype.hasOwnProperty.call(K.ORGANS, id), id);
  assert.ok(Object.isFrozen(GUARDED) && Object.isFrozen(MODEL_HOSTS) && Object.isFrozen(MODEL_HOSTS.sovereign));
});

test('outsideRefs finds every kind of outside load, and names it', () => {
  assert.deepEqual(outsideRefs('<script src="https://cdn.example/a.js"></script>'), ['script https://cdn.example/a.js']);
  assert.deepEqual(outsideRefs('<SCRIPT SRC=\'//cdn.example/a.js\'></SCRIPT>'), ['script //cdn.example/a.js'], 'protocol-relative, any case');
  assert.deepEqual(outsideRefs('<img alt="x" src=" http://img.example/p.png ">'), ['img http://img.example/p.png'], 'trimmed');
  assert.deepEqual(outsideRefs('<iframe src="https://f.example/"></iframe><video src="https://v.example/m.mp4"></video>'), ['iframe https://f.example/', 'video https://v.example/m.mp4']);
  assert.deepEqual(outsideRefs('<link rel="stylesheet" href="https://fonts.example/css">'), ['link https://fonts.example/css']);
  assert.deepEqual(outsideRefs('<link href="https://x.example/i.png">'), ['link https://x.example/i.png'], 'a link with no rel still loads');
  assert.deepEqual(outsideRefs('<link rel="preconnect" href="https://x.example">'), ['link https://x.example'], 'preconnect opens a connection');
  assert.deepEqual(outsideRefs('<object data="https://o.example/x.swf"></object>'), ['object https://o.example/x.swf']);
  assert.deepEqual(outsideRefs('<style>body{background:url( "https://b.example/bg.png" )}</style>'), ['css https://b.example/bg.png']);
  assert.deepEqual(outsideRefs('<style>@import "https://c.example/s.css";</style>'), ['css https://c.example/s.css']);
});

test('outsideRefs leaves the page\'s own files, data and navigation alone', () => {
  assert.deepEqual(outsideRefs('<script src="./app.mjs"></script><script src="/k.js"></script><img src="data:image/png;base64,AA">'), []);
  assert.deepEqual(outsideRefs('<link rel="stylesheet" href="styles.css"><style>a{background:url(data:image/svg+xml,x)}</style>'), []);
  assert.deepEqual(outsideRefs('<link rel="canonical" href="https://site.example/"><link REL="LICENSE" href="https://opensource.org/x">'), [], 'navigational rels are not loads');
  assert.deepEqual(outsideRefs('<a href="https://elsewhere.example/">a link you click</a>'), [], 'a link you click is not a load');
  assert.deepEqual(outsideRefs('<object data="./x.svg"></object><style>@import "local.css";</style>'), []);
  for (const x of [undefined, null, 7, {}, []]) assert.deepEqual(outsideRefs(x), []);
});
