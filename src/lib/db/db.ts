/**
 * Database module for Tech Invoice Forge
 *
	* This file re-exports the local database singleton.
	* The underlying implementation is a svelte-idb-backed
	* compatibility adapter that preserves the existing db API.
 */

export { db } from './db.native';
