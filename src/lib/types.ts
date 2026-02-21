export type Unit = 'hour' | 'day' | 'unit' | 'flat' | 'project' | 'month' | 'word' | 'page';
export type CurrencyCode = string;
export type TemplateName = 'modern' | 'classic' | 'tech' | 'bold';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'bank_transfer' | 'credit_card' | 'paypal' | 'cash' | 'check' | 'other';
export type PaymentTerms =
	| 'due_on_receipt'
	| 'net_7'
	| 'net_15'
	| 'net_30'
	| 'net_45'
	| 'net_60'
	| 'custom';

export interface Sender {
	id?: number;
	businessName: string;
	address: string;
	email: string;
	phone?: string;
	taxId?: string;
	logo?: string | null;
	website?: string;
	defaultTerms?: string;
	bankAccounts?: BankAccount[];
	isDefault: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface Client {
	id?: number;
	name: string;
	company?: string;
	address: string;
	email: string;
	phone?: string;
	taxId?: string;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ServiceItem {
	id?: number;
	name: string;
	description: string;
	defaultRate: number;
	defaultUnit: Unit;
	taxRate: number;
	category?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface LineItem {
	description: string;
	quantity: number;
	unit: Unit;
	rate: number;
	taxRate: number;
}

export interface Discount {
	type: 'percentage' | 'fixed';
	value: number;
}

export interface Invoice {
	id?: number;
	number: string;
	type: 'invoice' | 'receipt';
	status: InvoiceStatus;
	isDraft: boolean; // Track if this is the current working draft

	senderId: number | null;
	clientId: number | null;

	senderData?: Sender; // Snapshot
	clientSnapshot?: Client;

	issueDate: Date;
	dueDate?: Date;
	paidDate?: Date;
	paymentMethod?: PaymentMethod;
	transactionRef?: string;
	currency: CurrencyCode;
	lineItems: LineItem[];
	discount: Discount;
	notes?: string;
	terms?: string;
	template: TemplateName;
	createdAt: Date;
	updatedAt: Date;
}

export interface InvoiceNumberConfig {
	prefix: string;
	includeYear: boolean;
	includeMonth: boolean;
	separator: string;
	padLength: number;
}

export type DateFormat =
	| 'YYYY-MM-DD'
	| 'MM/DD/YYYY'
	| 'DD/MM/YYYY'
	| 'MMM DD, YYYY'
	| 'DD MMM YYYY';

export interface AppSettings {
	id?: string; // 'settings'
	theme: 'light' | 'dark';
	defaultCurrency: CurrencyCode;
	defaultTemplate: TemplateName;
	defaultPaymentTerms: PaymentTerms;
	defaultTaxRate: number;
	invoiceNumberConfig: InvoiceNumberConfig;
	dateFormat: DateFormat;
}

export interface BankAccount {
	id: string; // UUID
	bankName: string;
	accountName: string;
	accountNumber: string;
	routingNumber?: string;
	swiftCode?: string;
	iban?: string;
	currency: CurrencyCode;
}
