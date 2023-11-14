import assert from 'node:assert';
import { describe, it } from 'node:test';

import { nextResolve } from './nextResolve.fixture.mjs';
import { nextLoad } from './nextLoad.fixture.mjs';

import { resolve, load } from './css-module.mjs';


describe('css-module loader', { concurrency: true }, () => {
	describe('resolve', () => {
		it('should recognise css module files', async () => {
			const result = await resolve('./fixture.module.css', {}, nextResolve);

			assert.deepStrictEqual(result, {
				format: 'cssmodule',
				url: './fixture.module.css',
			});
		});

		it('should ignore css files that aren’t css-modules', async () => {
			const result = await resolve('./fixture.css', {}, nextResolve);

			assert.deepStrictEqual(result, {
				format: 'unknown',
				url: './fixture.css',
			});
		});

		it('should ignore files that aren’t css at all', async () => {
			const result = await resolve('./fixture.ext', {}, nextResolve);

			assert.deepStrictEqual(result, {
				format: 'unknown',
				url: './fixture.ext',
			});
		});
	});

	describe('load', () => {
		it('should ignore files that aren’t css-modules', async () => {
			const result = await load('./fixture.js', { format: 'commonjs' }, nextLoad);

			assert.strictEqual(result.format, 'commonjs');
			assert.strictEqual(result.source, `export = 'foo';\n`);
		});

		it('should handle files with nested and non-nested comments', async () => {
			const result = await load('./fixture.module.css', { format: 'cssmodule' }, nextLoad);

			assert.strictEqual(result.format, 'json');
			assert.deepStrictEqual(result.source, JSON.stringify({
				Foo: 'Foo',
				Bar: 'Bar',
				Qux: 'Qux',
				Zed: 'Zed',
				img: 'img',
			}));
		});
	});
});
