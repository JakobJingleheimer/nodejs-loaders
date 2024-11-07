import process from 'node:process';

import { getFilenameExt } from '@nodejs-loaders/parse-filename';


async function resolveMedia(specifier, ctx, nextResolve) {
  const nextResult = await nextResolve(specifier);

  // Check against the fully resolved URL, not just the specifier, in case another loader has
  // something to contribute to the resolution.
  if (!exts.has(getFilenameExt(nextResult.url))) return nextResult;

  return {
    ...ctx,
    format: 'media',
    url: nextResult.url,
  }
}
export { resolveMedia as resolve }

async function loadMedia(url, ctx, nextLoad) {
  if (ctx.format !== 'media') return nextLoad(url);

  const source = `export default '${url.replace(cwd, '[…]')}';`;

  return {
    format: 'module',
    shortCircuit: true, // There's nothing else for another loader to do, so signal to stop.
    source,
  };
}
export { loadMedia as load }

const cwd = process.cwd();

export const exts = new Set([
  /**
   * A/V
   */
  '.av1',
  '.mp3',
  '.mp3',
  '.mp4',
  '.ogg',
  '.webm',
  /**
   * images
   */
  '.avif',
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.png',
  '.webp',
]);
