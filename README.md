# guarded\`string\`

> Prevent accidentally introducing XSS holes with the strings in your app

Hold your friends close, and your strings closer

## Installation

```
yarn add guarded-string
```

## Usage

> **Important!** This should be used for things like preventing XSS attacks,
> not for hiding sensitive information.

```js
import guardedString from 'guarded-string';

const myString = guardedString`My very important (but not too important) string`;

guardedString.isGuardedString(myString); // >> boolean
guardedString.assertGuardedString(myString); // >> maybe throws
guardedString.toUnguardedString(myString); // >> unguarded string (throws on other value types)

myString + ''; // 'My very important (but not too important) string'

guardedString.protectString(myString);

myString + ''; // Error!
JSON.stringify(myString); // Error!
// etc.
```

## API

### `guardedString`

Create a guarded string. This must be used as a tagged template literal with no
interpolations. You cannot construct a guarded string that is not statically
written in your code.

```js
let str = guardedString`Hello World`;
```

You can continue using this as a string, but when you modify it, the result is
an unguarded (regular) string.

```js
let str1 = guardedString`Hello World`;
let str2 = str1 + '!';

guardedString.isGuardedString(str1); // true
guardedString.isGuardedString(str2); // false
```

If you want to using string methods, you can wrap your string with
`String(str)` or `guardedString.toUnguardedString(str)`.

```js
let str1 = guardedString`Hello World`;
let str2 = String(str1).replace('World', 'Universe');
let str3 = guardedString.toUnguardedString(str1).replace('World', 'Universe');
```

### `guardedString.isGuardedString(val)`

This just returns a `boolean` if the value you pass in is a guarded string or
not.

### `guardedString.assertGuardedString(val)`

This will throw an error if the value you pass in is not a guarded string.

### `guardedString.protectString(str)`

If you want to make sure that your string is not accidentally stringified, you
can call `guardedString.protectString(str)` on your guarded string and it will
prevent code from accidentally stringifying it.

```js
let str = guardedString.protectString(guardedString`Hello World`);

String(str); // Error!
str + '!'; // Error!
JSON.stringify(str); // Error!
```

> See [test cases](test.js) for more

Note that you can still call `guardedString.toUnguardedString(str)` to convert
it back to a plain string.

### `guardedString.isProtectedString(val)`

This just returns a `boolean` if the value you pass in is a protected string or
not.

### `guardedString.assertProtectedString(val)`

This will throw an error if the value you pass in is not a protected string.

### `guardedString.toUnguardedString(str)`

This will convert any guarded string (including protected strings).

```js
let str1 = guardedString.protectString(guardedString`Hello World`);
let str2 = guardedString.toUnguardedString(str1);

console.log(typeof str1); // 'object'
console.log(typeof str2); // 'string'
```
