import assert from 'node:assert/strict';
import { before, describe, it, mock } from 'node:test';

describe('finding an ESbuild config', () => {
    /** @type {MockFunctionContext<NoOpFunction>} */
    let mock_emitWarning;
    /** @type {MockFunctionContext<NoOpFunction>} */
    let mock_createRequire;
    /** @type {MockFunctionContext<NoOpFunction>} */
    let mock_findPackageJSON;
    /** @type import('./find-esbuild-config.mjs').findEsbuildConfig */
    let findEsbuildConfig;

    before(async () => {
        const emitWarning = mock.fn();
        mock_emitWarning = emitWarning.mock;
        const findPackageJSON = mock.fn();
        mock_findPackageJSON = findPackageJSON.mock;
        const createRequire = mock.fn();
        mock_createRequire = createRequire.mock;

        mock.module('node:process', { namedExports: { emitWarning } });
        mock.module('node:module', {
            namedExports: {
                createRequire,
                findPackageJSON,
            },
        });

        ({ findEsbuildConfig } = await import('./find-esbuild-config.mjs'));
    });

    it('should warn when no config is found', () => {
        mock_createRequire.mockImplementationOnce(
            () =>
                function mock_require() {
                    throw { code: 'ENOENT' };
                },
        );

        findEsbuildConfig(import.meta.url);

        assert.equal(mock_emitWarning.callCount(), 1);
        const msg = mock_emitWarning.calls[0].arguments[0];
        assert.match(msg, /found/);
        assert.match(msg, /root/);
        assert.match(msg, /default config/);
    });
});
