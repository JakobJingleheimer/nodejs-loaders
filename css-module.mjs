// This loader provides a basic facsimile of CSS Modules intended for testing.
// Use something like esbuild, postcss to handle this in production.

import postcss from 'postcss';

import { stripExtras } from './parse-filename.mjs';


export async function resolve(specifier, ctx, nextResolve) {
  const nextResult = await nextResolve(specifier);

  if (!stripExtras(specifier).endsWith('.module.css')) return nextResult;

  return {
    ...ctx,
    format: 'cssmodule',
    url: nextResult.url,
  };
}

export async function load(url, ctx, nextLoad) {
  const nextResult = await nextLoad(url, ctx);

  if (ctx.format !== 'cssmodule') return nextResult;

  const rawSource = '' + nextResult.source;
  const parsed = parseCssToObject(rawSource);

  return {
    format: 'json',
    source: JSON.stringify(parsed),
  };
}

function parseCssToObject(rawSource) {
  const output = new Map(); // Map is best for mutation

  const postcssResult = postcss.parse(rawSource).toJSON();


  for (const rule of postcssResult.nodes) {
    if (rule.type !== 'rule') continue;

    const classnames = rule.selector.match(SELECTOR_TO_CLASS_NAME_RGX) ?? new Array()

    for (const classname of classnames) output.set(classname, classname);
  }

  return Object.fromEntries(output);
}

/**
 * Grab any classnames from a selector, which may have non-classnames anywhere within the selector.
 */
const SELECTOR_TO_CLASS_NAME_RGX = /(?<=\.)-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g;
