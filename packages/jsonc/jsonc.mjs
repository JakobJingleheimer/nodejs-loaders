import { getFilenameExt } from '@nodejs-loaders/parse-filename';
import stripJsonComments from 'strip-json-comments';

/**
 * @type {import('node:module').ResolveHook}
 */
function resolveJSONC(specifier, ctx, nextResolve) {
	const nextResult = nextResolve(specifier);
	const ext = getFilenameExt(nextResult.url);

	/**
	 * On Node.js v20, v22, v23 the extension **and** the `importAttributes`
	 * are needed to import correctly json files. So we want to have same
	 * behavior than Node.js.
	 */
	if (ext === '.jsonc' && ctx.importAttributes?.type === 'jsonc') {
		return {
			...nextResult,
			format: 'jsonc',
		};
	}

	return nextResult;
}
export { resolveJSONC as resolve };

/**
 * @type {import('node:module').LoadHook}
 */
function loadJSONC(url, ctx, nextLoad) {
	const nextResult = nextLoad(url, ctx);

	if (ctx.format !== 'jsonc') return nextResult;

	const rawSource = '' + nextResult.source; // byte array → string

	console.log('rawSource', rawSource);
	const stripped = stripJsonComments(rawSource);

	return {
		format: 'json',
		source: stripped,
	};
}
export { loadJSONC as load };
