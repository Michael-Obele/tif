import Dexie, { type Table } from 'dexie';
import type { Sender, Client, Invoice, ServiceItem, AppSettings } from '$lib/types';

export class TechInvoiceForgeDB extends Dexie {
	senders!: Table<Sender, number>;
	clients!: Table<Client, number>;
	serviceItems!: Table<ServiceItem, number>;
	invoices!: Table<Invoice, number>;
	settings!: Table<AppSettings, string>;

	constructor() {
		super('TechInvoiceForgeDB');

		// Version 2 schema (kept for reference, superseded by version 3)
		this.version(2).stores({
			senders: '++id, businessName, isDefault',
			clients: '++id, name, company, email',
			serviceItems: '++id, name, description',
			invoices: '++id, isDraft, status, createdAt, updatedAt, [isDraft+createdAt]',
			settings: 'id'
		});

		// Version 3 - Fix corrupted invoice data from previous serialization issues
		this.version(3)
			.stores({
				senders: '++id, businessName, isDefault',
				clients: '++id, name, company, email',
				serviceItems: '++id, name, description',
				invoices: '++id, isDraft, status, createdAt, updatedAt, [isDraft+createdAt]',
				settings: 'id'
			})
			.upgrade(async (tx) => {
				// Clear corrupted invoices from previous attempts
				// The invoices table will be cleared and users start fresh
				console.log('[DB Migration] Clearing corrupted invoices from v2...');
				await tx.table('invoices').clear();
				console.log('[DB Migration] Migration complete - invoices table cleared');
			});
	}
}

export const db = new TechInvoiceForgeDB();
