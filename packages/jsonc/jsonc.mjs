import { getFilenameExt } from '@nodejs-loaders/parse-filename';

/**
 *
 * strip comments from JSONC
 * @param {string} source
 * @returns {string}
 */
const jsonc2json = (source) => {
	const lines = source.split('\n');
	const jsonLines = [];
	let inComment = false;

	for (const line of lines) {
		const trimmedLine = line.trim();
		console.log('trimmedLine', trimmedLine);

		if (trimmedLine.startsWith('//')) {
			continue;
		}

		if (trimmedLine.startsWith('/*') && trimmedLine.endsWith('*/')) {
			continue;
		}

		if (trimmedLine.startsWith('/*')) {
			inComment = true;
			continue;
		}

		if (trimmedLine.endsWith('*/')) {
			inComment = false;
			continue;
		}

		if (inComment) {
			continue;
		}

		if (trimmedLine === '') {
			continue
		}

		jsonLines.push(line);
	}

	return jsonLines.join('\n');
}

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

	const rawSource = '' + nextResult.source;
	const parsed = jsonc2json(rawSource);

	console.log('parsed',parsed);

	return {
		format: 'json',
		source: parsed,
	}
}
export { loadJSONc as load }
