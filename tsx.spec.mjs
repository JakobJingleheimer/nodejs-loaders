import assert from 'node:assert';
import { describe, it } from 'node:test';

import { nextLoad } from './nextLoad.fixture.mjs';
import { nextResolve } from './nextResolve.fixture.mjs';

import { jsxExts, tsxExts, load, resolve } from './tsx.mjs';


describe('JSX & TypeScript loader', { concurrency: true }, () => {
	describe('resolve', () => {
		it('should ignore files that aren’t text', async () => {
			const result = await resolve('./fixture.ext', {}, nextResolve);

			assert.deepStrictEqual(result, {
				format: 'unknown',
				url: './fixture.ext',
			});
		});

		it('should recognise JSX files', async () => {
			for (const ext of jsxExts) {
				const fileUrl = `./fixture${ext}`;
				const result = await resolve(fileUrl, {}, nextResolve);

				assert.deepStrictEqual(result, {
					format: 'jsx',
					url: fileUrl,
				});
			}
		});

		it('should recognise TypeScript files', async () => {
			for (const ext of tsxExts) {
				const fileUrl = `./fixture${ext}`;
				const result = await resolve(fileUrl, {}, nextResolve);

				assert.deepStrictEqual(result, {
					format: 'tsx',
					url: fileUrl,
				});
			}
		});
	});

	describe('load', () => {
		it('should ignore files that aren’t J|TSX', async () => {
			const result = await load('./fixture.ext', {}, nextLoad);

			assert.deepStrictEqual(result, {
				format: 'unknown',
				source: '',
			});
		});

		// This verifies that esbuild.config.mjs is being loaded correctly because the one in this repo
		// disables minification, but the loader's default config enables it.
		const transpiled = [
			'import { jsxDEV } from "react/jsx-dev-runtime";',
			'export function Greet({ name }) {',
			'  return /* @__PURE__ */ jsxDEV("h1", { children: [',
			'    "Hello ",',
			'    name',
			'  ] }, void 0, true, {',
			'    fileName: "<stdin>",',
			'    lineNumber: 2,',
			'    columnNumber: 10',
			'  }, this);',
			'}',
			'Greet.displayName = "Greet";',
			'', //EoF
		].join('\n');

		it('should transpile JSX', async () => {
			const fileUrl = './fixture.jsx';
			const result = await load(fileUrl, { format: 'jsx' }, nextLoad);

			assert.strictEqual(result.format, 'module');
			assert.strictEqual(result.source, transpiled);
		});

		it('should transpile TSX', async () => {
			const fileUrl = './fixture.tsx';
			const result = await load(fileUrl, { format: 'tsx' }, nextLoad);

			assert.strictEqual(result.format, 'module');
			assert.strictEqual(result.source, transpiled);
		});
	});
});
