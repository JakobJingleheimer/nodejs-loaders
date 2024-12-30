# `npm:` protocol loader for Node.js

<img src="https://raw.githubusercontent.com/nodejs-loaders/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

[![npm version](https://img.shields.io/npm/v/@nodejs-loaders/npm-protocol.svg)](https://www.npmjs.com/package/@nodejs-loaders/npm-protocol)
![unpacked size](https://img.shields.io/npm/unpacked-size/@nodejs-loaders/npm-protocol)

**Environments**: dev, test

**Compatible APIs**: [`module.register`](https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options), [`module.registerHooks`](https://nodejs.org/api/module.html#moduleregisterhooksoptions)

This loader enables loading modules using the `npm:` protocol in Node.js. This syntax is used most notably by Deno to [import npm packages](https://docs.deno.com/runtime/fundamentals/node/#using-npm-packages).

There is discussion within Node.js to introduce native support for this feature: [nodejs/node#44492](https://github.com/nodejs/node/issues/44492)

```js
import express from 'npm:express';
```
