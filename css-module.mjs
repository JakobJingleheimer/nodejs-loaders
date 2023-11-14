// This loader provides a basic facsimile of CSS Modules intended for testing.
// Use something like esbuild to handle this in production.

import parseCSS from 'css-parse';


export async function resolve(specifier, ctx, nextResolve) {
  const nextResult = await nextResolve(specifier);

  if (!specifier.endsWith('.module.css')) return nextResult;

  return {
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

  for (const rule of parseCSS(rawSource).stylesheet.rules) {
    if (rule.type !== 'rule') continue;

    const classnames = rule.selectors[0].match(SELECTOR_TO_CLASS_NAME_RGX) ?? new Array()

    for (const classname of classnames) output.set(classname, classname);
  }

  return Object.fromEntries(output);
}

/**
 * Grab any classnames from a selector, which may have non-classnames anywhere within the selector.
 */
const SELECTOR_TO_CLASS_NAME_RGX = /(?<=\.)-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g;
