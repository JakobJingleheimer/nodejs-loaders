# `npm:` protocol loader for Node.js

<img src="https://raw.githubusercontent.com/nodejs-loaders/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

[![npm version](https://img.shields.io/npm/v/@nodejs-loaders/media.svg)](https://www.npmjs.com/package/nodejs-loaders/css-module)
![unpacked size](https://img.shields.io/npm/unpacked-size/@nodejs-loaders/css-module)

**Environments**: dev, test

**Compatible APIs**: [`module.register`](https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options), [`module.registerHooks`](https://nodejs.org/api/module.html#moduleregisterhooksoptions)

This loader allows you to load modules using the `npm:` protocol in Node.js. This syntact is introduce by Deno to [import npm packages](https://docs.deno.com/runtime/fundamentals/node/#using-npm-packages).

Keep as mind that this loader may be deprecated in the future, if Node.js introduce a native support for this feature. [issue about `npm:` protocol](https://github.com/nodejs/node/issues/44492)

```js
import express from 'npm:express';
```
