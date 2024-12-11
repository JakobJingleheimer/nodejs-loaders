import { getFilenameExt } from '@nodejs-loaders/parse-filename';

/**
 * @type {import('node:module').ResolveHook}
 */
async function resolveJSONc(specifier, ctx, nextResolve) {
	const nextResult = await nextResolve(specifier);
	const ext = getFilenameExt(nextResult.url);

	if (ext === '.jsonc' && ctx.importAttributes.type === 'jsonc')
		return {
			...nextResult,
			format: 'jsonc'
		};

	return nextResult;
}
export { resolveJSONc as resolve }

/**
 * @type {import('node:module').LoadHook}
 */
async function loadJSONc(url, ctx, nextLoad) {
	if (ctx.format !== 'jsonc') return nextLoad(url);
	const nextResult = await nextLoad(url, ctx);

	return {
		format: nextResult.format,
		source: nextResult.source,
		shortCircuit: true,
	}
}
export { loadJSONc as load }
