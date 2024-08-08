import { transform } from '@swc/core';

import { getFilenameExt } from './parse-filename.mjs';

export async function resolve(specifier, ctx, nextResolve) {
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

export async function load(url, ctx, nextLoad) {
  if (!formats.has(ctx.format)) return nextLoad(url); // not j|tsx

  const format = 'module';
  const nextResult = await nextLoad(url, { format });
  let rawSource = ''+nextResult.source; // byte array → string


  /**
   * SWC configuration object.
   * By default, SWC will use the `swcrc` file if it exists and override the options below.
   * 
   * @see https://swc.rs/docs/configuring-swc
   * @type {import('@swc/core').Options}
   */
  const config = {
    swcrc: true,
    sourceMaps: false,
    minify: false,
    jsc: {
      parser: {
        syntax: ctx.format === 'jsx' ? 'ecmascript' : 'typescript',
        jsx: ctx.format === 'jsx',
        tsx: ctx.format === 'tsx',
      },
      transform: {
        react: {
          runtime: 'automatic',
          pragma: 'React.createElement',
          pragmaFrag: 'React.Fragment',
          development: true,
          useBuiltins: true,
        },
      }
    }
  };

  const { code: source } = await transform(rawSource, config);

  return {
    format,
    source,
  };
}

export const jsxExts = new Set([
  '.jsx',
]);

export const tsxExts = new Set([
  '.mts',
  '.ts',
  '.tsx',
]);

const formats = new Set(['jsx', 'tsx']);
