# Nodejs Loaders: Svelte

<img src="https://raw.githubusercontent.com/nodejs-loaders/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

[![npm version](https://img.shields.io/npm/v/@nodejs-loaders/svelte.svg)](https://www.npmjs.com/package/nodejs-loaders/svelte)
![unpacked size](https://img.shields.io/npm/unpacked-size/@nodejs-loaders/svelte)

**Environments**: dev, test

**Compatible APIs**: [`module.register`](https://nodejs.org/api/module.html#moduleregisterspecifier-parenturl-options)


This loader enables importing [Svelte](https://svelte.dev) files, converting them to a plain javascript object. Svelte is a component framework that compiles to vanilla JavaScript.

It's useful for importing Svelte components in Node.js environments, such as testing or development.

<details>
<summary>Supported file extensions</summary>

* `.svelte`
</details>

> [!WARNING]
> `.svelte.ts` and `.svelte.js` files are not supported. This loader only supports `.svelte` files.
> [Svelte documentation](https://svelte.dev/docs/svelte/svelte-js-files) about theses files.

**Alternatives**

* [`esm-loader-svelte`](https://www.npmjs.com/package/esm-loader-svelte)
