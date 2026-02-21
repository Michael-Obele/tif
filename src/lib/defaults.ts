import type { Invoice, LineItem, CurrencyCode, Sender, Client } from '$lib/types';

export const defaultLineItem: LineItem = {
	description: '',
	quantity: 1,
	unit: 'hour',
	rate: 0,
	taxRate: 0
};

export const defaultSender: Omit<Sender, 'id' | 'createdAt' | 'updatedAt'> = {
	businessName: '',
	address: '',
	email: '',
	phone: '',
	taxId: '',
	logo: null,
	website: '',
	defaultTerms: '',
	isDefault: false,
	bankAccounts: []
};

export const defaultClient: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> = {
	name: '',
	company: '',
	address: '',
	email: '',
	phone: '',
	notes: ''
};

export const defaultInvoice: Invoice = {
	number: 'INV-001',
	type: 'invoice',
	status: 'draft',
	isDraft: true,
	senderId: null,
	clientId: null,
	senderData: {
		...defaultSender,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	clientSnapshot: {
		...defaultClient,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	issueDate: new Date(),
	dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
	currency: 'USD',
	lineItems: [{ ...defaultLineItem }],
	discount: { type: 'fixed', value: 0 },
	template: 'modern',
	createdAt: new Date(),
	updatedAt: new Date(),
	notes: '',
	terms: 'Payment due within 30 days.\n\nBank Details:\nBank: [Bank Name]\nAccount: [Account Number]\nRouting: [Routing Number]'
};
