import type { Invoice, LineItem, CurrencyCode } from '$lib/types';

export const defaultLineItem: LineItem = {
	description: 'Service',
	quantity: 1,
	unit: 'hour',
	rate: 0,
	taxRate: 0
};

export const defaultInvoice: Invoice = {
	number: 'INV-001',
	type: 'invoice',
	status: 'draft',
	senderId: null,
	clientId: null,
	issueDate: new Date(),
	currency: 'USD',
	lineItems: [{ ...defaultLineItem }],
	discount: { type: 'fixed', value: 0 },
	template: 'modern',
	createdAt: new Date(),
	updatedAt: new Date(),
	terms: 'Payment due within 30 days.'
};
