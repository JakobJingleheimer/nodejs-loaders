import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';


const projectRoot = new URL('../..', import.meta.url);
const tsconfigUrl = fileURLToPath(new URL('tsconfig.json', projectRoot));
const {
  prefixAliases,
  simpleAliases,
} = await readFile(tsconfigUrl)
  .then((str) => JSON.parse(str))
  .then((contents) => contents?.compilerOptions?.paths)
  .then(buildAliasMaps)
  .catch((err) => { if (err.code !== 'ENOENT') throw err });

const hasAliases = prefixAliases.size || simpleAliases.size;

export async function resolve(specifier, ctx, next) {
  if (
    !hasAliases
    || !specifier.startsWith('@/')
  ) return next(specifier);

  if (simpleAliases.has(specifier)) return next(simpleAliases.get(specifier));

  for (const [prefix, replacement] of prefixAliases) {
    if (specifier.startsWith(prefix)) return next(specifier.replace(prefix, replacement));
  }

  throw new Error(`No match found for ${specifier}`);
}

function buildAliasMaps(paths) {
  const prefixAliases = new Map();
  const simpleAliases = new Map();

  const output = {
    prefixAliases,
    simpleAliases,
  };

  if (paths) for (const path of Object.keys(paths)) {
    const value = paths[path][0];

    if (path.endsWith('*')) {
      prefixAliases.set(
        path.slice(0, -1), // strip '*'
        (new URL(value.slice(0, -1) /* strip '*' */, projectRoot)).href,
      )
    } else {
      simpleAliases.set(
        path,
        (new URL(value, projectRoot)).href,
      );
    }
  }

  return output;
}
