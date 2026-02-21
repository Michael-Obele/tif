/**
 * Native IndexedDB Wrapper for Tech Invoice Forge
 *
 * A clean, promise-based wrapper around the native IndexedDB Web API.
 * No external dependencies - just the browser's built-in IndexedDB.
 */

import { browser } from '$app/environment';
import type { Sender, Client, Invoice, ServiceItem, AppSettings } from '$lib/types';

// Database configuration
const DB_NAME = 'TechInvoiceForgeDB';
const DB_VERSION = 3;

// Schema definition
interface StoreSchema {
	keyPath: string;
	autoIncrement?: boolean;
	indexes?: { name: string; keyPath: string | string[]; unique?: boolean }[];
}

const SCHEMA: Record<string, StoreSchema> = {
	senders: {
		keyPath: 'id',
		autoIncrement: true,
		indexes: [{ name: 'isDefault', keyPath: 'isDefault' }]
	},
	clients: {
		keyPath: 'id',
		autoIncrement: true,
		indexes: [{ name: 'email', keyPath: 'email' }]
	},
	serviceItems: {
		keyPath: 'id',
		autoIncrement: true
	},
	invoices: {
		keyPath: 'id',
		autoIncrement: true,
		indexes: [
			{ name: 'isDraft', keyPath: 'isDraft' },
			{ name: 'status', keyPath: 'status' },
			{ name: 'createdAt', keyPath: 'createdAt' },
			{ name: 'isDraft, createdAt', keyPath: ['isDraft', 'createdAt'] }
		]
	},
	settings: {
		keyPath: 'id',
		autoIncrement: false
	}
};

/**
 * Generic store wrapper for IndexedDB object stores.
 * Provides promise-based CRUD operations.
 */
class NativeStore<T> {
	constructor(
		private dbPromise: Promise<IDBDatabase>,
		private storeName: string
	) {}

