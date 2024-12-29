import module from 'node:module';

import * as npmProtocol from '../npm-protocol.mjs';

module.registerHooks(npmProtocol);
