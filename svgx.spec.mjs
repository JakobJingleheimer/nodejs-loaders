import assert from 'node:assert';
import { pathToFileURL } from 'node:url';
import { describe, it } from 'node:test';

import { nextLoad } from './nextLoad.fixture.mjs';

import { load } from './svgx.mjs';


describe('SVGX loader', { concurrency: true }, () => {
	describe('load', () => {
		it('should ignore files that aren’t SVG', async () => {
			const result = await load(pathToFileURL('./fixture.ext'), {}, nextLoad);

			assert.deepStrictEqual(result, {
				format: 'unknown',
				source: '',
			});
		});

		it('should transpile the SVG to a JSX moduele', async () => {
			const fileUrl = pathToFileURL('./fixture.svg');
			const result = await load(fileUrl, { format: 'jsx' }, nextLoad);

			const { source } = await nextLoad(fileUrl, { format: 'jsx' });

			assert.strictEqual(result.format, 'module');
			assert.strictEqual(result.source, `export default function Fixture() { return (\n${source}); }`);
		});
	});
});
