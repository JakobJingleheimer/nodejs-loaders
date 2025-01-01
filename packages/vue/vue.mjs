import { stripExtras } from '@nodejs-loaders/parse-filename';
import {} from '@vue/compiler-sfc';

/**
 * @type {import('node:module').ResolveHook}
 */
const resolveVue = async (specifier, ctx, nextResolve) => {
	const nextResult = await nextResolve(specifier);

	const ext = stripExtras(nextResult.url).endsWith('.vue');

	if (ext) {
		return {
			...nextResult,
			format: 'module',
		};
	}

	return nextResult;
};
export { resolveVue as resolve };

/**
 * @type {import('node:module').LoadHook}
 */
const loadVue = async (url, ctx, nextLoad) => {
	if (ctx.format !== 'module') return nextLoad(url);

	const nextResult = await nextLoad(url, ctx);
	const rawSource = '' + nextResult.source; // byte array → string

	// found a way to parse the SFC
};
export { loadVue as load };
