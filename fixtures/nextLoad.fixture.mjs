import fs from 'node:fs/promises';

export const nextLoad = async (url, { format = 'unknown' } = { format: 'unknown' }) => {
	return {
		format,
		source: await fs.readFile(url, 'utf-8'),
	};
};
