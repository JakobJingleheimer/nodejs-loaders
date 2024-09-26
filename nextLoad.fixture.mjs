import fs from 'node:fs';

export const nextLoad = (url, { format = 'unknown' } = { format: 'unknown' }) => {
	return {
		format,
		source: fs.readFileSync(url, 'utf-8'),
	};
};
