# Nodejs Loaders

<img src="./logo.svg" height="100" width="100" alt="" />

[![npm version](https://img.shields.io/npm/v/nodejs-loaders.svg)](https://www.npmjs.com/package/nodejs-loaders)
![size](https://img.shields.io/github/languages/code-size/JakobJingleheimer/nodejs-loaders)
![coverage](https://img.shields.io/coverallsCoverage/github/JakobJingleheimer/nodejs-loaders)
![tests](https://github.com/JakobJingleheimer/nodejs-loaders/actions/workflows/ci.yml/badge.svg)

This package provides a variety of loaders to facilitate a quick and easy local development and CI testing environment.

## Local dev

```console
--loader=nodejs-loaders/dev/alias \
--loader=nodejs-loaders/dev/tsx \
--loader=nodejs-loaders/dev/svgx \
--loader=nodejs-loaders/dev/mismatched-format
```

Sequence here **is** important (you want to correct a mismatched package format before you try to use it, and SVGX is a form of JSX, so it needs TSX loader to finish the job).

### Alias

This loader supports 2 options, both of which follow TypeScript's [`paths`](https://www.typescriptlang.org/docs/handbook/modules/reference.html#paths); if you're using TypeScript, this loader handles the (important) half of work TypeScript ignores. It checks for `tsconfig.json` in the project root (the current working directory) and builds aliases from `compilerOptions.paths` if it exists.

If you're not using TypeScript (or you're not using `compilerOptions.paths`¹), you can specify aliases in `package.json` in the project root (the current working directory) in the same way `compilerOptions.paths` are defined:

```json
{
  "aliases": {
    "…/*": "./src/*",
    "CONF": "./config.json"
  }
}
```

¹ Note that if you are using aliases and do not set up `compilerOptions.paths`, TypeScript will make your life hell.

#### A simple prefix

This is commonly used to reference the project root; common prefixes are `@/` (or some variation like `@app/`) and `…/`: `import foo from '…/app/foo.mts;` → `${project_root}/src/app/foo.mts`.

> [!TIP]
> Due to package namespacing (aka ["scopes"](https://docs.npmjs.com/about-scopes)) it may be best to avoid using the "at" symbol (`@`) since that could lead to confusion over what is a package and what is an alias (especially if you eventually add a package named with the alias you're using).

> [!IMPORTANT]
> When configuring these aliases, ensure astrisks (`*`) are used correctly; configuring this for TypeScript can be extremely confusing. See [_Why are these tsconfig paths not working?_](https://stackoverflow.com/q/50679031) for some of the litany of ways configuration can fail.

#### A pointer

This is a static specifier similar to a bare module specifier: `foo` → `${project_root}/src/app/foo.mts`. This may be useful when you have a commonly referenced file like config (which may conditionally not even live on the same filesystem): `import CONF from 'conf';` → `${project_root}/config.json`.

## Mismatched format

Many packages are incorrectly configured, claiming to be ESM yet not actually surfacing ESM. This is most commonly due to a `package.json` using the non-standard `"module"` field:

```json
{
  "name": "mismatched-example",
  "type": "module",
  "main": "./dist/cjs.js",
  "module":  "./dist/esm.js"
}
```

`mismatched-example` has told node its main entry point is `./dist/cjs.js` and that it is ESM. Therefore, trying to import this package will (likely) explode in a `SyntaxError` as node loads `./dist/cjs.js` as ESM (instead of the CJS it actually is).

This loader detects the explosion and re-instructs node to ignore the misconfiguration and instead load `./dist/cjs.js` as CJS (the loader doesn't try to find a potential ESM main entry point the package may have—there are too many options, several of which are non-standard).

Note to package authors reading this: The simplest fix here is to distribute only CJS. See [_Configuring CommonJS & ES Modules for Node.js_](https://dev.to/jakobjingleheimer/configuring-commonjs-es-modules-for-nodejs-12ed) for a thorough explanation of options.

> [!IMPORTANT]
> Node.js now has experimental support that better handles this via [`--experimental-detect-module`](https://nodejs.org/api/cli.html#--experimental-detect-module). This loader may be re-purposed to address the root of the problem instead: that `mismatched-example`'s configuration is wrong.

## JSX / TS(X)

This loader checks for a `esbuild.config.mjs` in the project root (if you want to keep it elsewhere, consider a symlink in the project root pointing to its actual location); only options for [esbuild's "transform" API](https://esbuild.github.io/api/#transform) are valid (esbuild handles looking for a tsconfig). When none is found, it uses a few necessary default.

This loader does _not_ handle TypeScript's file extension nonsense. Import specifiers must use the actual file extension of the file actually on disk:

```
./
  ├ …
  └ foo.ts
```

💥 `import foo from './foo.js';`<br />
✅ `import foo from './foo.ts';`

<details>
<summary>Supported file extensions</summary>

* `.jsx`
* `.mts`
* `.ts`
* `.tsx`
</details>

## CI testing

```console
--loader=nodejs-loaders/testing/css-module \
--loader=nodejs-loaders/testing/media \
--loader=nodejs-loaders/testing/text
```

Sequence here is not important.

### CSS Module

This loads the module as a plain-object of simple key-value pairs of the css specifiers like:

```css
/* main.module.css */
#Bar { font-weight: bold }

.Foo {
  text-decoration: none

  .Baz { color: red }
}

.Qux .Zed { font-size: 1.1em }
```

```js
import styles from 'main.module.css';

styles.Bar; // 'Bar'
styles.Baz; // 'Baz'
styles.Foo; // 'Foo'
styles.Zed; // 'Zed'
```

This ensures snapshots are unaffected by unrelated changes.

> [!WARNING]
> This loader does not differentiate classes vs ids; thus duplicate names can create a last-wins conflict. For example `#Foo` and `.Foo` will result in just `Foo: 'Foo'`. This is unlikely to cause any real-world problems (and you probably shouldn't be doing this anyway).

### Media

This loader returns the specifier (truncated from project root / current working directory) as the default export:

```js
import photo from './team.jpg'; // photo = '[…]/team.jpg'
```

This ensures snapshots are unaffected by the file system on which the test is run.

<details>
<summary>Supported file extensions</summary>

Audio/Video:
* `.av1`
* `.mp3`
* `.mp3`
* `.mp4`
* `.ogg`
* `.webm`

Images:

* `.avif`
* `.gif`
* `.ico`
* `.jpeg`
* `.jpg`
* `.png`
* `.webp`
</details>

### Text

This loader handles files that are effectively plain text.

<details>
<summary>Supported file extensions</summary>

* `.graphql`
* `.gql`
* `.md`
* `.txt`
</details>
