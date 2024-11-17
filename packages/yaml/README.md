# Nodejs Loaders: YAML

<img src="https://raw.githubusercontent.com/JakobJingleheimer/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

[![npm version](https://img.shields.io/npm/v/nodejs-loaders/yaml.svg)](https://www.npmjs.com/package/nodejs-loaders/yaml)
![size](https://img.shields.io/github/languages/code-size/JakobJingleheimer/nodejs-loaders/yaml)

**Environment**: test, development, maybe production (but carfully)

This loader allow you to import YAML files as plain objects. It uses the `js-yaml` package to parse the YAML files. This is useful for configuration files, or any other data that is more easily represented in YAML than JSON.

```yaml
# config.yaml
foo: bar
baz:
  - qux
  - zed
```

```js
import config from './config.yaml';

config.foo; // 'bar'
config.baz; // ['qux', 'zed']
```

<details>
<summary>Supported file extensions</summary>

* `.yaml`
* `.yml`
</details>

**Alternatives**

* [`esm-loader-yaml`](https://www.npmjs.com/package/esm-loader-yaml)
