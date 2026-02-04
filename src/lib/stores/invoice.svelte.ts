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

/**
 * Convert an invoice to a serializable format for IndexedDB
 * Strips out non-serializable fields and ensures all dates are plain Date objects
 */
function serializeInvoiceForStorage(invoice: Invoice): Invoice {
	const snapshot = $state.snapshot(invoice);

	return {
		// Basic fields
		id: typeof snapshot.id === 'number' ? snapshot.id : undefined,
		number: snapshot.number,
		type: snapshot.type,
		status: snapshot.status,
		isDraft: (snapshot.isDraft ? 1 : 0) as any, // Store as number for IDB compatibility
		senderId: snapshot.senderId,
		clientId: snapshot.clientId,

		// Ensure all dates are plain Date objects
		issueDate:
			snapshot.issueDate instanceof Date
				? snapshot.issueDate
				: new Date(snapshot.issueDate || Date.now()),
		dueDate: snapshot.dueDate
			? snapshot.dueDate instanceof Date
				? snapshot.dueDate
				: new Date(snapshot.dueDate)
			: undefined,
		paidDate: snapshot.paidDate
			? snapshot.paidDate instanceof Date
				? snapshot.paidDate
				: new Date(snapshot.paidDate)
			: undefined,
		createdAt:
			snapshot.createdAt instanceof Date
				? snapshot.createdAt
				: new Date(snapshot.createdAt || Date.now()),
		updatedAt: new Date(), // Always use current date for updates

		// Nested objects - clean serialization
		senderData: snapshot.senderData
			? {
				businessName: snapshot.senderData.businessName || '',
				address: snapshot.senderData.address || '',
				email: snapshot.senderData.email || '',
				phone: snapshot.senderData.phone,
				taxId: snapshot.senderData.taxId,
				isDefault: snapshot.senderData.isDefault || false,
				createdAt:
					snapshot.senderData.createdAt instanceof Date
						? snapshot.senderData.createdAt
						: new Date(snapshot.senderData.createdAt || Date.now()),
				updatedAt:
					snapshot.senderData.updatedAt instanceof Date
						? snapshot.senderData.updatedAt
						: new Date(snapshot.senderData.updatedAt || Date.now())
				// Note: logo is intentionally excluded (Blob type not serializable)
			}
			: undefined,

		clientSnapshot: snapshot.clientSnapshot
			? {
				name: snapshot.clientSnapshot.name || '',
				company: snapshot.clientSnapshot.company,
				address: snapshot.clientSnapshot.address || '',
				email: snapshot.clientSnapshot.email || '',
				phone: snapshot.clientSnapshot.phone,
				notes: snapshot.clientSnapshot.notes,
				createdAt:
					snapshot.clientSnapshot.createdAt instanceof Date
						? snapshot.clientSnapshot.createdAt
						: new Date(snapshot.clientSnapshot.createdAt || Date.now()),
				updatedAt:
					snapshot.clientSnapshot.updatedAt instanceof Date
						? snapshot.clientSnapshot.updatedAt
						: new Date(snapshot.clientSnapshot.updatedAt || Date.now())
			}
			: undefined,

		// Other fields
		paymentMethod: snapshot.paymentMethod,
		transactionRef: snapshot.transactionRef,
		currency: snapshot.currency || 'USD',
		lineItems: snapshot.lineItems || [],
		discount: snapshot.discount || { type: 'fixed', value: 0 },
		notes: snapshot.notes,
		terms: snapshot.terms,
		template: snapshot.template || 'modern'
	};
}

export class InvoiceStore {
	invoice = $state<Invoice>({ ...defaultInvoice });
	isSaving = $state(false);
	lastSaved = $state<Date | null>(null);
	isInitialized = $state(false);
	invoiceHistory = $state<Invoice[]>([]);

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
	private debouncedSave = debounce(() => this.saveDraftToDb(), 500);

