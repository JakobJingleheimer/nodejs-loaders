# Nodejs Loaders: YAML

<img src="https://raw.githubusercontent.com/nodejs-loaders/nodejs-loaders/refs/heads/main/logo.svg" height="100" width="100" alt="@node.js loaders logo" />

[![npm version](https://img.shields.io/npm/v/@nodejs-loaders/yaml.svg)](https://www.npmjs.com/package/@nodejs-loaders/yaml)
![unpacked size](https://img.shields.io/npm/unpacked-size/@nodejs-loaders/yaml)

**Environment**: test, development

This loader enables importing [YAML](https://yaml.org) files, converting them to a plain javascript object. YAML id commonly used for configuration files, which are often more easily represented in YAML than JSON.

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
