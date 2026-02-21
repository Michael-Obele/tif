import { db } from '$lib/db/db';
import type { Sender, Client, BankAccount } from '$lib/types';
import { browser } from '$app/environment';

export class ProfileStore {
	sender = $state<Sender>({
		businessName: '',
		address: '',
		email: '',
		phone: '',
		taxId: '',
		logo: null,
		isDefault: true,
		bankAccounts: [],
		createdAt: new Date(),
		updatedAt: new Date()
	});

	clients = $state<Client[]>([]);
	isLoading = $state(false);

	constructor() {
		if (browser) {
			this.init();
		}
	}

	async init() {
		this.isLoading = true;
		try {
			await Promise.all([this.loadSender(), this.loadClients()]);
		} catch (error) {
			console.error('Error initializing profile store:', error);
		} finally {
			this.isLoading = false;
		}
	}

	async loadSender() {
		if (!browser) return;
		try {
			// Find default sender
			const senders = await db.senders.getAll();
			const defaultSender = senders.find((s) => s.isDefault);

			if (defaultSender) {
				this.sender = defaultSender;
			} else if (senders.length > 0) {
				// Use first one if no default
				this.sender = senders[0];
			} else {
				// Initialize with empty if none exists
				// We don't save it yet, only when user saves
			}
		} catch (error) {
			console.error('Error loading sender:', error);
		}
	}

	async saveSender(senderData: Partial<Sender>) {
		if (!browser) return;
		try {
			// Create updated object
			const updatedSender: Sender = {
				...this.sender,
				...senderData,
				updatedAt: new Date()
			};

			// Snapshot to remove proxies before DB operation
			const senderToSave = $state.snapshot(updatedSender);

			// If it has an ID, update it
			if (senderToSave.id) {
				await db.senders.put(senderToSave);
			} else {
				// New sender
				senderToSave.createdAt = new Date();
				const id = await db.senders.add(senderToSave);
				updatedSender.id = Number(id); // Update local state with new ID
			}

			this.sender = updatedSender;
			return updatedSender;
		} catch (error) {
			console.error('Error saving sender:', error);
			throw error;
		}
	}

	async loadClients() {
		if (!browser) return;
		try {
			this.clients = await db.clients.getAll();
		} catch (error) {
			console.error('Error loading clients:', error);
		}
	}

	async saveClient(client: Client) {
		if (!browser) return;
		try {
			// Snapshot to remove proxies
			const clientToSave = $state.snapshot(client);
			clientToSave.updatedAt = new Date();

			if (!clientToSave.id) {
				clientToSave.createdAt = new Date();
				const id = await db.clients.add(clientToSave);
				clientToSave.id = Number(id);
			} else {
				await db.clients.put(clientToSave);
			}

			await this.loadClients(); // Refresh list
			return clientToSave;
		} catch (error) {
			console.error('Error saving client:', error);
			throw error;
		}
	}

	async deleteClient(id: number) {
		if (!browser) return;
		try {
			await db.clients.delete(id);
			await this.loadClients();
		} catch (error) {
			console.error('Error deleting client:', error);
		}
	}

	// Bank Account Helpers
	addBankAccount() {
		if (!this.sender.bankAccounts) this.sender.bankAccounts = [];
		this.sender.bankAccounts.push({
			id: crypto.randomUUID(),
			bankName: '',
			accountName: '',
			accountNumber: '',
			currency: 'USD'
		});
	}

	removeBankAccount(id: string) {
		if (!this.sender.bankAccounts) return;
		this.sender.bankAccounts = this.sender.bankAccounts.filter((acc) => acc.id !== id);
	}
}

export const profileStore = new ProfileStore();
