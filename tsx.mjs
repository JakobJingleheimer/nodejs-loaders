import path from "node:path";
import { pathToFileURL } from "node:url";

import { transform } from "esbuild";

import { getFilenameExt } from "./parse-filename.mjs";

// This config must contain options that are compatible with esbuild's `transform` API.
const esbuildConfig = await import(
	pathToFileURL(path.resolve("esbuild.config.mjs")).href
)
	.then(({ default: config }) => config)
	.catch(() =>
		process.emitWarning(
			"No esbuild config found in project root. Using default config.",
		),
	);

export async function resolve(specifier, ctx, nextResolve) {
	const nextResult = await nextResolve(specifier);
	// Check against the fully resolved URL, not just the specifier, in case another loader has
	// something to contribute to the resolution.
	const ext = getFilenameExt(nextResult.url);

	if (jsxExts.has(ext))
		return {
			...nextResult,
			format: "jsx",
		};

	if (tsxExts.has(ext))
		return {
			...nextResult,
			format: "tsx",
		};

	return nextResult;
}

export async function load(url, ctx, nextLoad) {
	if (!formats.has(ctx.format)) return nextLoad(url); // not j|tsx

	const format = "module";
	const nextResult = await nextLoad(url, { format });
	let rawSource = "" + nextResult.source; // byte array → string

	if (config.jsx === "transform")
		rawSource = `import * as React from 'react';\n${rawSource}`;

	const { code: source, warnings } = await transform(rawSource, config).catch(
		({ errors }) => {
			for (const {
				location: { column, line, lineText },
				text,
			} of errors) {
				console.error(
					`TranspileError: ${text}\n    at ${url}:${line}:${column}\n    at: ${lineText}\n`,
				);
			}

			return {};
		},
	);

	if (warnings?.length) console.warn(...warnings);

	return {
		format,
		source,
	};
}

const config = {
	jsx: "automatic",
	jsxDev: true,
	jsxFactory: "React.createElement",
	loader: "tsx",
	minify: true,
	...esbuildConfig,
};

export const jsxExts = new Set([".jsx"]);

export const tsxExts = new Set([".mts", ".ts", ".tsx"]);

const formats = new Set(["jsx", "tsx"]);
