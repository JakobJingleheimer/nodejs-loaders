import assert from 'node:assert';
import {
	before,
	describe,
	it,
	mock,
} from 'node:test';


describe('Mismatched format loader', () => {
	let load;
	let mock__containsCJS;

	before(async () => {
		const containsCJS = mock.fn();
		mock__containsCJS = containsCJS.mock;
		mock.module('./contains-cjs.mjs', {
			namedExports: { containsCJS },
		});

		({ load } = await import('./mismatched-format.mjs'));
	});

	describe('when "esm" is actually cjs', () => {
		it('should detect and report the corrected format', async () => {
			mock__containsCJS.mockImplementationOnce(() => true)
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
			mock__containsCJS.mockImplementationOnce(() => false)
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
