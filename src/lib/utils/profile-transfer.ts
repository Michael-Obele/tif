import { defaultSender } from '$lib/defaults';
import type { BankAccount, Client, Sender } from '$lib/types';
import {
	array,
	boolean,
	literal,
	nullable,
	number,
	object,
	optional,
	parse,
	string
} from 'valibot';

const PROFILE_TRANSFER_FORMAT = 'tech-invoice-forge-profile';
const PROFILE_TRANSFER_VERSION = 1;

const bankAccountSchema = object({
	id: string(),
	bankName: string(),
	accountName: string(),
	accountNumber: string(),
	routingNumber: optional(string()),
	swiftCode: optional(string()),
	iban: optional(string()),
	currency: string()
});

const senderTransferSchema = object({
	businessName: string(),
	address: string(),
	email: string(),
	phone: optional(string()),
	taxId: optional(string()),
	logo: optional(nullable(string())),
	website: optional(string()),
	defaultCurrency: optional(string()),
	defaultTerms: optional(string()),
	bankAccounts: optional(array(bankAccountSchema)),
	isDefault: optional(boolean()),
	createdAt: optional(string()),
	updatedAt: optional(string())
});

const clientTransferSchema = object({
	name: string(),
	company: optional(string()),
	address: string(),
	email: string(),
	phone: optional(string()),
	taxId: optional(string()),
	notes: optional(string()),
	createdAt: optional(string()),
	updatedAt: optional(string())
});

const profileTransferSchema = object({
	format: literal(PROFILE_TRANSFER_FORMAT),
	version: number(),
	exportedAt: string(),
	sender: senderTransferSchema,
	clients: array(clientTransferSchema)
});

type SenderTransfer = Omit<Sender, 'id' | 'createdAt' | 'updatedAt'> & {
	createdAt?: string;
	updatedAt?: string;
};

type ClientTransfer = Omit<Client, 'id' | 'createdAt' | 'updatedAt'> & {
	createdAt?: string;
	updatedAt?: string;
};

export interface ParsedProfileTransfer {
	sender: Sender;
	clients: Client[];
	exportedAt: Date;
}

export type ProfileImportClientAction = 'merge' | 'new';

export interface ProfileImportClientPreview {
	action: ProfileImportClientAction;
	name: string;
	company?: string;
	email: string;
}

export interface ProfileImportPreview {
	exportedAt: Date;
	senderWillChange: boolean;
	currentSenderName: string;
	importedSenderName: string;
	totalClients: number;
	matchedClients: number;
	newClients: number;
	clientPreview: ProfileImportClientPreview[];
}

