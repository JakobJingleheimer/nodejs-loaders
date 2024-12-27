if (process.version.startsWith('v23')) {
	const assert = await import('node:assert/strict');
	const { execPath } = await import('node:process');
	const { describe, it } = await import('node:test');
	const { fileURLToPath } = await import('node:url');

	const { spawnPromisified } = await import('../../utils/spawn-promisified.mjs');

	const { message } = await import('./fixtures/message.mjs');

	describe('alias (e2e', () => {
		const cwd = fileURLToPath(import.meta.resolve('./fixtures'));
		const e2eTest = fileURLToPath(import.meta.resolve('./fixtures/e2e.mjs'));
		const msgRgx = new RegExp(message);

		it('should work with `--loader`', async () => {
			const { code, stderr, stdout } = await spawnPromisified(
				execPath,
				[
					'--no-warnings',
					'--loader',
					fileURLToPath(import.meta.resolve('./alias.mjs')),
					e2eTest,
				],
				{ cwd },
			);

			assert.equal(stderr, '');
			assert.match(stdout, msgRgx);
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
				{ cwd },
			);

			assert.equal(stderr, '');
			assert.match(stdout, msgRgx);
			assert.equal(code, 0);
		});

		it('should work with `module.registerHooks`', async () => {
			const { code, stderr, stdout } = await spawnPromisified(
				execPath,
				[
					'--no-warnings',
					'--import',
					fileURLToPath(import.meta.resolve('./fixtures/register-hooks.mjs')),
					e2eTest,
				],
				{ cwd },
			);

			assert.equal(stderr, '');
			assert.match(stdout, msgRgx);
			assert.equal(code, 0);
		});
	});
}
