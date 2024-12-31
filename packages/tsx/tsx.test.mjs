import assert from 'node:assert/strict';
import path from 'node:path';
import { execPath } from 'node:process';
import { describe, it } from 'node:test';

import { spawnPromisified } from '../../test/spawn-promisified.mjs';

describe('JSX & TypeScript loader e2e', () => {
	/**
	 * If react isn't found, the transpilation has happened. If there is another error, the
	 * transpilation failed (kind of hypothetical)
	 */
	it('should load a TSX file but fail because of missing react package', async () => {
		const cwd = path.join(import.meta.dirname, 'fixtures');
		const { stderr, stdout } = await spawnPromisified(
			execPath,
			[
				'--no-warnings',
				`--import=${path.join(cwd, 'register.mjs')}`,
				path.join(cwd, 'main.jsx'),
			],
			{
				cwd,
			}
		);

		// console.log(stderr)
		// console.log(stdout)

		assert.match(stderr, /Cannot find package 'react' imported from/);
		assert.equal(stdout, '');
	});
});
