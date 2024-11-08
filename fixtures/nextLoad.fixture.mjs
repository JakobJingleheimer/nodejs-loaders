import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';


export const nextLoad = async (url, { format = 'unknown' } = { format: 'unknown' }) => {
	const fsPath = URL.canParse(url)
		? fileURLToPath(url)
		: url;

	return {
		format,
		source: await fs.readFile(fsPath, 'utf-8'),
	};
};
