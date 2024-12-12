import assert from 'node:assert/strict';
import { before, describe, mock, test } from 'node:test';

import { nextResolve } from '../../fixtures/nextResolve.fixture.mjs';

describe('alias', () => {
	/** @type {MockFunctionContext<NoOpFunction>} */
	let mock_readFile;
	const base = 'file://';
	const aliases = {
		'…/*': ['./src/*'],
		ENV: ['https://example.com/env.json'],
		VARS: ['/vars.json'],
	};

	class ENOENT extends Error {
		code = 'ENOENT';
	}

	before(async () => {
		const readFile = mock.fn(function mock_readFile() {});
		mock_readFile = readFile.mock;
		mock.module('node:fs/promises', { namedExports: { readFile } });
		mock.module('node:url', {
			namedExports: {
				...(await import('node:url')),
				pathToFileURL() {
					return new URL(base);
				},
			},
		});
	});

	describe('that are in tsconfig.json', async () => {
		let resolve;

		before(async () => {
			mock_readFile.mockImplementation(async function mock_readFile(p) {
				if (p.includes('/tsconfig.json'))
					return JSON.stringify({
						compilerOptions: { paths: aliases },
					});
				throw new ENOENT(); // For any other file access, throw ENOENT
			});

			({ resolve } = await import('./alias.mjs'));
		});

		await test('should de-alias a prefixed specifier', async () => {
			assert.equal(
				(await resolve('…/test.mjs', {}, nextResolve)).url,
				`${base}/src/test.mjs`,
			);
		});

		await test('should de-alias a pointer (fully-qualified url) specifier', async () => {
			assert.equal((await resolve('ENV', {}, nextResolve)).url, aliases.ENV[0]);
		});

		await test('should de-alias a pointer (absolute path) specifier', async () => {
			assert.equal(
				(await resolve('VARS', {}, nextResolve)).url,
				aliases.VARS[0],
			);
		});

		await test('should maintain any suffixes on the prefixed specifier', async () => {
			assert.equal(
				(await resolve('…/test.mjs?foo', {}, nextResolve)).url,
				`${base}/src/test.mjs?foo`,
			);
			assert.equal(
				(await resolve('…/test.mjs#bar', {}, nextResolve)).url,
				`${base}/src/test.mjs#bar`,
			);
			assert.equal(
				(await resolve('…/test.mjs?foo#bar', {}, nextResolve)).url,
				`${base}/src/test.mjs?foo#bar`,
			);
		});

		await test('should maintain any suffixes on the pointer (fully-qualified url) specifier', async () => {
			assert.equal(
				(await resolve('ENV?foo', {}, nextResolve)).url,
				`${aliases.ENV[0]}?foo`,
			);
			assert.equal(
				(await resolve('ENV#bar', {}, nextResolve)).url,
				`${aliases.ENV[0]}#bar`,
			);
			assert.equal(
				(await resolve('ENV?foo#bar', {}, nextResolve)).url,
				`${aliases.ENV[0]}?foo#bar`,
			);
		});

		await test('should maintain any suffixes on the pointer (absolute path) specifier', async () => {
			assert.equal(
				(await resolve('VARS?foo', {}, nextResolve)).url,
				`${aliases.VARS[0]}?foo`,
			);
			assert.equal(
				(await resolve('VARS#bar', {}, nextResolve)).url,
				`${aliases.VARS[0]}#bar`,
			);
			assert.equal(
				(await resolve('VARS?foo#bar', {}, nextResolve)).url,
				`${aliases.VARS[0]}?foo#bar`,
			);
		});
	});
});
