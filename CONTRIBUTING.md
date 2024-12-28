# Nodejs Loaders Contributing Guide

Thank you for considering contributing to Nodejs Loaders! We welcome all contributions, whether they are bug reports, feature requests, pull requests, or just questions.

## Getting started

The steps below will give you a general idea of how to prepare your local environment for nodejs loaders development.

1. Click the fork button in the top right to clone the [Node.js Website Repository](https://github.com/nodejs-loaders/nodejs-loaders/fork)

2. Clone your fork using SSH, GitHub CLI, or HTTPS.
```bash
git clone git@github.com:<YOUR_GITHUB_USERNAME>/nodejs-loaders.git # SSH
git clone https://github.com/<YOUR_GITHUB_USERNAME>/nodejs-loaders.git # HTTPS
gh repo clone <YOUR_GITHUB_USERNAME>/nodejs-loaders.org # GitHub CLI
```

3. Change into the directory.
```bash
cd nodejs-loaders
```

4. Create a remote to keep your fork and local clone up-to-date.
```bash
git remote add upstream git@github.com:nodejs-loaders/nodejs-loaders.git # SSH
git remote add upstream https://github.com/nodejs-loaders/nodejs-loaders.git # HTTPS
gh repo sync nodejs-loaders/nodejs-loaders # GitHub CLI
```

5. Create a new branch for your work.
```bash
git checkout -b my-new-feature
```

6. Install the dependencies.
```bash
npm install
```

7. Run the tests
```bash
node --run test
```

8. Run lint and formatting
```bash
node --run pre-commit
```

9. Let's make some changes!

10. Keep your fork up-to-date with the upstream repository.
```bash
git fetch upstream
git merge upstream/main
```

11. Once you're ready, push your changes to your fork.
```bash
git add .
git commit -m "describe your changes"
git push -u origin name-of-your-branch
```

## Commit Message Guidelines

- Commit messages must include a "type" as described on [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- Commit messages **must** start with a capital letter
- Commit messages **must not** end with a period `.`

## Pull Request Guidelines

Before merging a pull request, make sure the following requirements are met:

- The pull request has a descriptive title and follows the commit message guidelines
- An approval is valid if there have been no major changes since it was granted.
- 24 hours after approval and no objections, the pull request can be merged
- All tests pass

## Introduce a New Loader

If you want to introduce a new loader, please follow the steps below:

- Open an issue to discuss the new loader
  - Describe the use case for the new loader
	- What problem does it solve?
	- What are the benefits of the new loader?
	- Which dependencies will be required?
- Once the issue is approved, make changes to the codebase
- Open a pull request
- Once the pull request is approved, the new loader will be merged
- Let's realease it.

### Create a New Loader

1. Create a new directory in the `packages` directory with the name of the loader
2. Create the package.json file
```json
{
	"version": "1.0.0",
	"name": "@nodejs-loaders/your-loader",
	"type": "module",
	"author": "Your Name",
	"maintainers": [
		"Jacob Smith",
		"Augustin Mauroy"
	],
  "license": "ISC",
	"main": "./your-loader.mjs",
  "repository": {
    "url": "https://github.com/JakobJingleheimer/nodejs-loaders"
  }
}
```

> [!NOTE]
> The `repository.url` field must be present. It's use for generating the provenance signature.

3. Create the loader

Your loader have to export [customisaiton hooks](https://nodejs.org/api/module.html#customization-hooks) to be able to customize the loader behavior.

```js
/**
 * @type {import('node:module').LoadHook}
 */
function resolveMyLoader(specifier, ctx, next) {
	/* Do some awesome stuff */
}
export { resolveMyLoader as resolve };

/**
 * @type {import('node:module').LoadHook}
 */
function loadMyLoader(url, ctx, defaultLoad) {
	/* Do some awesome stuff */
}
export { loadMyLoader as load };
```

4. Write unit tests

Yours customisation hooks must be tested. There are two part of testing, unit tests and integration tests.

First write unit tests for your hooks. We use [`node:test`](https://nodejs.org/api/test.html) to run the tests. All unit test should have this naming convention `your-loader.spec.mjs`. And the test file should be in the same directory as the loader. Also the test file should have the following structure:

```js
import assert from 'node:assert/strict';
import { describe it } from 'node:test';

import { resolve, load } from './your-loader.mjs';

describe('Your Loader', () => {
	describe('resolve', () => {
		it('should resolve the specifier', () => {
			/* Test your resolve hook */
		});
	});

	describe('load', () => {
		it('should load the module', () => {
			/* Test your load hook */
		});
	});
});
```

Second write integration tests for your loader. We use [`node:module`](https://nodejs.org/api/module.html) to load the loader.

```js
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { execPath } from 'node:process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

describe('Your Loader', () => {
	it('should work with --loader', () => {
		const { status, stdout, stderr } = spawnSync(execPath, [
			'--loader',
			'./your-loader.mjs',
			'./path/to/module.js'
		]);

		assert.strictEqual(status, 0);
		assert.match(stdout, /Hello, World!/);
	});

	it('should work with `module.register', () => {
		const { status, stdout, stderr } = spawnSync(execPath, [
			'--import',
			fileURLToPath(import.meta.resolve('./fixtures/register.mjs')),
			'-e',
			'module.register("./path/to/module.js")'
		]);

		assert.strictEqual(status, 0);
		assert.match(stdout, /Hello, World!/);
	});
});
```

> You may need to add one case if the loader support [`module.registerHooks`](https://nodejs.org/api/module.html#moduleregisterhooksoptions) API.

## [Developer's Certificate of Origin 1.1](https://developercertificate.org)

```
By contributing to this project, I certify that:

- (a) The contribution was created in whole or in part by me and I have the right to
  submit it under the open source license indicated in the file; or
- (b) The contribution is based upon previous work that, to the best of my knowledge,
  is covered under an appropriate open source license and I have the right under that
  license to submit that work with modifications, whether created in whole or in part
  by me, under the same open source license (unless I am permitted to submit under a
  different license), as indicated in the file; or
- (c) The contribution was provided directly to me by some other person who certified
  (a), (b) or (c) and I have not modified it.
- (d) I understand and agree that this project and the contribution are public and that
  a record of the contribution (including all personal information I submit with it,
  including my sign-off) is maintained indefinitely and may be redistributed consistent
  with this project or the open source license(s) involved.
```
