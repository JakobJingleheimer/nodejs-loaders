# Nodejs Loaders: Alias

<img src="../../logo.svg" height="100" width="100" alt="" />

[![npm version](https://img.shields.io/npm/v/nodejs-loaders/alias.svg)](https://www.npmjs.com/package/nodejs-loaders/alias)
![size](https://img.shields.io/github/languages/code-size/JakobJingleheimer/nodejs-loaders/alias)

**Environments**: dev, test

This loader facilitates TypeScript's [`paths`](https://www.typescriptlang.org/docs/handbook/modules/reference.html#paths), handling the (important) half of work TypeScript ignores. It looks for a `tsconfig.json` in the project root (the current working directory) and builds aliases from `compilerOptions.paths` if it exists. If your tsconfig lives in a different location, create a symlink to it from your project root.

> [!TIP]
> **If you're not using TypeScript**, consider using Node.js's [subpath imports](https://nodejs.org/api/packages.html#subpath-imports).

## A simple prefix

This is commonly used to reference the project root; common prefixes are `@/` (or some variation like `@app/`) and `…/`: `import foo from '…/app/foo.mts;` → `${project_root}/src/app/foo.mts`.

> [!TIP]
> Due to package namespacing (aka ["scopes"](https://docs.npmjs.com/about-scopes)) it may be best to avoid using the "at" symbol (`@`) since that could lead to confusion over what is a package and what is an alias (especially if you eventually add a package named with the alias you're using). You should similarly avoid the octothorpe/hash symbol (`#`) because that is used by Node.js's sub-path imports.

> [!IMPORTANT]
> When configuring these aliases, ensure astrisks (`*`) are used correctly; configuring this for TypeScript can be extremely confusing. See [_Why are these tsconfig paths not working?_](https://stackoverflow.com/q/50679031) for some of the litany of ways configuration can fail.

## A pointer

This is a static specifier similar to a bare module specifier: `foo` → `${project_root}/src/app/foo.mts`. This may be useful when you have a commonly referenced file like config (which may conditionally not even live on the same filesystem): `import CONF from 'conf';` → `${project_root}/config.json`.
