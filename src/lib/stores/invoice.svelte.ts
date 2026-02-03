import { defaultInvoice, defaultLineItem } from '$lib/defaults';
import type { Invoice, LineItem } from '$lib/types';
import { db } from '$lib/db/db';

export class InvoiceStore {
	invoice = $state<Invoice>({ ...defaultInvoice });

	subtotal = $derived(
		this.invoice.lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0)
	);
	taxTotal = $derived(
		this.invoice.lineItems.reduce(
			(sum, item) => sum + item.quantity * item.rate * (item.taxRate / 100),
			0
		)
	);
	discountAmount = $derived(this.calculateDiscount());
	total = $derived(this.subtotal + this.taxTotal - this.discountAmount);

	constructor() {
		// Logic to load initial state can go here
	}

	calculateDiscount() {
		if (this.invoice.discount.type === 'fixed') {
			return this.invoice.discount.value;
		}
		return this.subtotal * (this.invoice.discount.value / 100);
	}

	addLineItem() {
		this.invoice.lineItems.push({ ...defaultLineItem });
	}

	removeLineItem(index: number) {
		if (this.invoice.lineItems.length > 1) {
			this.invoice.lineItems = this.invoice.lineItems.filter((_, i) => i !== index);
		}
	}

	updateLineItem(index: number, item: Partial<LineItem>) {
		if (this.invoice.lineItems[index]) {
			Object.assign(this.invoice.lineItems[index], item);
		}
	}

	// Persistence logic can be added here
}

export const invoiceStore = new InvoiceStore();
