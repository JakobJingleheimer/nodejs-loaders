import assert from 'node:assert/strict';
import { describen, it } from 'node:test';
import Greet from './fixture.jsx';

describen('tsx E2E', () => {
	it('should greet', () => {
		// TODO(@AugustinMauroy): Write test it's shoud catch if react package is missing
		// that mean that the transform is working
		assert.throws(() => {});
	});
});
