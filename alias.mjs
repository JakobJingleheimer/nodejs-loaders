import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, URL } from 'node:url';

import _get from 'lodash-es/get.js';


const projectRoot = pathToFileURL(`${process.cwd()}/`);

const aliasFieldPaths = {
  'package.json': 'aliases',
  'tsconfig.json': 'compilerOptions.paths',
};

const aliases = (
  await readConfigFile('tsconfig.json')
  ?? await readConfigFile('package.json')
);

if (!aliases) console.warn(
  'Alias loader was registered but no aliases were found in tsconfig.json or package.json.',
  'This loader will behave as a noop (but you should probably remove it if you aren’t using it).',
);

export function resolve(specifier, ctx, next) {
  return (aliases ? resolveAliases : next)(specifier, ctx, next);
}

export async function resolveAliases(specifier, ctx, next) {
  for (const [key, dest] of aliases) {
    if (specifier === key) return next(dest, ctx);
    if (specifier.startsWith(key)) return next(specifier.replace(key, dest));
  }

  return next(specifier);
}

export function readConfigFile(filename) {
  const filepath = path.join(projectRoot.pathname, filename);

  return readFile(filepath)
    .then(JSON.parse)
    .then((contents) => _get(contents, aliasFieldPaths[filename]))
    .then(buildAliasMaps)
    .catch((err) => { if (err.code !== 'ENOENT') throw err });
}

function buildAliasMaps(config) {
  if (!config) return;

  const aliases = new Map();

  for (const rawKey of Object.keys(config)) {
    const alias = config[rawKey][0];
    const isPrefix = rawKey.endsWith('*');

    const key = isPrefix ? rawKey.slice(0, -1) /* strip '*' */ : rawKey;
    const baseDest = isPrefix ? alias.slice(0, -1) /* strip '*' */ : alias;
    const dest = baseDest[0] === '/' || URL.canParse(baseDest)
      ? baseDest
      : (new URL(baseDest, projectRoot)).href;

    aliases.set(key, dest);
  }

  return aliases;
}

