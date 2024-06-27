import containsCJS from "./containsCJS.mjs";
import { getFilenameExt } from "./parse-filename.mjs";

/**
 * This loader attempts to detect and override misconfigured packages, such as those that declare
 * themselves as ESM but are actually CJS, and vice versa.
 */
export async function load(url, ctx, next) {
	if (!exts.has(getFilenameExt(url))) return next(url);

	// Ensure the ESMLoader is used to read the contents.
	// It may throw, in which case we'll probably get a telling error we can use to know it was CJS.
	const nextResult = await next(url, { ...ctx, format: "module" })
		.then((result) => {
			if (containsCJS("" + result.source)) {
				throw new Error("CommonJS");
			}

			return result;
		})
		.catch(async (err) => {
			if (
				(err?.message.includes("require") && err.includes("import")) ||
				err?.message.includes("CommonJS")
			) {
				return { format: "commonjs" };
			}

			throw err;
		});

	return nextResult;
}

const exts = new Set([".js"]);
