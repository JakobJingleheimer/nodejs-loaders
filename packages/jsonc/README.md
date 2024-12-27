# Nodejs Loaders: jsonc

<img src="https://raw.githubusercontent.com/nodejs-loader/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

[![npm version](https://img.shields.io/npm/v/@nodejs-loaders/jsonc.svg)](https://www.npmjs.com/package/nodejs-loaders/jsonc)
![unpacked size](https://img.shields.io/npm/unpacked-size/@nodejs-loaders/jsonc)

**Environments**: dev, test

**Compatible APIs**: [`module.register`](https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options), [`module.registerHooks`](https://nodejs.org/api/module.html#moduleregisterhooksoptions)

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

> [!IMPORTANT]
> For consistency with Node.js's support for `json` imports, an import attribute is required for `jsonc` (case-sensitive: `jsonc`, not `JSONC`).
> For consistency with Node.js's support for `json` imports, an import attribute is required for `jsonc` (case-sensitive: `jsonc`, not `JSONC`).

<details>
<summary>Supported file extensions</summary>

* `.jsonc`
</details>
