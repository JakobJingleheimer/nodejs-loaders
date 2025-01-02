# Contributing

Thank you for contributing!

## Authoring

Code should be well documented and tested. Each loader must:

* Document for users via its own README
* Document for developers via code comments
* [Type-check via jsdoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
* Cover at least 90% of code between unit and end-to-end tests
  * unit tests for branching and especially failure cases
  * end-to-end for [happy-paths](https://en.wikipedia.org/wiki/Happy_path)
  * You can run tests locally via `npm run test --workspace=packages/LOADER_NAME`
* Adhere to code styles
  * Code can be validated with `node --run pre-commit` from the project root (CI will verify adherence but will not auto-fix).

We take pride in this project. That said, we're pretty reasonable and friendly people; if there is a very good reason for something, make an objective case. But please also realise that our time is limited and this is not our job.

### Compatibility

Not all things are possible (or feasible) in all versions of everything. Ideally, loaders support all LTS and current lines of Node.js. The versions of node with which a loader is compatible must be documented in its [`package.json` "engines" field](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#engines).

If a loader depends on a particular new feature of node, that's fine. If you are not reasonably sure in which specific semver a feature will be released, do not guess; if it has been merged into the line's branch ~1+ weeks before the release, you can be reasonably sure it will be in the next release. Mark the known version(s) within `"engines"`, and then subsequently release patches updating `"engines"` to add new semvers as they become known.

### Dependencies

Dependencies should be kept minimal (and narrow), and ideally from trusted authors. For instance, if leveraging a single utility from lodash, use the specific package, like `lodash.get` for `_.get`.

For maintainability, prefer dependencies already used in other loaders. For instance, we use `esbuild` in several loaders.

### Security

Loaders making network calls will almost surely be rejected.

## Pull Requests

Changes should be atomic; do not combine multiple, discrete changes within a single PR.

We use [squash merge](https://docs.github.com/en/enterprise-cloud@latest/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges#merge-message-for-a-squash-merge) to create a single fresh commit based on PR title. The PR title should follow [Conventional Commit guidelines](https://www.conventionalcommits.org/en/v1.0.0/). Acceptable "types" are:

* **doc**: purely documentation updates (semver patch)
  * "scope" is usually the loader's name
* **dep**: a dependency update (semver patch or major)
  * "scope" is the dependency's name
* **fix**: correct a bug (semver patch)
  * "scope" is usually the loader's name
* **feat**: add a new feature to an existing loader or introduce a new loader (semver minor or major)
  * "scope" is usually the loader's name
* **setup**: adjust the repository setup, like CI workflows (no semver).
  * "scope" is usually workflow or configuration item's name
* **test**: add, delete, or update a test.
  * "scope" is usually the loader's name
