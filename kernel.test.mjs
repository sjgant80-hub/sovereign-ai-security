// sovereign-ai-security · kernel.test.mjs — the coverage map: what is built, what is partial, what is only named.
import test from 'node:test';
import assert from 'node:assert/strict';
import K from './kernel.mjs';

const { STATUS, ORGANS, THREATS, organ, cover, tally, receiptsOk } = K;

test('the map tallies exactly: 9 built, 2 partial, 3 next, 14 in all', () => {
  assert.deepEqual(tally(), { built: 9, partial: 2, next: 3, total: 14 });
});

test('every claim on the real map carries a live receipt and a limit; nothing next is claimed', () => {
  assert.equal(receiptsOk(), true);
  for (const t of THREATS) {
    const c = cover(t.id);
    assert.equal(c.ok, true);
    if (t.status === STATUS.NEXT) assert.equal(c.organs.length, 0, t.id + ' is next and must claim nothing');
    else {
      assert.ok(c.organs.length >= 1, t.id + ' needs an organ');
      for (const o of c.organs) {
        assert.match(o.url, /^https:\/\/(sjgant80-hub\.github\.io|www\.ai-nativesolutions\.com)\//);
        assert.ok(o.limit.length > 10, o.id + ' states its limit');
        assert.ok(o.does.length > 10, o.id + ' says what it does');
      }
    }
  }
});

test('cover returns the threat, its status, its organs and its note', () => {
  const c = cover('fake-green');
  assert.equal(c.ok, true);
  assert.equal(c.status, 'built');
  assert.deepEqual(c.organs.map((o) => o.id), ['scopeguard', 'witness']);
  assert.match(c.note, /pull request/);
  assert.equal(cover('stolen-credential').status, 'partial');
  assert.equal(cover('over-reach').status, 'partial');
  assert.equal(cover('alert-flood').status, 'next');
  assert.equal(cover('poisoned-message').organs[0].id, 'door');
});

test('cover refuses what it cannot answer, and never throws', () => {
  assert.deepEqual(cover('nope'), { ok: false, why: 'that threat is not on this map' });
  for (const bad of [null, undefined, 42, {}, [], true]) assert.deepEqual(cover(bad), { ok: false, why: 'pick a threat from the map' });
  assert.equal(cover('fake-green', null).ok, false);
  assert.equal(cover('fake-green', [null, 7, { id: 'fake-green', status: 'built', organs: 'x' }]).organs.length, 0);
  assert.equal(cover('x', [{ id: 'x', status: 'built', organs: ['door', 'ghost'] }]).organs.length, 1, 'an unknown organ id is dropped');
});

test('organ answers known ids only — never the prototype, never a non-string', () => {
  assert.equal(organ('door').name, ORGANS.door.name);
  assert.equal(organ('door').id, 'door');
  for (const bad of ['nope', '__proto__', 'toString', 'constructor', 42, null, undefined]) assert.equal(organ(bad), null);
});

test('tally counts each status and skips junk', () => {
  assert.deepEqual(tally([]), { built: 0, partial: 0, next: 0, total: 0 });
  assert.deepEqual(tally(null), { built: 0, partial: 0, next: 0, total: 0 });
  assert.deepEqual(tally([{ status: 'built' }, { status: 'partial' }, { status: 'next' }, { status: 'next' }, { status: 'odd' }, null]),
    { built: 1, partial: 1, next: 2, total: 6 });
});

test('receiptsOk refuses an empty, malformed or dishonest map', () => {
  assert.equal(receiptsOk([]), false, 'an empty map proves nothing');
  assert.equal(receiptsOk(null), false);
  assert.equal(receiptsOk([null]), false);
  assert.equal(receiptsOk([{ id: 'a', status: 'built' }]), false, 'no organ list');
  assert.equal(receiptsOk([{ id: 'a', status: 'next', organs: ['door'] }]), false, 'a next item may not claim an organ');
  assert.equal(receiptsOk([{ id: 'a', status: 'next', organs: [] }]), true, 'a next item that claims nothing is honest');
  assert.equal(receiptsOk([{ id: 'a', status: 'built', organs: [] }]), false, 'built needs an organ');
  assert.equal(receiptsOk([{ id: 'a', status: 'partial', organs: [] }]), false, 'partial needs an organ');
  assert.equal(receiptsOk([{ id: 'a', status: 'built', organs: ['ghost'] }]), false, 'an unknown organ is no receipt');
  assert.equal(receiptsOk([{ id: 'a', status: 'built', organs: ['door'] }]), true);
  assert.equal(receiptsOk([{ id: 'a', status: 'partial', organs: ['bes'] }]), true);
  assert.equal(receiptsOk([{ id: 'a', status: 'maybe', organs: ['door'] }]), false, 'an unknown status is refused');
  assert.equal(receiptsOk([{ id: 'a', status: 'built', organs: ['door'] }, { id: 'b', status: 'built', organs: [] }]), false, 'every item is checked, not just the first');
  assert.equal(receiptsOk([{ id: 'a', status: 'next', organs: [] }, { id: 'b', status: 'built', organs: [] }]), false, 'a next item does not end the check');
});

test('receiptsOk refuses an organ whose receipt is off-estate or whose limit is missing', () => {
  const good = { name: 'g', url: 'https://sjgant80-hub.github.io/g/', does: 'does a thing well', limit: 'a stated limit' };
  const map = [{ id: 'a', status: 'built', organs: ['g'] }];
  assert.equal(receiptsOk(map, { g: good }), true);
  assert.equal(receiptsOk(map, { g: { ...good, url: 'http://evil.example/' } }), false, 'a receipt off the estate is no receipt');
  assert.equal(receiptsOk(map, { g: { ...good, url: 'https://sjgant80-hub.github.io.evil.example/' } }), false, 'a look-alike host is refused');
  assert.equal(receiptsOk(map, { g: { ...good, limit: '' } }), false, 'an organ that states no limit is refused');
  assert.equal(receiptsOk(map, { g: { ...good, limit: 7 } }), false);
  assert.equal(receiptsOk(map, { g: { ...good, url: 7 } }), false);
  assert.equal(receiptsOk(map, { g: 'not an organ' }), false);
  assert.equal(receiptsOk(map, null), false);
  assert.equal(receiptsOk([{ id: 'a', status: 'built', organs: ['sovereign'] }]), true, 'the front door is an estate receipt');
  assert.equal(organ('g', { g: good }).url, good.url);
  assert.equal(organ('g', null), null);
  assert.equal(cover('a', map, { g: good }).organs[0].id, 'g');
});

test('the data is frozen, so the live page cannot be edited into a different claim', () => {
  assert.ok(Object.isFrozen(THREATS) && Object.isFrozen(ORGANS) && Object.isFrozen(THREATS[0]) && Object.isFrozen(THREATS[0].organs) && Object.isFrozen(ORGANS.door));
});
