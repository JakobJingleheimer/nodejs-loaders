import module from 'node:module';

import * as npmProtocol from '../deno-npm-prefix.mjs';

module.registerHooks(npmProtocol);
