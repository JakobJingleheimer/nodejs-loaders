import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('@nodejs-loaders/tsx', pathToFileURL('./'));
