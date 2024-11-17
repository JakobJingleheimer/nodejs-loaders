/**
 * Utility to find the SvelteKit configuration file.
 */
import { findPackageJson } from 'node:module';

/**
 * @param {URL['href']} parentURL
 */
export function findSvelteKitConfig(parentURL) {
  return findPackageJson(parentURL)?.replace('package.json', 'svelte.config.js');
};
