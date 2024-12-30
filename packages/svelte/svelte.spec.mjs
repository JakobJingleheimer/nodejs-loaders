import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { nextLoad } from '../../fixtures/nextLoad.fixture.mjs';
import { nextResolve } from '../../fixtures/nextResolve.fixture.mjs';

import { load, resolve } from './svelte.mjs';

describe('svelte loader', { concurrency: true }, () => {
	describe('resolve', () => {
		it('should ignore non-svelte files', async () => {
			const result = await resolve(
				'../../fixtures/fixture.txt',
				{},
				nextResolve,
			);

			assert.deepEqual(result, {
				format: 'unknown',
				url: '../../fixtures/fixture.txt',
			});
		});

		it('should recognize svelte files', async () => {
			const result = await resolve('./fixture.svelte', {}, nextResolve);

			assert.deepEqual(result, {
				format: 'svelte',
				url: './fixture.svelte',
			});
		});
	});

	describe('load', () => {
		it('should ignore non-svelte files', async () => {
			const result = await load(
				import.meta.resolve('../../fixtures/fixture.ext'),
				{},
				nextLoad,
			);

			assert.deepEqual(result, {
				format: 'unknown',
				source: '',
			});
		});

		it('should compile svelte files correctly', async (t) => {
			const fileUrl = import.meta.resolve('./fixture.svelte');
			const result = await load(fileUrl, { format: 'svelte' }, () => {
				return {
					source: '<script>export let name;</script><h1>Hello {name}!</h1>',
				};
			});

			t.assert.snapshot(result.source);
		});
	});
});
