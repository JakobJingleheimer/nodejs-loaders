import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assertSuffixedSpecifiers } from './assert-suffixed-specifiers.fixture.mjs';
import { nextLoad } from './nextLoad.fixture.mjs';
import { nextResolve } from './nextResolve.fixture.mjs';

import { jsxExts, tsxExts, load, resolve } from './tsx.mjs';


describe('JSX & TypeScript loader', { concurrency: true }, () => {
	describe('resolve', () => {
		it('should ignore files that aren’t text', async () => {
			const result = await resolve('./fixture.ext', {}, nextResolve);

			assert.deepEqual(result, {
				format: 'unknown',
				url: './fixture.ext',
			});
		});

		it('should recognise JSX files', async () => {
			for (const ext of jsxExts) {
				const fileUrl = `./fixture${ext}`;
				const result = await resolve(fileUrl, {}, nextResolve);

				assert.deepEqual(result, {
					format: 'jsx',
					url: fileUrl,
				});
			}
		});

		it('should recognise TypeScript files', async () => {
			for (const ext of tsxExts) {
				const fileUrl = `./fixture${ext}`;
				const result = await resolve(fileUrl, {}, nextResolve);

				assert.deepEqual(result, {
					format: 'tsx',
					url: fileUrl,
				});
			}
		});

		it('should handle specifiers with appending data', async () => {
			for (const ext of jsxExts) await assertSuffixedSpecifiers(resolve, `./fixture${ext}`, 'jsx');
			for (const ext of tsxExts) await assertSuffixedSpecifiers(resolve, `./fixture${ext}`, 'tsx');
		});
	});

	describe('load', () => {
		it('should ignore files that aren’t J|TSX', () => {
			const result = load('./fixture.ext', {}, nextLoad);

			assert.deepEqual(result, {
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

		it('should transpile JSX', () => {
			const fileUrl = './fixture.jsx';
			const result = load(fileUrl, { format: 'jsx' }, nextLoad);

			assert.equal(result.format, 'module');
			assert.equal(result.source, transpiled);
		});

		it('should transpile TSX', () => {
			const fileUrl = './fixture.tsx';
			const result = load(fileUrl, { format: 'tsx' }, nextLoad);

			assert.equal(result.format, 'module');
			assert.equal(result.source, transpiled);
		});
	});
});
