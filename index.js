// @flow
'use strict';
const GUARDED_STRING = Symbol('guarded-string');
const PROTECTED_STRING = Symbol('protected-string');
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

guardedString.isGuardedString = (val /*: GuardedString */) /*: boolean */ => {
  return (
    typeof val === 'object' &&
    val !== null &&
    typeof val[GUARDED_STRING] === 'string'
  );
};

guardedString.assertGuardedString = (val /*: GuardedString */) => {
  if (!guardedString.isGuardedString(val)) {
    throw new Error('Value is not a guarded string');
  }
};

guardedString.protectString = (val /*: GuardedString */) /*: GuardedString */ => {
  def(val, PROTECTED_STRING, {
    get() {
      return true;
    }
  });

  def(val, 'toString', {
    enumerable: true,
    get() {
      throw new Error('Attempted to call `str.toString()` on a protected string. To convert a protected string to a normal string use `guardedString.toUnprotectedString(str)`')
    }
  });

  return Object.seal(Object.freeze(val));
};

guardedString.isProtectedString = (val /*: GuardedString */) /*: boolean */ => {
  return (
    guardedString.isGuardedString(val) &&
    Object.isSealed(val) &&
    Object.isFrozen(val) &&
    val[PROTECTED_STRING] === true
  );
};

guardedString.assertProtectedString = (val /*: GuardedString */) => {
  if (!guardedString.isProtectedString(val)) {
    throw new Error('Value is not a protected string');
  }
};

guardedString.toUnguardedString = (val /*: GuardedString */) /*: string */ => {
  if (guardedString.isGuardedString(val)) {
    return val[GUARDED_STRING];
  } else {
    throw new Error('Called `guardedString.toUnprotectedString(str)` on a value that is not a protected string');
  }
};

module.exports = guardedString;
