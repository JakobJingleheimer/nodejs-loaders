import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('tsx E2E', () => {
	/**
	 * If react isn't found it's mean the transpilation had happened
	 * if there are another error it's mean the transpilation failed
	 * (kind of hypothetical)
	 */
	it('should load a TSX file but fail because of missing react package', () => {
		assert.rejects(
			async () => await import('./fixture.jsx'),
			/Cannot find package 'react' imported from/
		);
	});
});
