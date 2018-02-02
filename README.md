# guarded\`string\`

> Prevent accidentally introducing XSS holes with the strings in your app

Hold your friends close, and your strings closer

## Installation

```
yarn add guarded-string
```

## Usage

> **Important!** This should be used for things like preventing XSS attacks, not for hiding sensitive information.

```js
import guardedString from 'guarded-string';

const myString = guardedString`My very important (but not too important) string`;

guardedString.isGuardedString(myString); // >> boolean
guardedString.assertGuardedString(myString); // >> maybe throws
guardedString.toUnguardedString(myString); // >> unguarded string (throws on other value types)

myString + 'hi'; // Error!
JSON.stringify(myString); // Error!
// etc.
```

## Examples

```js
guardedString`foo`; // Works!
guardedString`foo${1}`; // Error!
guardedString(['foo']); // Error!
```

```js
let str = guardedString`foo`;

str.toString(); // Error!
'' + str; // Error!
String(str); // Error!
`${str}`; // Error!
1 * str; // Error!
JSON.stringify(str); // Error!
```

> See [test cases](test.js) for more
