/**
 * @fileoverview This script is used to run all the benchmarks in the project.
 * @link https://github.com/RafaelGSS/bench-node
 */
import { spawn } from 'node:child_process';
import { styleText } from 'node:util';
import { globSync } from 'node:fs';

// hacky way to use work around npm workspaces
const args = process.argv.slice(2);
const w =
	args
		.find((arg) => arg.startsWith('--w='))
		?.replace('--w=', '')
		.trim()
		.replace('package/', '') ?? '';

if (!w.endsWith('/') && w.length > 0) w.concat('/');

const files = globSync(`packages/${w}**/**.bench.{js,mjs}`);

if (files.length === 0) {
	console.log(`${styleText(['red'], '✕')} No benchmarks found`);
} else {
	console.log(`${styleText(['green'], '✓')} Found ${files.length} benchmarks`);

	for (const file of files) {
		const proc = spawn('node', ['--allow-natives-syntax', file], {
			stdio: 'inherit',
		});

		proc.on('exit', (code) => {
			if (code === 0) {
				console.log(`${styleText(['green'], '✓')} ${file}`);
			} else {
				console.log(`${styleText(['red'], '✕')} ${file}`);
			}
		});
	}
}
