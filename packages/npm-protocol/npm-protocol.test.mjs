import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { execPath } from 'node:process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

describe('npm-protocol (e2e)', () => {
	const cwd = fileURLToPath(import.meta.resolve('./fixtures'));
	const encoding = 'utf-8';
	const e2eTest = fileURLToPath(import.meta.resolve('./fixtures/e2e.mjs'));

	it('should work with `--loader`', (t) => {
		const {
			status: code,
			stderr,
			stdout,
		} = spawnSync(
			execPath,
			[
				'--no-warnings',
				'--loader',
				fileURLToPath(import.meta.resolve('./npm-protocol.mjs')),
				e2eTest,
			],
			{
				cwd,
				encoding,
				env: { NO_COLOR: true },
			},
		);

		assert.equal(stderr, '');
		assert.equal(stdout, '');
		assert.equal(code, 0);
	});

	it('should work with `module.register`', (t) => {
		const {
			status: code,
			stdout,
			stderr,
		} = spawnSync(
			execPath,
			[
				'--no-warnings',
				'--import',
				fileURLToPath(import.meta.resolve('./fixtures/register.mjs')),
				e2eTest,
			],
			{
				cwd,
				encoding,
				env: { NO_COLOR: true },
			},
		);

		assert.equal(stderr, '');
		assert.equal(stdout, '');
		assert.equal(code, 0);
	});

	if (process.version.startsWith('v23')) {
		it('should work with `module.registerHooks`', () => {
			const {
				status: code,
				stderr,
				stdout,
			} = spawnSync(
				execPath,
				[
					'--no-warnings',
					'--import',
					fileURLToPath(import.meta.resolve('./fixtures/register-hooks.mjs')),
					e2eTest,
				],
				{
					cwd,
					encoding,
				},
			);

			assert.equal(stderr, '');
			assert.equal(stdout, '');
			assert.equal(code, 0);
		});
	}
});
