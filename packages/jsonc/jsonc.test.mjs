import assert from 'node:assert/strict';
import { execPath } from 'node:process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { spawnPromisified } from '../../utils/spawn-promisified.mjs';

// biome-ignore lint: i know what i'm doing 😎
const stripAnsi = (str) => str.replace(/(\u001b\[[0-9;]*m)/g, '');

const expected = "{ foo: 'bar', baz: 'qux', quux: [ 'corge', 'grault' ] }\n";

describe('jsonc (e2e)', () => {
	describe('json', () => {
		const cwd = fileURLToPath(import.meta.resolve('./fixtures'));
		const e2eTest = fileURLToPath(
			import.meta.resolve('./fixtures/e2e-json.mjs'),
		);

		it('should work with `--loader`', async () => {
			const { code, stderr, stdout } = await spawnPromisified(
				execPath,
				[
					'--no-warnings',
					'--loader',
					fileURLToPath(import.meta.resolve('./jsonc.mjs')),
					e2eTest,
				],
				{ cwd, env: { ...process.env, NO_COLOR: '1' } },
			);

			assert.equal(stderr, '');
			assert.equal(stripAnsi(stdout), expected);
			assert.equal(code, 0);
		});

		it('should work with `module.register`', async () => {
			const { code, stderr, stdout } = await spawnPromisified(
				execPath,
				[
					'--no-warnings',
					'--import',
					fileURLToPath(import.meta.resolve('./fixtures/register.mjs')),
					e2eTest,
				],
				{ cwd, env: { ...process.env, NO_COLOR: '1' } },
			);

			assert.equal(stderr, '');
			assert.equal(stripAnsi(stdout), expected);
			assert.equal(code, 0);
		});
	});

	describe('jsonc', () => {
		const cwd = fileURLToPath(import.meta.resolve('./fixtures'));
		const e2eTest = fileURLToPath(
			import.meta.resolve('./fixtures/e2e-jsonc.mjs'),
		);

		it('should work with `--loader`', async () => {
			const { code, stderr, stdout } = await spawnPromisified(
				execPath,
				[
					'--no-warnings',
					'--loader',
					fileURLToPath(import.meta.resolve('./jsonc.mjs')),
					e2eTest,
				],
				{ cwd, env: { ...process.env, NO_COLOR: '1' } },
			);

			assert.equal(stderr, '');
			assert.equal(stripAnsi(stdout), expected);
			assert.equal(code, 0);
		});

		it('should work with `module.register`', async () => {
			const { code, stderr, stdout } = await spawnPromisified(
				execPath,
				[
					'--no-warnings',
					'--import',
					fileURLToPath(import.meta.resolve('./fixtures/register.mjs')),
					e2eTest,
				],
				{ cwd, env: { ...process.env, NO_COLOR: '1' } },
			);

			assert.equal(stderr, '');
			assert.equal(stripAnsi(stdout), expected);
			assert.equal(code, 0);
		});
	});
});
