import assert from 'node:assert/strict';
import { execPath } from 'node:process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { spawnPromisified } from '../../utils/spawn-promisified.mjs';

const TEST_CASE = ['json', 'jsonc'];

describe('jsonc (e2e)', () => {
	for (const type of TEST_CASE) {
		const cwd = fileURLToPath(import.meta.resolve('./fixtures'));
		const e2eTest = fileURLToPath(
			import.meta.resolve(`./fixtures/e2e-${type}.mjs`),
		);
		const jsoncMsgRgx = /"foo": "bar"/;

		it(`${type} should work with \`--loader\``, async () => {
			const { code, stderr, stdout } = await spawnPromisified(
				execPath,
				[
					'--no-warnings',
					'--loader',
					fileURLToPath(import.meta.resolve('./jsonc.mjs')),
					e2eTest,
				],
				{ cwd },
			);

			assert.equal(stderr, '');
			assert.match(stdout, jsoncMsgRgx);
			assert.equal(code, 0);
		});

		it(`${type} should work with \`module.register\``, async () => {
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
			assert.match(stdout, jsoncMsgRgx);
			assert.equal(code, 0);
		});

		// `module.registerHooks` is only available in Node.js v23.0.0 and later
		if (process.version.startsWith('v23')) {
			it(`${type} should work with \`module.registerHooks\``, async () => {
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
				assert.match(stdout, jsoncMsgRgx);
				assert.equal(code, 0);
			});
		}
	}
});
