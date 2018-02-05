// @flow
const test = require('ava');
const guardedString = require('./');

test('guardedString``', t => {
  t.notThrows(() => guardedString`foo`);
  t.throws(() => guardedString`foo${1}`);
  t.throws(() => guardedString(['foo']));
});

test('guardedString``.toString()', t => {
  let str = guardedString`foo`;
  // $ExpectError
  t.notThrows(() => str.toString());
  // $ExpectError
  t.notThrows(() => '' + str);
  t.notThrows(() => String(str));
  // $ExpectError
  t.notThrows(() => `${str}`);
  // $ExpectError
  t.notThrows(() => 1 * str);
  t.notThrows(() => JSON.stringify(str));
});

test('guardedString.isGuarded', t => {
  t.is(guardedString.isGuarded(guardedString`foo`), true);
  // $ExpectError
  t.is(guardedString.isGuarded('foo'), false);
  // $ExpectError
  t.is(guardedString.isGuarded({}), false);
  // $ExpectError
  t.is(guardedString.isGuarded(null), false);
  // $ExpectError
  t.is(guardedString.isGuarded(guardedString.toUnguarded(guardedString`foo`)), false);
});

test('guardedString.assertGuarded', t => {
  t.notThrows(() => guardedString.assertGuarded(guardedString`foo`));
  // $ExpectError
  t.throws(() => guardedString.assertGuarded('foo'));
  // $ExpectError
  t.throws(() => guardedString.assertGuarded({}));
  // $ExpectError
  t.throws(() => guardedString.assertGuarded(guardedString.toUnguarded(guardedString`foo`)));
});

test('guardedString.freeze(guardedString``).toString()', t => {
  let str = guardedString.freeze(guardedString`foo`);
  // $ExpectError
  t.throws(() => str.toString());
  // $ExpectError
  t.throws(() => '' + str);
  t.throws(() => String(str));
  // $ExpectError
  t.throws(() => `${str}`);
  // $ExpectError
  t.throws(() => 1 * str);
  t.throws(() => JSON.stringify(str));
});

test('guardedString.isFrozen', t => {
  t.is(guardedString.isFrozen(guardedString.freeze(guardedString`foo`)), true);
  t.is(guardedString.isFrozen(guardedString`foo`), false);
  // $ExpectError
  t.is(guardedString.isFrozen('foo'), false);
  // $ExpectError
  t.is(guardedString.isFrozen({}), false);
  // $ExpectError
  t.is(guardedString.isFrozen(null), false);
  // $ExpectError
  t.is(guardedString.isFrozen(guardedString.toUnguarded(guardedString`foo`)), false);
  // $ExpectError
  t.is(guardedString.isFrozen(guardedString.toUnguarded(guardedString.freeze(guardedString`foo`))), false);
});

test('guardedString.assertFrozen', t => {
  t.notThrows(() => guardedString.assertFrozen(guardedString.freeze(guardedString`foo`)));
  t.throws(() => guardedString.assertFrozen(guardedString`foo`));
  // $ExpectError
  t.throws(() => guardedString.assertFrozen('foo'));
  // $ExpectError
  t.throws(() => guardedString.assertFrozen({}));
  // $ExpectError
  t.throws(() => guardedString.assertFrozen(null));
  // $ExpectError
  t.throws(() => guardedString.assertFrozen(guardedString.toUnguarded(guardedString`foo`)));
  // $ExpectError
  t.throws(() => guardedString.assertFrozen(guardedString.toUnguarded(guardedString.freeze(guardedString`foo`))));
});

test('guardedString.toUnguarded', t => {
  t.is(guardedString.toUnguarded(guardedString`foo`), 'foo');
  t.is(guardedString.toUnguarded(guardedString.freeze(guardedString`foo`)), 'foo');
  // $ExpectError
  t.throws(() => guardedString.toUnguarded('foo'));
  // $ExpectError
  t.throws(() => guardedString.toUnguarded({}));
  // $ExpectError
  t.throws(() => guardedString.toUnguarded(guardedString.toUnguarded(guardedString`foo`)));
  // $ExpectError
  t.throws(() => guardedString.toUnguarded(guardedString.toUnguarded(guardedString.freeze(guardedString`foo`))));
});
