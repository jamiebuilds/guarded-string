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
  t.throws(() => str.toString());
  // $ExpectError
  t.throws(() => '' + str);
  t.throws(() => String(str));
  // $ExpectError
  t.throws(() => `${str}`);
  // $ExpectError
  t.throws(() => 1 * str);
  t.throws(() => JSON.stringify(guardedString`foo`));
});

test('guardedString.isGuardedString', t => {
  t.is(guardedString.isGuardedString(guardedString`foo`), true);
  // $ExpectError
  t.is(guardedString.isGuardedString('foo'), false);
  // $ExpectError
  t.is(guardedString.isGuardedString({}), false);
  // $ExpectError
  t.is(guardedString.isGuardedString(null), false);
  // $ExpectError
  t.is(guardedString.isGuardedString(guardedString.toUnguardedString(guardedString`foo`)), false);
});

test('guardedString.assertGuardedString', t => {
  t.notThrows(() => guardedString.assertGuardedString(guardedString`foo`));
  // $ExpectError
  t.throws(() => guardedString.assertGuardedString('foo'));
  // $ExpectError
  t.throws(() => guardedString.assertGuardedString({}));
  // $ExpectError
  t.throws(() => guardedString.assertGuardedString(guardedString.toUnguardedString(guardedString`foo`)));
});

test('guardedString.toUnguardedString', t => {
  t.is(guardedString.toUnguardedString(guardedString`foo`), 'foo');
  // $ExpectError
  t.throws(() => guardedString.toUnguardedString('foo'));
  // $ExpectError
  t.throws(() => guardedString.toUnguardedString({}));
  // $ExpectError
  t.throws(() => guardedString.toUnguardedString(guardedString.toUnguardedString(guardedString`foo`)));
});
