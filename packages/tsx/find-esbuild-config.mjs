import { createRequire, findPackageJSON } from 'node:module';
import { fileURLToPath } from 'node:url';

/** @typedef {import('esbuild').TransformOptions} ESBuildOptions */

/**
 * This config must contain options that are compatible with esbuild's `transform` API.
 * @type {Map<URL['href'], ESBuildOptions>}
 */
export const configs = new Map;

/**
 * @param {URL['href']} target
 * @param {URL['href']} parentURL
 */
export function findEsbuildConfig(target, parentURL) {
  if (configs.has(target)) return configs.get(target);

	const esBuildConfigLocus = findPackageJSON(target, target)?.replace(PJSON_FNAME, CONFIG_FNAME);

	const req = createRequire(fileURLToPath(parentURL));

	/** @type {ESBuildOptions} */
	let esbuildConfig;
	try {
		esbuildConfig = req(esBuildConfigLocus)?.default;
	} catch (err) {
		if (err.code !== 'ENOENT') throw err;

		process.emitWarning(CONFIG_NOT_FOUND);
	}

	esbuildConfig = Object.assign({}, defaults, esbuildConfig);
	configs.set(target, esbuildConfig);

	return esbuildConfig;
}

const PJSON_FNAME = 'package.json';
const CONFIG_FNAME = 'esbuild.config.mjs';
const CONFIG_NOT_FOUND = 'No esbuild config found in project root. Using default config.';

export const defaults = {
	jsx: 'automatic',
	jsxDev: true,
	jsxFactory: 'React.createElement',
	loader: 'tsx',
	minify: true,
};
