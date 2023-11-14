import { extname } from 'node:path';


export async function resolve(specifier, ctx, nextResolve) {
  const nextResult = await nextResolve(specifier);

  const format = exts[extname(nextResult.url)];

  if (!format) return nextResult;

  return {
    format,
    url: nextResult.url,
  };
}

export async function load(url, ctx, nextLoad) {
  const nextResult = await nextLoad(url, ctx);

  if (!formats.has(ctx.format)) return nextResult;

  const source = `export default \`${nextResult.source}\`;`;

  return {
    format: 'module',
    source,
  };
}

export const exts = {
  '.graphql': 'graphql',
  '.gql': 'grqphql',
  '.md': 'markdown',
  '.txt': 'text',
};

export const formats = new Set(Object.values(exts));
