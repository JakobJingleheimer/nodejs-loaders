import _camelCase from 'lodash.camelcase';
import _upperFirst from 'lodash.upperfirst';

import { getFilenameParts } from '@nodejs-loaders/parse-filename';


const nonWords = /[\W$]/;

/**
 * Read an SVG file (which is text) and build a react component that returns the SVG.
 */
async function loadSVGX(url, ctx, next) {
  const { ext, ...others } = getFilenameParts(url);
  const base = pascalCase(others.base);

  if (ext !== '.svg') return next(url);

  if (nonWords.test(base)) {
    throw new SyntaxError([
      'Cannot generate a react component name from filename',
      `"${base}"`,
      'as it contains character(s) illegal for JavaScript identifiers',
    ].join(' '));
  }

  const source = `export default function ${base}() { return (\n${(await next(url, { format: 'jsx' })).source}); }`;

  return {
    ...ctx,
    format: 'module',
    source,
  };
}
export { loadSVGX as load }

/**
 * Convert a string to quasi-PascalCase.
 * @param {string} input The string to transform.
 * @returns {string} The transformed string.
 *
 * @example
 * foo-bar → FooBar
 * i/o stream → IOStream
 */
function pascalCase(input) {
  return _upperFirst(_camelCase(input));
}
