import process from 'node:process';

import { getFilenameExt } from '@nodejs-loaders/parse-filename';

/**
 * @type {import('node:module').ResolveHook}
 */
async function resolveMedia(specifier, ctx, nextResolve) {
	const nextResult = await nextResolve(specifier);

	// Check against the fully resolved URL, not just the specifier, in case another loader has
	// something to contribute to the resolution.
	if (!exts.has(getFilenameExt(nextResult.url))) return nextResult;

	return {
		...ctx,
		// @ts-ignore https://github.com/DefinitelyTyped/DefinitelyTyped/pull/71493
		format: 'media',
		url: nextResult.url,
	};
}
export { resolveMedia as resolve };

/**
 * @type {import('node:module').LoadHook}
 */
async function loadMedia(url, ctx, nextLoad) {
	// @ts-ignore https://github.com/DefinitelyTyped/DefinitelyTyped/pull/71493
	if (ctx.format !== 'media') return nextLoad(url);

	const source = `export default '${url.replace(cwd, '[…]')}';`;

	return {
		format: 'module',
		shortCircuit: true, // There's nothing else for another loader to do, so signal to stop.
		source,
	};
}
export { loadMedia as load };

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
