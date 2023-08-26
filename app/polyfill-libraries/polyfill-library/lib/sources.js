// @ts-check
/// <reference types="@fastly/js-compute" />
// import { SimpleCache } from 'fastly:cache';
import { ConfigStore } from 'fastly:config-store';
import { KVStore } from 'fastly:kv-store';
import { shouldLog } from "../../../logger";
// import { retry } from '../../../retry';

/**
 * Get the metadata for a specific polyfill within the collection of polyfill sources.
 * @param {String} featureName - The name of a polyfill whose metadata should be returned.
 * @returns {Promise<Object|undefined>} A promise which resolves with the metadata or with `undefined` if no metadata exists for the polyfill.
 */

let config;
export async function getPolyfillMeta(featureName) {
	if (!featureName) { return undefined; }
	if (!config) {
		config = new ConfigStore('polyfill_library');
	}
	let meta;
	try {
		meta = await config.get(featureName)
	} catch { /* empty */ }
	if (!meta) {
		if (shouldLog()) {
			console.log('getPolyfillMeta', 'missing:', featureName)
		}
		return undefined;
	}
	let b = JSON.parse(meta);
	return b;
}

let aliases;
/**
 * Get the polyfills that are under the same alias.
 * @param {string} alias - The name of an alias whose metadata should be returned.
 * @returns {Promise<Object|undefined>} A promise which resolves with the metadata or with `undefined` if no alias with that name exists.
 */
export async function getConfigAliases(alias) {
	if (!alias) { return undefined; }
	if (!aliases) {
		aliases = new ConfigStore('polyfill_library_aliases');
	}
	let a = aliases.get(alias);
	let b = a ? JSON.parse(a) : undefined;
	return b;
}

/**
 * Get the aliases for a specific polyfill.
 * @param {string} featureName - The name of a polyfill whose implementation should be returned.
 * @param {'min'|'raw'} type - Which implementation should be returned: minified or raw implementation.
 * @returns {string} A ReadStream instance of the polyfill implementation as a utf-8 string.
*/
let polyfills;
export async function streamPolyfillSource(featureName, type) {
	if (!polyfills) { polyfills = new KVStore('polyfill-library'); }
	let polyfill = await polyfills.get('/' + featureName + '/' + type + ".js");
	if (!polyfill) {
		polyfill = await polyfills.get('/' + featureName + '/' + type === 'raw' ? 'min' : 'raw' + ".js");
		if (!polyfill) {
				throw new Error('streamPolyfillSource missing: /' + featureName + '/' + type + ".js")
			}
	}
	return polyfill.body;
}
