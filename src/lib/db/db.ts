/**
 * Database module for Tech Invoice Forge
 *
 * This file re-exports the native IndexedDB implementation.
 * The native implementation provides a clean, dependency-free
 * wrapper around the browser's IndexedDB Web API.
 */

export { db } from './db.native';
