import { db } from '$lib/db/db';
import type { Sender, Client, BankAccount } from '$lib/types';
import { browser } from '$app/environment';
import {
	areMatchingClients,
	buildProfileImportPreview,
	createProfileTransferText,
	migrateLegacyBankAccounts,
	parseProfileTransferText,
	type ProfileImportPreview
} from '$lib/utils/profile-transfer';

export interface ProfileImportResult {
	createdClients: number;
	updatedClients: number;
	totalClients: number;
	replacedSender: boolean;
}

export class ProfileStore {
	sender = $state<Sender>({
		businessName: '',
		address: '',
		email: '',
		phone: '',
		taxId: '',
		logo: null,
		defaultCurrency: 'USD',
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
				this.sender = {
					...defaultSender,
					bankAccounts: migrateLegacyBankAccounts(defaultSender.bankAccounts)
				};
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

	exportProfileText() {
		const sender = $state.snapshot(this.sender);
		const clients = $state.snapshot(this.clients);

		return createProfileTransferText(sender, clients);
	}

	previewProfileImportText(rawText: string): ProfileImportPreview {
		const parsed = parseProfileTransferText(rawText);
		const sender = $state.snapshot(this.sender);
		const clients = $state.snapshot(this.clients);

		return buildProfileImportPreview(parsed, sender, clients);
	}

	async importProfileText(rawText: string): Promise<ProfileImportResult> {
		if (!browser) {
			throw new Error('Profile import is only available in the browser.');
		}

		const parsed = parseProfileTransferText(rawText);
		let createdClients = 0;
		let updatedClients = 0;

		await this.saveSender({
			...parsed.sender,
			id: this.sender.id,
			isDefault: true
		});

		const existingClients = await db.clients.getAll();
		const mergedClients = [...existingClients];

		for (const importedClient of parsed.clients) {
			const match = mergedClients.find((client) => areMatchingClients(client, importedClient));

			if (match?.id !== undefined) {
				const updatedClient: Client = {
					...match,
					...importedClient,
					id: match.id,
					createdAt: match.createdAt,
					updatedAt: new Date()
				};

				await db.clients.put(updatedClient);
				Object.assign(match, updatedClient);
				updatedClients += 1;
				continue;
			}

			const newClient: Client = {
				...importedClient,
				createdAt: importedClient.createdAt ?? new Date(),
				updatedAt: new Date()
			};

			const id = await db.clients.add(newClient);
			mergedClients.push({ ...newClient, id: Number(id) });
			createdClients += 1;
		}

		await Promise.all([this.loadSender(), this.loadClients()]);

		return {
			createdClients,
			updatedClients,
			totalClients: parsed.clients.length,
			replacedSender: true
		};
	}

	// Bank Account Helpers
	addBankAccount() {
		if (!this.sender.bankAccounts) this.sender.bankAccounts = [];
		this.sender.bankAccounts.push({
			id: crypto.randomUUID(),
			bankName: '',
			accountName: '',
			accountNumber: '',
			currency: 'USD',
			fields: []
		});
	}

	removeBankAccount(id: string) {
		if (!this.sender.bankAccounts) return;
		this.sender.bankAccounts = this.sender.bankAccounts.filter((acc) => acc.id !== id);
	}
}

export const profileStore = new ProfileStore();
