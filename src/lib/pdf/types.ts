import type { Invoice } from '$lib/types';

// PDF Generation Types
export interface InvoiceTotals {
	subtotal: number;
	taxTotal: number;
	discountAmount: number;
	total: number;
}

export interface TemplateContext {
	invoice: Invoice;
	totals: InvoiceTotals;
}

export type TemplateId = 'modern' | 'classic' | 'tech' | 'bold';

export interface TemplateDefinition {
	id: TemplateId;
	name: string;
	description: string;
	generate: (ctx: TemplateContext) => any; // Returns pdfmake document content
}