	/**
	 * Add a new record. Fails if key already exists.
	 * If the id is undefined, it will be auto-generated.
	 */
	async add(value: T): Promise<IDBValidKey> {
		const db = await this.dbPromise;
		return new Promise((resolve, reject) => {
			const tx = db.transaction(this.storeName, 'readwrite');
			const store = tx.objectStore(this.storeName);

			// Clone value and remove undefined id to allow autoIncrement
			const valueToStore = this.prepareValue(value);

			const request = store.add(valueToStore);
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Add or update a record (upsert).
	 * If the id is undefined, it will be auto-generated (insert).
	 */
	async put(value: T): Promise<IDBValidKey> {
		const db = await this.dbPromise;
		return new Promise((resolve, reject) => {
			const tx = db.transaction(this.storeName, 'readwrite');
			const store = tx.objectStore(this.storeName);

			// Clone value and remove undefined id to allow autoIncrement
			const valueToStore = this.prepareValue(value);

			const request = store.put(valueToStore);
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Prepare a value for storage by removing undefined id.
	 * This allows autoIncrement to generate keys for new records.
	 */
	private prepareValue(value: T): T {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const clone = { ...value } as any;
		if (clone.id === undefined) {
			delete clone.id;
		}
		return clone as T;
	}

	/**
	 * Get a single record by key.
	 */
	async get(key: number | string): Promise<T | undefined> {
		const db = await this.dbPromise;
		return new Promise((resolve, reject) => {
			const tx = db.transaction(this.storeName, 'readonly');
			const store = tx.objectStore(this.storeName);
			const request = store.get(key);
			request.onsuccess = () => resolve(request.result as T | undefined);
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Get all records in the store.
	 */
	async getAll(): Promise<T[]> {
		const db = await this.dbPromise;
		return new Promise((resolve, reject) => {
			const tx = db.transaction(this.storeName, 'readonly');
			const store = tx.objectStore(this.storeName);
			const request = store.getAll();
			request.onsuccess = () => resolve(request.result as T[]);
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Get all records matching an index query.
	 */
	async getAllFromIndex(
		indexName: string,
		query?: IDBValidKey | IDBKeyRange,
		count?: number
	): Promise<T[]> {
		const db = await this.dbPromise;
		return new Promise((resolve, reject) => {
			const tx = db.transaction(this.storeName, 'readonly');
			const store = tx.objectStore(this.storeName);
			const index = store.index(indexName);
			const request = count !== undefined ? index.getAll(query, count) : index.getAll(query);
			request.onsuccess = () => resolve(request.result as T[]);
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Delete a record by key.
	 */
	async delete(key: number | string): Promise<void> {
		const db = await this.dbPromise;
		return new Promise((resolve, reject) => {
			const tx = db.transaction(this.storeName, 'readwrite');
			const store = tx.objectStore(this.storeName);
			const request = store.delete(key);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Clear all records from the store.
	 */
	async clear(): Promise<void> {
		const db = await this.dbPromise;
		return new Promise((resolve, reject) => {
			const tx = db.transaction(this.storeName, 'readwrite');
			const store = tx.objectStore(this.storeName);
			const request = store.clear();
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Count records in the store.
	 */
	async count(): Promise<number> {
		const db = await this.dbPromise;
		return new Promise((resolve, reject) => {
			const tx = db.transaction(this.storeName, 'readonly');
			const store = tx.objectStore(this.storeName);
			const request = store.count();
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}
}

/**
 * Tech Invoice Forge Database - Native IndexedDB Implementation
 */
class TechInvoiceForgeNativeDB {
	private dbPromise: Promise<IDBDatabase>;

	senders: NativeStore<Sender>;
	clients: NativeStore<Client>;
	serviceItems: NativeStore<ServiceItem>;
	invoices: NativeStore<Invoice>;
	settings: NativeStore<AppSettings>;

	constructor() {
		if (!browser) {
			// SSR: Create a never-resolving promise to prevent server-side DB access
			this.dbPromise = new Promise(() => {});
		} else {
			this.dbPromise = this.openDatabase();
		}

		// Initialize typed store accessors
		this.senders = new NativeStore(this.dbPromise, 'senders');
		this.clients = new NativeStore(this.dbPromise, 'clients');
		this.serviceItems = new NativeStore(this.dbPromise, 'serviceItems');
		this.invoices = new NativeStore(this.dbPromise, 'invoices');
		this.settings = new NativeStore(this.dbPromise, 'settings');
	}

	/**
	 * Open the IndexedDB database with schema setup.
	 */
	private openDatabase(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(DB_NAME, DB_VERSION);

			request.onerror = () => {
				console.error('[NativeDB] Error opening database:', request.error);
				reject(request.error);
			};

			request.onsuccess = () => {
				console.log('[NativeDB] Database opened successfully');
				resolve(request.result);
			};

			request.onupgradeneeded = (event) => {
				const db = request.result;
				const tx = request.transaction!;
				const oldVersion = event.oldVersion;

				console.log(`[NativeDB] Upgrading from version ${oldVersion} to ${DB_VERSION}`);

				// Create object stores and indexes based on schema
				for (const [storeName, schema] of Object.entries(SCHEMA)) {
					let store: IDBObjectStore;

					if (!db.objectStoreNames.contains(storeName)) {
						// Create new store
						store = db.createObjectStore(storeName, {
							keyPath: schema.keyPath,
							autoIncrement: schema.autoIncrement
						});
						console.log(`[NativeDB] Created store: ${storeName}`);
					} else {
						// Get existing store from transaction
						store = tx.objectStore(storeName);
					}

					// Create indexes
					if (schema.indexes) {
						for (const idx of schema.indexes) {
							if (!store.indexNames.contains(idx.name)) {
								store.createIndex(idx.name, idx.keyPath, { unique: idx.unique || false });
								console.log(`[NativeDB] Created index: ${storeName}.${idx.name}`);
							}
						}
					}
				}

				// Migration: Clear corrupted invoices from v2
				if (oldVersion < 3 && db.objectStoreNames.contains('invoices')) {
					console.log('[NativeDB] Migration v3: Clearing corrupted invoices from v2...');
					const invoiceStore = tx.objectStore('invoices');
					invoiceStore.clear();
					console.log('[NativeDB] Migration complete - invoices table cleared');
				}
			};

			request.onblocked = () => {
				console.warn('[NativeDB] Database upgrade blocked - close other tabs');
			};
		});
	}

	/**
	 * Get the raw IDBDatabase instance for advanced operations.
	 */
	async getRawDB(): Promise<IDBDatabase> {
		return this.dbPromise;
	}
}

// Export singleton instance
export const db = new TechInvoiceForgeNativeDB();
