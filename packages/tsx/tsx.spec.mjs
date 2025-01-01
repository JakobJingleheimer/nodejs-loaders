import assert from 'node:assert/strict';
import { before, describe, it, mock } from 'node:test';

import { assertSuffixedSpecifiers } from '../../fixtures/assert-suffixed-specifiers.fixture.mjs';
import { nextLoad } from '../../fixtures/nextLoad.fixture.mjs';
import { nextResolve } from '../../fixtures/nextResolve.fixture.mjs';

describe('JSX & TypeScript loader', { concurrency: true }, () => {
	let jsxExts;
	let tsxExts;
	let load;
	let resolve;

	before(async () => {
		// This is necessary because now `load` depends on `resolve` having run.
		const esbuildConfig = {
			...(await import('./find-esbuild-config.mjs')).defaults,
			...(await import('./fixtures/esbuild.config.mjs')).default,
		};
		mock.module('./find-esbuild-config.mjs', {
			namedExports: { findEsbuildConfig: () => esbuildConfig },
		});

		({ jsxExts, tsxExts, load, resolve } = await import('./tsx.mjs'));
	});

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
				const fileUrl = import.meta.resolve(`./fixture${ext}`);
				const result = await resolve(fileUrl, {}, nextResolve);

				assert.deepEqual(result, {
					format: 'jsx',
					url: fileUrl,
				});
			}
		});

		it('should recognise TypeScript files', async () => {
			for (const ext of tsxExts) {
				const fileUrl = import.meta.resolve(`./fixture${ext}`);
				const result = await resolve(fileUrl, {}, nextResolve);

				assert.deepEqual(result, {
					format: 'tsx',
					url: fileUrl,
				});
			}
		});

		it('should handle specifiers with appending data', async () => {
			for (const ext of jsxExts)
				await assertSuffixedSpecifiers(resolve, `./fixture${ext}`, 'jsx');
			for (const ext of tsxExts)
				await assertSuffixedSpecifiers(resolve, `./fixture${ext}`, 'tsx');
		});
	});

	describe('load', () => {
		it('should ignore files that aren’t J|TSX', async () => {
			const result = await load(
				import.meta.resolve('../../fixtures/fixture.ext'),
				{},
				nextLoad,
			);

			assert.deepEqual(result, {
				format: 'unknown',
				source: '',
			});
		});

		// This verifies that esbuild.config.mjs is being loaded correctly because the one in this repo
		// disables minification, but the loader's default config enables it.
		const transpiled = [
			'import { jsxDEV } from "react/jsx-dev-runtime";',
			'import { Wrapper } from "./wrapper.jsx";',
			'export function Greet({ name }) {',
			'  return /* @__PURE__ */ jsxDEV("h1", { children: [',
			'    "Hello ",',
			'    /* @__PURE__ */ jsxDEV(Wrapper, { children: name }, void 0, false, {',
			'      fileName: "<stdin>",',
			'      lineNumber: 4,',
			'      columnNumber: 20',
			'    }, this)',
			'  ] }, void 0, true, {',
			'    fileName: "<stdin>",',
			'    lineNumber: 4,',
			'    columnNumber: 10',
			'  }, this);',
			'}',
			'Greet.displayName = "Greet";',
			'', //EoF
		].join('\n');

		it('should transpile JSX', async () => {
			const fileUrl = import.meta.resolve('./fixtures/main.jsx');
			const result = await load(fileUrl, { format: 'jsx' }, nextLoad);

			assert.equal(result.format, 'module');
			assert.equal(result.source, transpiled);
		});

		it('should transpile TSX', async () => {
			const fileUrl = import.meta.resolve('./fixtures/main.tsx');
			const result = await load(fileUrl, { format: 'tsx' }, nextLoad);

			assert.equal(result.format, 'module');
			assert.equal(result.source, transpiled);
		});

		it('should log transpile errors', async () => {
			const badJSX = 'const Foo (a) => (<div />)'; // missing `=`
			const orig_consoleError = console.error;

			// biome-ignore lint/suspicious/noAssignInExpressions: There is no expression.
			const consoleErr = (globalThis.console.error = mock.fn());

			await load(
				'whatever.tsx',
				{
					format: 'tsx',
					parentURL: import.meta.url,
				},
				async () => ({ source: badJSX }),
			);

			const errLog = consoleErr.mock.calls[0].arguments[0];

			assert.match(errLog, /TranspileError/);
			assert.match(errLog, /found "\("/);

			globalThis.console.error = orig_consoleError;
		});
	});
});
