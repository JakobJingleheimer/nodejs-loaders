/**
 * Utility to find the SvelteKit configuration file.
 */
import { findPackageJSON } from 'node:module';

/**
 * @param {URL['href']} parentURL
 */
export function findSvelteKitConfig(parentURL) {
  return findPackageJSON(parentURL)?.replace('package.json', 'svelte.config.js');
};
