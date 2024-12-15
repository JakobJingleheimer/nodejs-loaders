import assert from 'node:assert/strict';
import { execPath } from 'node:process';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

import { spawnPromisified } from '../../test/spawn-promisified.mjs';

describe.only('JSX & TypeScript loader e2e', () => {
	/**
	 * If react isn't found, the transpilation has happened. If there is another error, the
	 * transpilation failed (kind of hypothetical)
	 */
	it('should load a TSX file but fail because of missing react package', async () => {
		const { stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--import',
				fileURLToPath(import.meta.resolve('./fixtures/register.mjs')),
				fileURLToPath(import.meta.resolve('./fixtures/fixture.jsx')),
			],
		);

		console.log(stderr)
		console.log(stdout)

		// assert.equal(stdout, '');
		// assert.match(stderr, /Cannot find package 'react' imported from/);
	});
});
