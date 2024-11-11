# Nodejs Loaders: SVGX

<img src="../../logo.svg" height="100" width="100" alt="" />

[![npm version](https://img.shields.io/npm/v/nodejs-loaders/svgx.svg)](https://www.npmjs.com/package/nodejs-loaders/svgx)
![size](https://img.shields.io/github/languages/code-size/JakobJingleheimer/nodejs-loaders/svgx)

**Environment**: test

This loader facilitates running tests against JSX/TSX components that consume SVGs as JSX/TSX. It looks for a `esbuild.config.mjs` in the project root (the current working directory); if your config lives in a different location, create a symlink to it from your project root. Only options for [esbuild's "transform" API](https://esbuild.github.io/api/#transform) are valid (esbuild handles looking for a tsconfig). When none is found, it uses a few necessary default.

This loader does _not_ handle TypeScript's file extension nonsense. Import specifiers must use the actual file extension of the file actually on disk:

```
./
  ├ …
  └ foo.ts
```

💥 `import foo from './foo.js';`<br />
✅ `import foo from './foo.ts';`

If your project contains erroneous specifiers like above, use the [correct-ts-specifiers](https://github.com/JakobJingleheimer/correct-ts-specifiers) codemod to fix your source-code.

<details>
<summary>Supported file extensions</summary>

* `.jsx`
* `.mts`
* `.ts`
* `.tsx`
</details>
