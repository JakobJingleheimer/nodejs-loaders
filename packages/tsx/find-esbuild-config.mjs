import { createRequire, findPackageJSON } from 'node:module';
import { emitWarning } from 'node:process';
import { fileURLToPath } from 'node:url';

/** @typedef {import('esbuild').TransformOptions} ESBuildOptions */
/** @typedef {`file://${string}`} FileURL */

/**
 * This config must contain options that are compatible with esbuild's `transform` API.
 * @private Exported for testing
 * @type {Map<FileURL, ESBuildOptions>}
 */
export const configs = new Map();

/**
 * @param {FileURL} target
 * @param {FileURL} parentURL
 */
export function findEsbuildConfig(target, parentURL) {
	if (configs.has(target)) return configs.get(target);

	// Should this be findPackageJSON(target, parentURL) ?
	const esBuildConfigLocus = findPackageJSON(target, target)?.replace(
		PJSON_FNAME,
		CONFIG_FNAME,
	);

	/** @type {ESBuildOptions} */
	let esbuildConfig;
	if (esBuildConfigLocus != null) {
		const req = createRequire(fileURLToPath(parentURL));
		try {
			esbuildConfig = req(esBuildConfigLocus)?.default;
		} catch (err) {
			if (err.code !== 'ENOENT') throw err;
		}
	}

	if (esbuildConfig == null) {
		emitWarning(
			`No esbuild config found for "${target}" relative to "${parentURL}"; using defaults.`,
		);
	}

	esbuildConfig = Object.assign({}, defaults, esbuildConfig);
	configs.set(target, esbuildConfig);

	return esbuildConfig;
}

const PJSON_FNAME = 'package.json';
const CONFIG_FNAME = 'esbuild.config.mjs';

export const defaults = {
	jsx: 'automatic',
	jsxDev: true,
	jsxFactory: 'React.createElement',
	loader: 'tsx',
	minify: true,
};
