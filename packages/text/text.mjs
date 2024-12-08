import { getFilenameExt } from '@nodejs-loaders/parse-filename';

async function resolveText(specifier, ctx, nextResolve) {
    const nextResult = await nextResolve(specifier);

    const format = exts[getFilenameExt(nextResult.url)];

    if (!format) return nextResult;

    return {
        ...ctx,
        format,
        url: nextResult.url,
    };
}
export { resolveText as resolve };

async function loadText(url, ctx, nextLoad) {
    const nextResult = await nextLoad(url, ctx);

    if (!formats.has(ctx.format)) return nextResult;

    const source = `export default \`${nextResult.source}\`;`;

    return {
        format: 'module',
        source,
    };
}
export { loadText as load };

export const exts = {
    '.graphql': 'graphql',
    '.gql': 'graphql',
    '.md': 'markdown',
    '.txt': 'text',
};

export const formats = new Set(Object.values(exts));
