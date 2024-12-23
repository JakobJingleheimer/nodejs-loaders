import stripJsonComments from 'strip-json-comments';

/**
 * @type {import('node:module').ResolveHook}
 */
async function resolveJSONC(specifier, ctx, nextResolve) {
	const nextResult = await nextResolve(specifier);

	if (ctx.importAttributes?.type === 'jsonc')
		return {
			...nextResult,
			format: 'jsonc',
		};

	return nextResult;
}
export { resolveJSONC as resolve };

/**
 * @type {import('node:module').LoadHook}
 */
async function loadJSONC(url, ctx, nextLoad) {
	const nextResult = await nextLoad(url, ctx);

	if (ctx.format !== 'jsonc') return nextResult;

	const rawSource = '' + nextResult.source; // byte array → string
	const stripped = stripJsonComments(rawSource);

	return {
		format: 'json',
		source: stripped,
	};
}
export { loadJSONC as load };
