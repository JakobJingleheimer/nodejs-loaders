import { createRequire} from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// This config must contain options that are compatible with esbuild's `transform` API.
let esbuildConfig;

/**
 * @param {URL['href']} parentURL
 */
export function findEsbuildConfig(parentURL){
  if (esbuildConfig != null) return esbuildConfig

	const absolutePath = path.resolve(fileURLToPath(parentURL));
	const esBuildConfigLocus = absolutePath.replace(/\/[^/]+$/, '/esbuild.config.mjs');

	const req = createRequire(fileURLToPath(parentURL));
  try {
    esbuildConfig = req(esBuildConfigLocus)?.default;
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;

    process.emitWarning('No esbuild config found in project root. Using default config.')
  }

  return esbuildConfig = Object.assign({
    jsx: 'automatic',
    jsxDev: true,
    jsxFactory: 'React.createElement',
    loader: 'tsx',
    minify: true,
  }, esbuildConfig);
}
