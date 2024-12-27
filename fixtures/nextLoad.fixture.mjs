import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export const nextLoad = async (
	url,
	{ format = 'unknown' } = { format: 'unknown' },
) => {
	const fsPath = URL.canParse(url) ? fileURLToPath(url) : url;

	return {
		format,
		source: await fs.promises.readFile(fsPath, 'utf-8'),
	};
};

export const nextLoadSync = (
	url,
	{ format = 'unknown' } = { format: 'unknown' },
) => {
	const fsPath = URL.canParse(url) ? fileURLToPath(url) : url;

	return {
		format,
		source: fs.readFileSync(fsPath, 'utf-8'),
	};
};
