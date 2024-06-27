import path from "node:path";

/**
 * Some loaders may append query parameters or anchors (URLs allow that). That will dupe
 * path.extname, String::endsWith, etc.
 * @param {string} f
 * @returns {string}
 */
export function getFilenameExt(f) {
	return path.extname(stripExtras(f));
}

export function stripExtras(f) {
	return f.split("?")[0].split("#")[0];
}

export function getFilenameParts(resolvedUrl) {
	const url = new URL(resolvedUrl);

	const ext = getFilenameExt(url.pathname);
	const base = path.basename(url.pathname, ext);

	return {
		base,
		ext,
	};
}
