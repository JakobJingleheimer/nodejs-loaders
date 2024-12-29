/**
 * We are assuming that the `yaml` package is installed in the `node_modules` directory.
 * Becasue it's an dep of the other loader, so we can use it for the E2E test.
 */
import assert from 'node:assert/strict';
import * as yaml from 'yaml';
import * as yamlWithNpmProtocol from 'npm:yaml';

assert.strictEqual(yaml, yamlWithNpmProtocol);
