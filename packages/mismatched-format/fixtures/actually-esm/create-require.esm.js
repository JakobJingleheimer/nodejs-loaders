import { createRequire } from 'node:module';


const require = createRequire(import.meta.url);

require('../../../fixtures/fixture.ext');
