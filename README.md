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

guardedString.isGuarded(myString); // >> boolean
guardedString.assertGuarded(myString); // >> maybe throws
guardedString.toUnguarded(myString); // >> unguarded string (throws on other value types)

myString + ''; // 'My very important (but not too important) string'

guardedString.freeze(myString);
guardedString.isFrozen(myString);
guardedString.assertFrozen(myString);

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

guardedString.isGuarded(str1); // true
guardedString.isGuarded(str2); // false
```

If you want to using string methods, you can wrap your string with
`String(str)` or `guardedString.toUnguarded(str)`.

```js
let str1 = guardedString`Hello World`;
let str2 = String(str1).replace('World', 'Universe');
let str3 = guardedString.toUnguarded(str1).replace('World', 'Universe');
```

### `guardedString.isGuarded(val)`

This just returns a `boolean` if the value you pass in is a guarded string or
not.

### `guardedString.assertGuarded(val)`

This will throw an error if the value you pass in is not a guarded string.

### `guardedString.freeze(str)`

If you want to make sure that your string is not accidentally stringified, you
can call `guardedString.freeze(str)` on your guarded string and it will
prevent code from accidentally stringifying it.

```js
let str = guardedString.freeze(guardedString`Hello World`);

String(str); // Error!
str + '!'; // Error!
JSON.stringify(str); // Error!
```

> See [test cases](test.js) for more

Note that you can still call `guardedString.toUnguarded(str)` to convert
it back to a plain string.

### `guardedString.isFrozen(val)`

This just returns a `boolean` if the value you pass in is a frozen string or
not.

### `guardedString.assertFrozen(val)`

This will throw an error if the value you pass in is not a frozen string.

### `guardedString.toUnguarded(str)`

This will convert any guarded string (including frozen strings).

```js
let str1 = guardedString.freeze(guardedString`Hello World`);
let str2 = guardedString.toUnguarded(str1);

console.log(typeof str1); // 'object'
console.log(typeof str2); // 'string'
```