	constructor() {
		// Load from IndexedDB on initialization (browser only)
		if (browser) {
			console.log('[InvoiceStore] Initializing - loading from IndexedDB...');
			this.loadDraftFromDb()
				.then(() => {
					this.isInitialized = true;
					console.log('[InvoiceStore] Initialization complete');
				})
				.catch((error) => {
					console.error('[InvoiceStore] Error during initialization:', error);
					this.isInitialized = true;
				});
		} else {
			this.isInitialized = true;
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
	 * Trigger a debounced save of the current draft
	 */
	triggerSave() {
		if (browser) {
			this.debouncedSave();
		}
	}

	/**
	 * Save current draft to IndexedDB (auto-save on every change)
	 */
	async saveDraftToDb() {
		if (!browser) return;

		try {
			this.isSaving = true;
			console.log('[InvoiceStore] Auto-saving draft to IndexedDB...');

			// Serialize the invoice properly for storage
			const invoiceToSave = serializeInvoiceForStorage(this.invoice);
			invoiceToSave.isDraft = 1 as any; // Explicitly set as 1 (true)

			// Use put() instead of add() to handle both creating and updating.
			// This avoids ConstraintError if the ID already exists and is safer than delete-then-add.
			const id = await db.invoices.put(invoiceToSave);

			// If it was a new draft (no ID), update the state with the generated ID
			if (!this.invoice.id && id) {
				this.invoice.id = Number(id);
			}

			// Clean up any *other* drafts (enforce single draft policy)
			// We do this after saving to ensure we have a valid saved draft first
			const drafts = await db.invoices.getAllFromIndex('isDraft', 1);
			for (const draft of drafts) {
				if (draft.id !== id && draft.id) {
					await db.invoices.delete(draft.id);
				}
			}

			this.lastSaved = new Date();
			console.log('[InvoiceStore] Draft auto-saved successfully, ID:', id);
		} catch (error) {
			console.error('[InvoiceStore] Error saving draft:', error);
			// Try to log more details if it's a structural error
			if (error && (error as any).name) {
				console.error('[InvoiceStore] Error Name:', (error as any).name);
				console.error('[InvoiceStore] Error Message:', (error as any).message);
			}
			this.lastSaved = null;
		} finally {
			this.isSaving = false;
		}
	}

	/**
	 * Save current invoice to history (marks as sent/saved, creates new draft)
	 */
	async saveInvoiceAndCreateNew() {
		if (!browser) return;

		try {
			this.isSaving = true;
			console.log('[InvoiceStore] === SAVE TO HISTORY START ===');
			console.log('[InvoiceStore] Current invoice ID:', this.invoice.id);
			console.log('[InvoiceStore] Current invoice number:', this.invoice.number);

			// Store the old draft ID so we can delete it after saving
			const oldDraftId = this.invoice.id;
			console.log('[InvoiceStore] Old draft ID to delete:', oldDraftId);

			// Serialize the current invoice
			const invoiceToSave = serializeInvoiceForStorage(this.invoice);
			invoiceToSave.isDraft = 0 as any; // 0 for false (saved to history)

			// If status is still draft, default to 'sent' when saving to history
			// Otherwise respect the user-selected status (e.g. 'paid', 'overdue')
			if (invoiceToSave.status === 'draft') {
				invoiceToSave.status = 'sent';
			}

			// CRITICAL: Remove the ID so Dexie auto-generates a new one
			// This prevents ConstraintError when the draft ID already exists
			delete invoiceToSave.id;
			console.log('[InvoiceStore] Invoice prepared for history (ID removed):', {
				number: invoiceToSave.number,
				isDraft: invoiceToSave.isDraft,
				status: invoiceToSave.status
			});

			// Delete the old draft first (if it exists)
			if (oldDraftId) {
				console.log('[InvoiceStore] Deleting old draft with ID:', oldDraftId);
				await db.invoices.delete(oldDraftId);
				console.log('[InvoiceStore] Old draft deleted successfully');
			}

			// Save to history with a fresh auto-generated ID
			const savedId = await db.invoices.add(invoiceToSave);
			console.log('[InvoiceStore] Invoice saved to history with new ID:', savedId);

			// Create fresh draft for new invoice
			this.invoice = {
				...defaultInvoice,
				isDraft: true,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			this.lastSaved = new Date();
			console.log('[InvoiceStore] New draft created, ready for next invoice');
			console.log('[InvoiceStore] === SAVE TO HISTORY COMPLETE ===');
		} catch (error) {
			console.error('[InvoiceStore] === SAVE TO HISTORY FAILED ===');
			console.error('[InvoiceStore] Error saving invoice:', error);
			if (error && (error as any).name) {
				console.error('[InvoiceStore] Error Name:', (error as any).name);
				console.error('[InvoiceStore] Error Message:', (error as any).message);
			}
			this.lastSaved = null;
		} finally {
			this.isSaving = false;
		}
	}

	/**
	 * Load current draft from IndexedDB
	 */
	async loadDraftFromDb() {
		if (!browser) return;

		try {
			console.log('[InvoiceStore] Loading draft from IndexedDB...');

			// Get the current draft (check for 1)
			const drafts = await db.invoices.getAllFromIndex('isDraft', 1);
			const savedDraft = drafts[0];

			if (savedDraft) {
				console.log('[InvoiceStore] Found saved draft:', savedDraft);

				// Merge with defaults to ensure all fields exist
				this.invoice = {
					...defaultInvoice,
					...savedDraft,
					isDraft: true, // Convert back to boolean
					// Ensure dates are Date objects (not SvelteDate)
					issueDate:
						savedDraft.issueDate instanceof Date
							? savedDraft.issueDate
							: new Date(savedDraft.issueDate),
					dueDate: savedDraft.dueDate
						? savedDraft.dueDate instanceof Date
							? savedDraft.dueDate
							: new Date(savedDraft.dueDate)
						: undefined,
					paidDate: savedDraft.paidDate
						? savedDraft.paidDate instanceof Date
							? savedDraft.paidDate
							: new Date(savedDraft.paidDate)
						: undefined,
					createdAt:
						savedDraft.createdAt instanceof Date
							? savedDraft.createdAt
							: new Date(savedDraft.createdAt),
					updatedAt:
						savedDraft.updatedAt instanceof Date
							? savedDraft.updatedAt
							: new Date(savedDraft.updatedAt),
					// Ensure nested objects exist
					senderData: {
						...defaultInvoice.senderData!,
						...savedDraft.senderData
					},
					clientSnapshot: {
						...defaultInvoice.clientSnapshot!,
						...savedDraft.clientSnapshot
					}
				};

				console.log('[InvoiceStore] Draft loaded successfully');
			} else {
				console.log('[InvoiceStore] No draft found, using defaults');
				this.invoice = {
					...defaultInvoice,
					isDraft: true,
					createdAt: new Date(),
					updatedAt: new Date()
				};
			}
		} catch (error) {
			console.error('[InvoiceStore] Error loading draft:', error);
			// Fall back to defaults on load error
			this.invoice = {
				...defaultInvoice,
				isDraft: true,
				createdAt: new Date(),
				updatedAt: new Date()
			};
		}
	}

	/**
	 * Get invoice history (all non-draft invoices sorted by date descending)
	 */
	async getHistory(): Promise<Invoice[]> {
		if (!browser) return [];

		try {
			console.log('[InvoiceStore] === LOADING HISTORY ===');

			// First, let's see ALL invoices for debugging
			const allInvoices = await db.invoices.getAll();
			console.log('[InvoiceStore] Total invoices in DB:', allInvoices.length);
			console.log(
				'[InvoiceStore] All invoices (isDraft values):',
				allInvoices.map((i) => ({
					id: i.id,
					isDraft: i.isDraft,
					number: i.number,
					status: i.status
				}))
			);

			// Query for non-draft invoices (isDraft = 0)
			const rawHistory = await db.invoices.getAllFromIndex('isDraft', 0);
			const history = rawHistory.sort((a, b) => {
				const dateA =
					a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
				const dateB =
					b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
				return dateB - dateA;
			});

			this.invoiceHistory = history;
			console.log('[InvoiceStore] History loaded:', history.length, 'invoices');
			if (history.length > 0) {
				console.log(
					'[InvoiceStore] History items:',
					history.map((i: Invoice) => ({
						id: i.id,
						number: i.number,
						status: i.status,
						createdAt: i.createdAt
					}))
				);
			}
			console.log('[InvoiceStore] === HISTORY LOAD COMPLETE ===');
			return history;
		} catch (error) {
			console.error('[InvoiceStore] === HISTORY LOAD FAILED ===');
			console.error('[InvoiceStore] Error loading history:', error);
			return [];
		}
	}

	/**
	 * Load a specific invoice from history as a COPY (new draft).
	 * The original invoice in history is preserved.
	 */
	async loadInvoiceFromHistory(id: number) {
		if (!browser) return false;

		try {
			const invoice = await db.invoices.get(id);
			if (invoice) {
				// IMPORTANT: Remove the ID so this becomes a NEW draft.
				// This prevents overwriting the original saved invoice in history.
				this.invoice = {
					...invoice,
					id: undefined, // ← Remove ID to create a new draft
					isDraft: true,
					updatedAt: new Date()
				};
				console.log('[InvoiceStore] Loaded invoice from history as new draft (original preserved):', id);
				return true;
			}
			return false;
		} catch (error) {
			console.error('[InvoiceStore] Error loading invoice:', error);
			return false;
		}
	}

	/**
	 * Delete an invoice from history
	 */
	async deleteInvoice(id: number): Promise<boolean> {
		if (!browser) return false;

		try {
			await db.invoices.delete(id);
			console.log('[InvoiceStore] Deleted invoice:', id);
			// Refresh history
			await this.getHistory();
			return true;
		} catch (error) {
			console.error('[InvoiceStore] Error deleting invoice:', error);
			return false;
		}
	}

	/**
	 * Clear current draft and start fresh
	 */
	async clearDraft() {
		if (browser) {
			try {
				const drafts = await db.invoices.getAllFromIndex('isDraft', 1);
				for (const draft of drafts) {
					if (draft.id) await db.invoices.delete(draft.id);
				}
				console.log('[InvoiceStore] Draft cleared from IndexedDB');
			} catch (error) {
				console.error('[InvoiceStore] Error clearing draft:', error);
			}
		}

		this.invoice = {
			...defaultInvoice,
			isDraft: true,
			createdAt: new Date(),
			updatedAt: new Date()
		};
		this.lastSaved = null;
	}

	/**
	 * Force immediate save of draft
	 */
	async forceSaveDraft() {
		await this.saveDraftToDb();
	}
}

export const invoiceStore = new InvoiceStore();
