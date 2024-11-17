import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url'
import { styleText } from 'node:util';
import { compile, preprocess } from 'svelte/compiler'
import { getFilenameExt } from '@nodejs-loaders/parse-filename';

import { findSvelteKitConfig } from './find-sveltekit-config.mjs';

/**
 * @type {import('node:module').ResolveHook}
 */
async function resolveSvelte(specifier, ctx, nextResolve) {
	const nextResult = await nextResolve(specifier);

	const ext = getFilenameExt(nextResult.url);

	if (ext === '.svelte')
		return {
			...nextResult,
			format: 'svelte',
		};


	return nextResult;
}
export { resolveSvelte  as resolve };

/**
 * @type {import('node:module').LoadHook}
 */
async function loadSvelte(url, ctx, defaultLoad) {
	if (ctx.format !== 'svelte') return defaultLoad(url);

	const svelteKitConfig = await readFile(findSvelteKitConfig(ctx.parentURL), 'utf8').then(JSON.parse).catch(() => ({}));
	const format = 'module';
	const nextResult = await nextLoad(url, { format });
  	const rawSource = ''+nextResult.source; // byte array → string
	const filename = fileURLToPath(url)

	let processed = { map: undefined };
    const preprocessConfig = preprocess || svelteKitConfig.preprocess;
	if (preprocessConfig) {
		processed = await preprocessor(rawSource, preprocessConfig, {
			filename,
		})
		rawSource = String(processed.code)
	}

	// compile
	const {js, warnings} = compile(rawSource, {
		filename,
		css: false,
		preprocess: processed,
		sourcemap: preprocessConfig ? processed.map : undefined,
		...svelteKitConfig.compilerOptions
	})

	warnings.forEach((warning) => {
		console.log(
			`${styleText(['bold', 'yellow'], 'Warning')}: ${warning.message} at ${filename}:${warning.start.line}:${warning.start.column}`
		)
	})

	return {
		format,
		source: js.code,
		map: js.map
	};
};
export { loadSvelte as load };
