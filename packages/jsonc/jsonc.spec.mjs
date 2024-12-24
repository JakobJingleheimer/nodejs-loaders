import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { assertSuffixedSpecifiers } from '../../fixtures/assert-suffixed-specifiers.fixture.mjs';
import { nextResolve } from '../../fixtures/nextResolve.fixture.mjs';
import { nextLoad } from '../../fixtures/nextLoad.fixture.mjs';
import { resolve, load } from './jsonc.mjs';

describe('JSONC loader', { concurrency: true }, () => {
	describe('resolve', () => {
		it('should recognise jsonc files', async () => {
			const result = await resolve(
				'./fixture.jsonc',
				{ importAttributes: { type: 'jsonc' } },
				nextResolve,
			);

			assert.deepEqual(result, {
				format: 'jsonc',
				url: './fixture.jsonc',
			});
		});

		it('should ignore json files that aren’t jsonc', async () => {
			const result = await resolve('./fixture.json', {}, nextResolve);

			assert.deepEqual(result, {
				format: 'unknown',
				url: './fixture.json',
			});
		});

		it('should ignore files that aren’t json at all', async () => {
			const result = await resolve(
				'../../fixtures/fixture.ext',
				{},
				nextResolve,
			);

			assert.deepEqual(result, {
				format: 'unknown',
				url: '../../fixtures/fixture.ext',
			});
		});

		it('should handle specifiers with appending data', async () => {
			await assertSuffixedSpecifiers(resolve, './fixture.jsonc', 'jsonc', {
				importAttributes: { type: 'jsonc' },
			});
		});

		it('should ignore json files that aren’t jsonc', async () => {
			const result = await resolve(
				'./fixture.txt',
				{ importAttributes: { type: 'jsonc' } },
				nextResolve,
			);

			assert.deepEqual(result, {
				format: 'unknown',
				url: './fixture.txt',
			});
		});

		it('should ignore json if the import attribute is set', async () => {
			const result = await resolve(
				'./fixture.json',
				{
					importAttributes: { type: 'jsonc' },
				},
				nextResolve,
			);

			assert.deepEqual(result, {
				format: 'unknown',
				url: './fixture.json',
			});
		});
	});

	describe('load', () => {
		it('should handle files with comments', async () => {
			const result = await load(
				import.meta.resolve('./fixture.jsonc'),
				{ format: 'jsonc' },
				nextLoad,
			);

			const expected = [
				'{\n',
				'\t                  \n',
				'\t"foo": "bar",\n',
				'\t  \n',
				'\t                     \n',
				'\t  \n',
				'\t                     \n',
				'\t"baz": "qux",\n',
				'\t"quux": [\n',
				'\t\t"corge",\n',
				'\t\t"grault"\n',
				'\t]\n',
				'}\n',
			].join('');

			assert.equal(result.format, 'json');
			assert.equal(result.source, expected);
		});
	});
});
