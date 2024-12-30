import { Suite, chartReport } from 'bench-node';
import { execPath } from 'node:process';
import { spawnSync } from 'node:child_process';

const suite = new Suite({
	reporter: chartReport,
});

//const e2eTest = import.meta.resolve('./fixtures/e2e.mjs');
const e2eTest = './fixtures/e2e.mjs';

suite.add('--loader', { repeatSuite: 2 }, () => {
	spawnSync(execPath, ['--no-warnings', '--loader', './jsonc.mjs', e2eTest]);
});

suite.add('--import (register)', { repeatSuite: 2 }, () => {
	spawnSync(execPath, [
		'--no-warnings',
		'--import',
		'./fixtures/register.mjs',
		e2eTest,
	]);
});

suite.run();
