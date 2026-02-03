import { defaultInvoice, defaultLineItem } from '$lib/defaults';
import type { Invoice, LineItem } from '$lib/types';
import { db } from '$lib/db/db';
import { browser } from '$app/environment';

// Debounce helper
function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
	let timeoutId: ReturnType<typeof setTimeout>;
	return ((...args: unknown[]) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	}) as T;
}

export class InvoiceStore {
	invoice = $state<Invoice>({ ...defaultInvoice });
	isSaving = $state(false);
	lastSaved = $state<Date | null>(null);

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

	// Debounced save function
	private debouncedSave = debounce(() => this.saveToDb(), 1000);

	constructor() {
		// Load from IndexedDB on initialization (browser only)
		if (browser) {
			console.log('[InvoiceStore] Initializing - loading from IndexedDB...');
			this.loadFromDb();
		}
	}

	calculateDiscount() {
		if (this.invoice.discount.type === 'fixed') {
			return this.invoice.discount.value;
		}
		return this.subtotal * (this.invoice.discount.value / 100);
	}

	addLineItem() {
		this.invoice.lineItems.push({ ...defaultLineItem });
		this.triggerSave();
	}

	removeLineItem(index: number) {
		if (this.invoice.lineItems.length > 1) {
			this.invoice.lineItems = this.invoice.lineItems.filter((_, i) => i !== index);
			this.triggerSave();
		}
	}

	updateLineItem(index: number, item: Partial<LineItem>) {
		if (this.invoice.lineItems[index]) {
			Object.assign(this.invoice.lineItems[index], item);
			this.triggerSave();
		}
	}

	/**
	 * Trigger a debounced save to IndexedDB
	 */
	triggerSave() {
		if (browser) {
			this.debouncedSave();
		}
	}

	/**
	 * Save current invoice to IndexedDB
	 */
	async saveToDb() {
		if (!browser) return;

		try {
			this.isSaving = true;
			console.log('[InvoiceStore] Saving invoice to IndexedDB...', this.invoice);

			// Prepare invoice for storage
			const invoiceToSave: Invoice = {
				...this.invoice,
				updatedAt: new Date()
			};

			// Use put to insert or update
			// For draft invoices, we'll use a fixed ID (1) to always overwrite
			const draftInvoice = { ...invoiceToSave, id: 1 };
			await db.invoices.put(draftInvoice);

			this.lastSaved = new Date();
			console.log('[InvoiceStore] Invoice saved successfully at', this.lastSaved);
		} catch (error) {
			console.error('[InvoiceStore] Error saving invoice:', error);
		} finally {
			this.isSaving = false;
		}
	}

	/**
	 * Load invoice from IndexedDB
	 */
	async loadFromDb() {
		if (!browser) return;

		try {
			console.log('[InvoiceStore] Loading invoice from IndexedDB...');

			// Try to load the draft invoice (ID: 1)
			const savedInvoice = await db.invoices.get(1);

			if (savedInvoice) {
				console.log('[InvoiceStore] Found saved invoice:', savedInvoice);

				// Merge with defaults to ensure all fields exist
				this.invoice = {
					...defaultInvoice,
					...savedInvoice,
					// Ensure dates are Date objects
					issueDate: new Date(savedInvoice.issueDate),
					dueDate: savedInvoice.dueDate ? new Date(savedInvoice.dueDate) : undefined,
					createdAt: new Date(savedInvoice.createdAt),
					updatedAt: new Date(savedInvoice.updatedAt),
					// Ensure nested objects exist
					senderData: {
						...defaultInvoice.senderData!,
						...savedInvoice.senderData
					},
					clientSnapshot: {
						...defaultInvoice.clientSnapshot!,
						...savedInvoice.clientSnapshot
					}
				};

				console.log('[InvoiceStore] Invoice loaded successfully');
			} else {
				console.log('[InvoiceStore] No saved invoice found, using defaults');
			}
		} catch (error) {
			console.error('[InvoiceStore] Error loading invoice:', error);
		}
	}

	/**
	 * Clear current invoice and start fresh
	 */
	async clearInvoice() {
		if (browser) {
			try {
				await db.invoices.delete(1);
				console.log('[InvoiceStore] Draft deleted from IndexedDB');
			} catch (error) {
				console.error('[InvoiceStore] Error deleting draft:', error);
			}
		}

		this.invoice = {
			...defaultInvoice,
			createdAt: new Date(),
			updatedAt: new Date()
		};
		this.lastSaved = null;
	}

	/**
	 * Force immediate save (for use before page unload, etc.)
	 */
	async forceSave() {
		await this.saveToDb();
	}
}

export const invoiceStore = new InvoiceStore();

// Auto-save effect - watches for changes and triggers save
// This needs to be in a component that uses $effect, so we export a helper
export function setupAutoSave() {
	$effect(() => {
		// Access all reactive properties to track them
		const _ = JSON.stringify(invoiceStore.invoice);

		// Trigger debounced save
		invoiceStore.triggerSave();
	});
}
