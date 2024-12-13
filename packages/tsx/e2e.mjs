import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('tsx E2E', () => {
	it('should load a TSX file but fail because of missing react package', () => {
		assert.rejects(async () => {
			await import('./fixture.jsx');
		}, {
			message: "Cannot find package 'react' imported from /Users/augustinmauroy/Desktop/nodejs-loaders/packages/tsx/fixture.jsx"
		});
	});
});
