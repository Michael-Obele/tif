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
		this.version(1).stores({
			senders: '++id, businessName, isDefault',
			clients: '++id, name, company, email',
			serviceItems: '++id, name, description',
			invoices: '++id, number, status, senderId, clientId, issueDate, createdAt',
			settings: 'id'
		});
	}
}

export const db = new TechInvoiceForgeDB();
