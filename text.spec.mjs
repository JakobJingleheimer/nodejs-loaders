import assert from 'node:assert';
import { describe, it } from 'node:test';

import { nextLoad } from './nextLoad.fixture.mjs';
import { nextResolve } from './nextResolve.fixture.mjs';

import { exts, load, resolve } from './text.mjs';


describe('text loader', { concurrency: true }, () => {
	describe('resolve', () => {
		it('should ignore files that aren’t text', async () => {
			const result = await resolve('./fixture.ext', {}, nextResolve);

			assert.deepStrictEqual(result, {
				format: 'unknown',
				url: './fixture.ext',
			});
		});

		it('should recognise text files', async () => {
			for (const ext of Object.keys(exts)) {
				const fileUrl = `./fixture${ext}`;
				const result = await resolve(fileUrl, {}, nextResolve);

				assert.deepStrictEqual(result, {
					format: exts[ext],
					url: fileUrl,
				});
			}
		});
	});

	describe('load', () => {
		it('should ignore files that aren’t text', async () => {
			const result = await load('./fixture.ext', {}, nextLoad);

			assert.deepStrictEqual(result, {
				format: 'unknown',
				source: '',
			});
		});

		it('should generate a module from the text file', async () => {
			for (const ext of Object.keys(exts)) {
				const fileUrl = `./fixture${ext}`;
				const result = await load(fileUrl, { format: 'graphql' }, nextLoad);

				const { source } = await nextLoad(fileUrl, { format: 'graphql' });

				assert.strictEqual(result.format, 'module');
				assert.strictEqual(result.source, `export default \`${source}\`;`);
			}
		});
	});
});
