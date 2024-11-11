import assert from 'node:assert/strict';
import {
	before,
	describe,
	it,
	mock,
} from 'node:test';


describe('Mismatched format loader', () => {
	describe('unit', () => {
		/** @type {import('./mismatched-format.mjs').load} */
		let load;
		/** @type {MockFunctionContext<NoOpFunction>} */
		let mock__containsCJS;

		before(async () => {
			const containsCJS = mock.fn();
			mock__containsCJS = containsCJS.mock;
			mock.module('./contains-cjs.mjs', { namedExports: { containsCJS } });

			({ load } = await import('./mismatched-format.mjs?units')); // query param is needed to bypass V8 cache
		});

		describe('when "esm" is actually cjs', () => {
			it('should detect and report the corrected format', async () => {
				mock__containsCJS.mockImplementationOnce(function mock__containsCJS() { return true });
				const result = await load(
					import.meta.resolve('./unimportant.js'),
					{},
					async () => ({
						format: 'module',
						source: '"unimportant"',
					}),
				);

				assert.equal(result.format, 'commonjs');
			});

			it('should detect and report the corrected format', async () => {
				mock__containsCJS.mockImplementationOnce(function mock__containsCJS() { return false });
				const result = await load(
					import.meta.resolve('./unimportant.js'),
					{},
					async () => { throw new Error('require and import') },
				);

				assert.equal(result.format, 'commonjs');
			});

			it('should detect and report the corrected format', async () => {
				mock__containsCJS.mockImplementationOnce(() => false)
				const result = await load(
					import.meta.resolve('./unimportant.js'),
					{},
					async () => { throw new Error('CommonJS') },
				);

				assert.equal(result.format, 'commonjs');
			});
		});
	});

	describe('e2e', () => {
		let load;
		let nextLoad;

		before(async () => {
			({ load } = await import('./mismatched-format.mjs?e2e')); // query param is needed to bypass V8 cache
			({ nextLoad } = await import('../../fixtures/nextLoad.fixture.mjs'));
		});

		describe('correctly identify the containing CJS as CJS, despite "type": "module"', () => {
			it('should handle `require()`', async () => {
				const result = await load(import.meta.resolve('./fixtures/actually-cjs/uses-require.cjs.js'), {}, nextLoad);

				assert.equal(result.format, 'commonjs');
			});

			it('should handle `module.exports`', async () => {
				const result = await load(import.meta.resolve('./fixtures/actually-cjs/module-exports.cjs.js'), {}, nextLoad);

				assert.equal(result.format, 'commonjs');
			});
		});

		describe('correctly identify the containing ESM as ESM, despite "type": "commonjs"', () => {
			it('should handle createRequire', async () => {
				const result = await load(import.meta.resolve('./fixtures/actually-esm/create-require.esm.js'), {}, nextLoad);

				assert.equal(result.format, 'module');
			});

			it('should handle `require()` within a comment', async () => {
				const result = await load(import.meta.resolve('./fixtures/actually-esm/require-in-comment.esm.js'), {}, nextLoad);

				assert.equal(result.format, 'module');
			});
		});
	});
});
