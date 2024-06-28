import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assertSuffixedSpecifiers } from './assert-suffixed-specifiers.fixture.mjs';
import { nextResolve } from './nextResolve.fixture.mjs';
import { nextLoad } from './nextLoad.fixture.mjs';

import { resolve, load } from './css-module.mjs';


describe('css-module loader', { concurrency: true }, () => {
	describe('resolve', () => {
		it('should recognise css module files', async () => {
			const result = await resolve('./fixture.module.css', {}, nextResolve);

			assert.deepEqual(result, {
				format: 'cssmodule',
				url: './fixture.module.css',
			});
		});

		it('should ignore css files that aren’t css-modules', async () => {
			const result = await resolve('./fixture.css', {}, nextResolve);

			assert.deepEqual(result, {
				format: 'unknown',
				url: './fixture.css',
			});
		});

		it('should ignore files that aren’t css at all', async () => {
			const result = await resolve('./fixture.ext', {}, nextResolve);

			assert.deepEqual(result, {
				format: 'unknown',
				url: './fixture.ext',
			});
		});

		it('should handle specifiers with appending data', async () => {
			await assertSuffixedSpecifiers(resolve, './fixture.module.css', 'cssmodule');
		});
	});

	describe('load', () => {
		it('should ignore files that aren’t css-modules', async () => {
			const result = await load('./fixture.js', { format: 'commonjs' }, nextLoad);

			assert.equal(result.format, 'commonjs');
			assert.equal(result.source, `export = 'foo';\n`);
		});

		it('should handle files with nested and non-nested comments', async () => {
			const result = await load('./fixture.module.css', { format: 'cssmodule' }, nextLoad);

			assert.equal(result.format, 'json');
			assert.deepEqual(result.source, JSON.stringify({
				Foo: 'Foo',
				Bar: 'Bar',
				Qux: 'Qux',
				Zed: 'Zed',
				img: 'img',
				nested: 'nested',
				something: 'something'
			}));
		});
	});
});
