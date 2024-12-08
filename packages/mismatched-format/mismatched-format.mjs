import { getFilenameExt } from '@nodejs-loaders/parse-filename';

import { containsCJS } from './contains-cjs.mjs';

/**
 * @typedef {{
 *   format: string,
 *   parentURL: URL['href']
 * }} LoadContext
 */
/**
 * @callback LoadHook
 * @param {URL['href']} url
 * @param {LoadContext} ctx
 * @param {LoadHook} next
 * @returns {Promise<{ format: string, source: Buffer|string }>}
 */

/**
 * This loader attempts to detect and override misconfigured packages, such as those that declare
 * themselves as ESM but are actually CJS, and vice versa.
 * @type {LoadHook}
 */
function loadMismatchedFormat(url, ctx, next) {
    if (!exts.has(getFilenameExt(url))) return next(url);

    // Ensure the ESMLoader is used to read the contents.
    // It may throw, in which case we'll probably get a telling error we can use to know it was CJS.
    return next(url, { ...ctx, format: 'module' })
        .then((result) => {
            if (containsCJS('' + result.source)) {
                throw new Error('CommonJS');
            }

            return result;
        })
        .catch(async (err) => {
            if (
                (err?.message.includes('require') &&
                    err?.message.includes('import')) ||
                err?.message.includes('CommonJS')
            ) {
                return { format: 'commonjs' };
            }

            throw err;
        });
}
export { loadMismatchedFormat as load };

const exts = new Set(['.js']);
