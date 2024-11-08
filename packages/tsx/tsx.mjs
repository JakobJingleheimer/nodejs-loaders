import { createRequire, findPackageJSON } from 'node:module';
import { fileURLToPath, } from 'node:url';

import { transform } from 'esbuild';

import { getFilenameExt } from '@nodejs-loaders/parse-filename';


// This config must contain options that are compatible with esbuild's `transform` API.
let esbuildConfig;
function findEsbuildConfig(parentURL) {
  if (esbuildConfig != null) return esbuildConfig;

  const esBuildConfigLocus = findPackageJSON(parentURL)
    .replace('package.json', 'esbuild.config.mjs');

  const req = createRequire(fileURLToPath(parentURL));
  try {
    esbuildConfig = req(esBuildConfigLocus).default;
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;

    process.emitWarning('No esbuild config found in project root. Using default config.')
  }

  return esbuildConfig = Object.assign({
    jsx: 'automatic',
    jsxDev: true,
    jsxFactory: 'React.createElement',
    loader: 'tsx',
    minify: true,
  }, esbuildConfig);
}

async function resolveTSX(specifier, ctx, nextResolve) {
  const nextResult = await nextResolve(specifier);
  // Check against the fully resolved URL, not just the specifier, in case another loader has
  // something to contribute to the resolution.
  const ext = getFilenameExt(nextResult.url);

  if (jsxExts.has(ext)) return {
    ...nextResult,
    format: 'jsx',
  };

  if (tsxExts.has(ext)) return {
    ...nextResult,
    format: 'tsx',
  };

  return nextResult;
}
export { resolveTSX as resolve }

async function loadTSX(url, ctx, nextLoad) {
  if (!formats.has(ctx.format)) return nextLoad(url); // not j|tsx

  const format = 'module';
  const nextResult = await nextLoad(url, { format });
  let rawSource = ''+nextResult.source; // byte array → string

  findEsbuildConfig(ctx.parentURL);

  if (esbuildConfig.jsx === 'transform') rawSource = `import * as React from 'react';\n${rawSource}`;

  const { code: source, warnings } = await transform(rawSource, esbuildConfig)
    .catch(({ errors }) => {
      for (const {
        location: { column, line, lineText },
        text,
      } of errors) {
        console.error(`TranspileError: ${text}\n    at ${url}:${line}:${column}\n    at: ${lineText}\n`);
      }

      return {};
    });

  if (warnings?.length) console.warn(...warnings);

  return {
    format,
    source,
  };
}
export { loadTSX as load }

export const jsxExts = new Set([
  '.jsx',
]);

export const tsxExts = new Set([
  '.mts',
  '.ts',
  '.tsx',
]);

const formats = new Set(['jsx', 'tsx']);
