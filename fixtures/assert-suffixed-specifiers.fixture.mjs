import assert from 'node:assert/strict';

import { nextResolve } from './nextResolve.fixture.mjs';

export async function assertSuffixedSpecifiers(resolve, baseSpecifier, format) {
	for (const suffix of suffixes) {
		const specifier = `${baseSpecifier}${suffix}`;
		const result = await resolve(specifier, {}, nextResolve);
		assert.deepEqual(result, {
			format,
			url: specifier,
		});
	}
}

const suffixes = new Array('?foo', '#bar', '?foo#bar');
