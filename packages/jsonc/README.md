# Nodejs Loaders: jsonc

<img src="https://raw.githubusercontent.com/JakobJingleheimer/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

[![npm version](https://img.shields.io/npm/v/@nodejs-loaders/jsonc.svg)](https://www.npmjs.com/package/nodejs-loaders/jsonc)
![unpacked size](https://img.shields.io/npm/unpacked-size/@nodejs-loaders/jsonc)

**Environments**: dev, test

To import JSONC files when using this loader, you will have to use `jsonc` as the file extension **and** in the [import attribute](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with).

```js
import data from './data.jsonc' with { type: 'jsonc' };
```

```jsonc
{
  // JSONC file
  "key": "value"
  /* comment */
}
```

> [!WARNING]
> The `jsonc` import attribute is required to use this loader and case-sensitive. So make sure to use `jsonc` and not `JSONC` or `Jsonc`.

<details>
<summary>Supported file extensions</summary>

* `.jsonc`
</details>
