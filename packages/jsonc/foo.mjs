import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('./jsonc.mjs', pathToFileURL('./'));