function toIsoString(value: Date | string | undefined): string {
	if (!value) return new Date().toISOString();
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function fromOptionalDate(value: string | undefined, fallback: Date): Date {
	if (!value) return fallback;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? fallback : date;
}

function normalizeBankAccounts(accounts: BankAccount[] | undefined): BankAccount[] {
	return (accounts ?? []).map((account) => ({
		id: account.id,
		bankName: account.bankName ?? '',
		accountName: account.accountName ?? '',
		accountNumber: account.accountNumber ?? '',
		routingNumber: account.routingNumber ?? '',
		swiftCode: account.swiftCode ?? '',
		iban: account.iban ?? '',
		currency: account.currency ?? 'USD'
	}));
}

function normalizeSenderForComparison(sender: Sender) {
	return {
		businessName: sender.businessName ?? '',
		address: sender.address ?? '',
		email: sender.email ?? '',
		phone: sender.phone ?? '',
		taxId: sender.taxId ?? '',
		logo: sender.logo ?? null,
		website: sender.website ?? '',
		defaultCurrency: sender.defaultCurrency ?? 'USD',
		defaultTerms: sender.defaultTerms ?? '',
		bankAccounts: normalizeBankAccounts(sender.bankAccounts)
	};
}

function serializeSender(sender: Sender): SenderTransfer {
	return {
		businessName: sender.businessName ?? '',
		address: sender.address ?? '',
		email: sender.email ?? '',
		phone: sender.phone ?? '',
		taxId: sender.taxId ?? '',
		logo: sender.logo ?? null,
		website: sender.website ?? '',
		defaultCurrency: sender.defaultCurrency ?? 'USD',
		defaultTerms: sender.defaultTerms ?? '',
		bankAccounts: normalizeBankAccounts(sender.bankAccounts),
		isDefault: sender.isDefault,
		createdAt: toIsoString(sender.createdAt),
		updatedAt: toIsoString(sender.updatedAt)
	};
}

function serializeClient(client: Client): ClientTransfer {
	return {
		name: client.name ?? '',
		company: client.company ?? '',
		address: client.address ?? '',
		email: client.email ?? '',
		phone: client.phone ?? '',
		taxId: client.taxId ?? '',
		notes: client.notes ?? '',
		createdAt: toIsoString(client.createdAt),
		updatedAt: toIsoString(client.updatedAt)
	};
}

export function createProfileTransferText(sender: Sender, clients: Client[]): string {
	return JSON.stringify(
		{
			format: PROFILE_TRANSFER_FORMAT,
			version: PROFILE_TRANSFER_VERSION,
			exportedAt: new Date().toISOString(),
			sender: serializeSender(sender),
			clients: clients.map(serializeClient)
		},
		null,
		2
	);
}

export function parseProfileTransferText(rawText: string): ParsedProfileTransfer {
	let json: unknown;

	try {
		json = JSON.parse(rawText);
	} catch {
		throw new Error('The selected file is not a valid Tech Invoice Forge profile backup.');
	}

	const payload = parse(profileTransferSchema, json);

	if (payload.version !== PROFILE_TRANSFER_VERSION) {
		throw new Error(`Unsupported profile backup version: ${payload.version}.`);
	}

	const exportedAt = fromOptionalDate(payload.exportedAt, new Date());
	const senderCreatedAt = fromOptionalDate(payload.sender.createdAt, exportedAt);
	const senderUpdatedAt = fromOptionalDate(payload.sender.updatedAt, senderCreatedAt);

	return {
		exportedAt,
		sender: {
			...defaultSender,
			...payload.sender,
			logo: payload.sender.logo ?? null,
			bankAccounts: normalizeBankAccounts(payload.sender.bankAccounts),
			isDefault: true,
			createdAt: senderCreatedAt,
			updatedAt: senderUpdatedAt
		},
		clients: payload.clients.map((client) => {
			const createdAt = fromOptionalDate(client.createdAt, exportedAt);
			const updatedAt = fromOptionalDate(client.updatedAt, createdAt);

			return {
				name: client.name,
				company: client.company ?? '',
				address: client.address,
				email: client.email,
				phone: client.phone ?? '',
				taxId: client.taxId ?? '',
				notes: client.notes ?? '',
				createdAt,
				updatedAt
			};
		})
	};
}

export function areMatchingClients(existingClient: Client, importedClient: Client) {
	const existingEmail = existingClient.email.trim().toLowerCase();
	const importedEmail = importedClient.email.trim().toLowerCase();

	if (existingEmail && importedEmail && existingEmail === importedEmail) {
		return true;
	}

	const existingName = existingClient.name.trim().toLowerCase();
	const importedName = importedClient.name.trim().toLowerCase();
	const existingCompany = (existingClient.company ?? '').trim().toLowerCase();
	const importedCompany = (importedClient.company ?? '').trim().toLowerCase();

	return existingName === importedName && existingCompany === importedCompany;
}

export function buildProfileImportPreview(
	parsed: ParsedProfileTransfer,
	existingSender: Sender,
	existingClients: Client[]
): ProfileImportPreview {
	const clientPreview: ProfileImportClientPreview[] = parsed.clients.map((client) => {
		const action: ProfileImportClientAction = existingClients.some((existingClient) =>
			areMatchingClients(existingClient, client)
		)
			? 'merge'
			: 'new';

		return {
			action,
			name: client.name,
			company: client.company ?? '',
			email: client.email
		};
	});

	const matchedClients = clientPreview.filter((client) => client.action === 'merge').length;
	const newClients = clientPreview.length - matchedClients;

	return {
		exportedAt: parsed.exportedAt,
		senderWillChange:
			JSON.stringify(normalizeSenderForComparison(existingSender)) !==
			JSON.stringify(normalizeSenderForComparison(parsed.sender)),
		currentSenderName: existingSender.businessName || 'Current profile',
		importedSenderName: parsed.sender.businessName || 'Imported profile',
		totalClients: parsed.clients.length,
		matchedClients,
		newClients,
		clientPreview
	};
}
