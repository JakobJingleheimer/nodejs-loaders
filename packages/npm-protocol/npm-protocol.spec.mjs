import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { resolve } from './npm-protocol.mjs';

describe('npm-protocol', () => {
	describe('resolve', () => {
		it('should remove "npm:" prefix from specifier', async () => {
			const specifier = 'npm:lodash';
			const ctx = {};
			const nextResolve = (cleanSpecifier, ctx) => {
				assert.strictEqual(cleanSpecifier, 'lodash');
				return Promise.resolve({ url: `node_modules/${cleanSpecifier}` });
			};

			const result = await resolve(specifier, ctx, nextResolve);
			assert.deepEqual(result, { url: 'node_modules/lodash' });
		});

		it('should pass through specifier without "npm:" prefix', async () => {
			const specifier = 'lodash';
			const ctx = {};
			const nextResolve = (cleanSpecifier, ctx) => {
				assert.strictEqual(cleanSpecifier, 'lodash');
				return Promise.resolve({ url: `node_modules/${cleanSpecifier}` });
			};

			const result = await resolve(specifier, ctx, nextResolve);
			assert.deepEqual(result, { url: 'node_modules/lodash' });
		});

		it('should handle empty specifier', async () => {
			const specifier = '';
			const ctx = {};
			const nextResolve = (cleanSpecifier, ctx) => {
				assert.strictEqual(cleanSpecifier, '');
				return Promise.resolve({ url: '' });
			};

			const result = await resolve(specifier, ctx, nextResolve);
			assert.deepEqual(result, { url: '' });
		});
	});
});
