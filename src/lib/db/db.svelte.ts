import { createReactiveDB } from 'svelte-idb/svelte';
import type { DBSchema, ILiveQuery } from 'svelte-idb';
import type { AppSettings, Client, Invoice, Sender, ServiceItem } from '$lib/types';

const DB_NAME = 'TechInvoiceForgeDB';
const DB_VERSION = 3;

const STORE_SCHEMA: DBSchema = {
	senders: {
		keyPath: 'id',
		autoIncrement: true,
		indexes: {
			isDefault: { keyPath: 'isDefault' }
		}
	},
	clients: {
		keyPath: 'id',
		autoIncrement: true,
		indexes: {
			email: { keyPath: 'email' }
		}
	},
	serviceItems: {
		keyPath: 'id',
		autoIncrement: true
	},
	invoices: {
		keyPath: 'id',
		autoIncrement: true,
		indexes: {
			isDraft: { keyPath: 'isDraft' },
			status: { keyPath: 'status' },
			createdAt: { keyPath: 'createdAt' },
			'isDraft, createdAt': { keyPath: ['isDraft', 'createdAt'] }
		}
	},
	settings: {
		keyPath: 'id'
	}
};

type CompatibleReactiveStore<T> = {
	readonly storeName: string;
	add(value: T): Promise<IDBValidKey>;
	put(value: T): Promise<IDBValidKey>;
	get(key: IDBValidKey): Promise<T | undefined>;
	getAll(): Promise<T[]>;
	getAllFromIndex(indexName: string, query?: IDBValidKey | IDBKeyRange, count?: number): Promise<T[]>;
	delete(key: IDBValidKey): Promise<void>;
	clear(): Promise<void>;
	count(): Promise<number>;
	liveAll(): ILiveQuery<T[]>;
	liveGet(key: IDBValidKey): ILiveQuery<T | undefined>;
	liveCount(): ILiveQuery<number>;
};

function prepareValue<T extends object>(value: T): T {
	const clone = { ...value } as Record<string, unknown>;
	if ('id' in clone && clone.id === undefined) {
		delete clone.id;
	}
	return clone as T;
}

const reactiveDb = createReactiveDB({
	name: DB_NAME,
	version: DB_VERSION,
	stores: STORE_SCHEMA,
	ssr: 'noop',
	onUpgrade(db, oldVersion, _newVersion, transaction) {
		console.log(`[DB] Upgrading from version ${oldVersion} to ${DB_VERSION}`);

		if (oldVersion < 3 && db.objectStoreNames.contains('invoices')) {
			console.log('[DB] Migration v3: Clearing corrupted invoices from v2...');
			const invoiceStore = transaction.objectStore('invoices');
			invoiceStore.clear();
			console.log('[DB] Migration complete - invoices table cleared');
		}
	},
	onBlocked() {
		console.warn('[DB] Database upgrade blocked - close other tabs');
	}
});

class StoreAdapter<T extends object> {
	constructor(private store: CompatibleReactiveStore<T>) {}

	get storeName(): string {
		return this.store.storeName;
	}

	add(value: T): Promise<IDBValidKey> {
		return this.store.add(prepareValue(value));
	}

	put(value: T): Promise<IDBValidKey> {
		return this.store.put(prepareValue(value));
	}

	get(key: number | string): Promise<T | undefined> {
		return this.store.get(key);
	}

	getAll(): Promise<T[]> {
		return this.store.getAll();
	}

	getAllFromIndex(
		indexName: string,
		query?: IDBValidKey | IDBKeyRange,
		count?: number
	): Promise<T[]> {
		return this.store.getAllFromIndex(indexName, query, count);
	}

	delete(key: number | string): Promise<void> {
		return this.store.delete(key);
	}

	clear(): Promise<void> {
		return this.store.clear();
	}

	count(): Promise<number> {
		return this.store.count();
	}

	liveAll(): ILiveQuery<T[]> {
		return this.store.liveAll();
	}

	liveGet(key: IDBValidKey): ILiveQuery<T | undefined> {
		return this.store.liveGet(key);
	}

	liveCount(): ILiveQuery<number> {
		return this.store.liveCount();
	}
}

class TechInvoiceForgeDB {
	senders = new StoreAdapter<Sender>(reactiveDb.senders as unknown as CompatibleReactiveStore<Sender>);
	clients = new StoreAdapter<Client>(reactiveDb.clients as unknown as CompatibleReactiveStore<Client>);
	serviceItems = new StoreAdapter<ServiceItem>(
		reactiveDb.serviceItems as unknown as CompatibleReactiveStore<ServiceItem>
	);
	invoices = new StoreAdapter<Invoice>(reactiveDb.invoices as unknown as CompatibleReactiveStore<Invoice>);
	settings = new StoreAdapter<AppSettings>(
		reactiveDb.settings as unknown as CompatibleReactiveStore<AppSettings>
	);

	getRawDB(): Promise<IDBDatabase> {
		return reactiveDb.getRawDB();
	}

	close(): Promise<void> {
		return reactiveDb.close();
	}

	liveQuery<T>(queryFn: () => Promise<T>, storeNames: string[]): ILiveQuery<T> {
		return reactiveDb.liveQuery(queryFn, storeNames);
	}
}

export const db = new TechInvoiceForgeDB();