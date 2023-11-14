import assert from 'node:assert';
import { describe, it } from 'node:test';

import { nextLoad } from './nextLoad.fixture.mjs';
import { nextResolve } from './nextResolve.fixture.mjs';

import { exts, load, resolve } from './media.mjs';


describe('media loader', { concurrency: true }, () => {
	describe('resolve', () => {
		it('should ignore unrecognised files', async () => {
			const result = await resolve('./fixture.ext', {}, nextResolve);

			assert.deepStrictEqual(result, {
				format: 'unknown',
				url: './fixture.ext',
			});
		});

		it('should recognise media files', async () => {
			for (const ext of exts) {
				const fileUrl = `./fixture.${ext}`;
				const result = await resolve(fileUrl, {}, nextResolve);

				assert.deepStrictEqual(result, {
					format: 'media',
					url: fileUrl,
				});
			}
		});
	});

	describe('load', () => {
		it('should ignore unrecognised files', async () => {
			const result = await load('./fixture.ext', {}, nextLoad);

			assert.deepStrictEqual(result, {
				format: 'unknown',
				source: '',
			});
		});

		it('should return the resolved URL for the media file', async () => {
			for (const ext of exts) {
				const fileUrl = `./fixture.${ext}`;
				const result = await load(fileUrl, { format: 'media' }, () => { throw new Error('media file should not be read from disk'); });

				assert.deepStrictEqual(result, {
					format: 'module',
					shortCircuit: true,
					source: `export default '${fileUrl}';`,
				});
			}
		});
	});
});
