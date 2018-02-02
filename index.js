// @flow
'use strict';
const GUARDED_STRING = Symbol('guarded-string');
const def /*: Function */ = Object.defineProperty;

/*::
opaque type GuardedString = Object;
*/

function guardedString(strs /*: Array<string> */, ...parts /*: Array<mixed> */) /*: GuardedString */ {
  if (!Object.isFrozen(strs) || strs.length !== 1 || parts.length !== 0) {
    throw new Error('Attempted to construct a guarded string unsafely, you must use a template string with no interpolations (i.e. guardedString`string`)');
  }

  let obj /*: Object */ = {};

  def(obj, GUARDED_STRING, {
    get() {
      return strs[0];
    }
  });

  def(obj, 'toString', {
    enumerable: true,
    get() {
      throw new Error('Attempted to call `str.toString()` on a guarded string. To convert a guarded string to a normal string use `guardedString.toUnguardedString(str)`')
    }
  });

  return Object.seal(Object.freeze(obj));
}

guardedString.isGuardedString = (val /*: GuardedString */) /*: boolean */ => {
  return (
    typeof val === 'object' &&
    val !== null &&
    Object.isSealed(val) &&
    Object.isFrozen(val) &&
    typeof val[GUARDED_STRING] === 'string'
  );
};

guardedString.assertGuardedString = (val /*: GuardedString */) => {
  if (!guardedString.isGuardedString(val)) {
    throw new Error('Value is not a guarded string');
  }
};

guardedString.toUnguardedString = (val /*: GuardedString */) /*: string */ => {
  if (guardedString.isGuardedString(val)) {
    return val[GUARDED_STRING];
  } else {
    throw new Error('Called `guardedString.toUnguardedString(str)` on a value that is not a guarded string');
  }
};

module.exports = guardedString;
