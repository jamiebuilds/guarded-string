// @flow
'use strict';
const GUARDED_STRING = Symbol('guarded-string');
const FROZEN_STRING = Symbol('frozen-string');
const def /*: Function */ = Object.defineProperty;

/*::
opaque type GuardedString = Object;
*/

function guardedString(strs /*: Array<string> */, ...parts /*: Array<mixed> */) /*: GuardedString */ {
  if (!Object.isFrozen(strs) || strs.length !== 1 || parts.length !== 0) {
    throw new Error('Attempted to construct a guarded string unsafely, you must use a template string with no interpolations (i.e. guardedString`string`)');
  }

  let obj /*: Object */ = {};
  let str = strs[0];

  def(obj, GUARDED_STRING, {
    get() {
      return str;
    }
  });

  def(obj, 'toString', {
    enumerable: true,
    configurable: true,
    writable: true,
    value() {
      return str;
    }
  });

  return obj;
};

guardedString.isGuarded = (val /*: GuardedString */) /*: boolean */ => {
  return (
    typeof val === 'object' &&
    val !== null &&
    typeof val[GUARDED_STRING] === 'string'
  );
};

guardedString.assertGuarded = (val /*: GuardedString */) => {
  if (!guardedString.isGuarded(val)) {
    throw new Error('Value is not a guarded string');
  }
};

guardedString.freeze = (val /*: GuardedString */) /*: GuardedString */ => {
  def(val, FROZEN_STRING, {
    get() {
      return true;
    }
  });

  def(val, 'toString', {
    enumerable: true,
    get() {
      throw new Error('Attempted to call `str.toString()` on a frozen string. To convert a frozen string to a normal string use `guardedString.toUnguarded(str)`')
    }
  });

  return Object.seal(Object.freeze(val));
};

guardedString.isFrozen = (val /*: GuardedString */) /*: boolean */ => {
  return (
    guardedString.isGuarded(val) &&
    Object.isSealed(val) &&
    Object.isFrozen(val) &&
    val[FROZEN_STRING] === true
  );
};

guardedString.assertFrozen = (val /*: GuardedString */) => {
  if (!guardedString.isFrozen(val)) {
    throw new Error('Value is not a frozen string');
  }
};

guardedString.toUnguarded = (val /*: GuardedString */) /*: string */ => {
  if (guardedString.isGuarded(val)) {
    return val[GUARDED_STRING];
  } else {
    throw new Error('Called `guardedString.toUnguarded(str)` on a value that is not a guarded string');
  }
};

module.exports = guardedString;
