# Tech Invoice Forge - Architecture

[← Back to Index](./index.md) | [Master Plan](./master-plan.md) | [Features](./features.md)

---

## System Overview

Tech Invoice Forge is a client-side-only web application. There is no backend server—all processing, storage, and PDF generation happens in the browser.

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   SvelteKit  │  │   pdfmake    │  │     IndexedDB        │  │
│  │   Frontend   │──│   PDF Gen    │  │   (via Dexie.js)     │  │
│  │              │  │              │  │                      │  │
│  │  - Forms     │  │  - Layout    │  │  - Invoices          │  │
│  │  - Preview   │  │  - Fonts     │  │  - Clients           │  │
│  │  - UI        │  │  - Tables    │  │  - Services          │  │
│  │  - State     │  │  - Images    │  │  - Settings          │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   PDF Download   │
                    │   (client-side)  │
                    └──────────────────┘
```

---

## Technology Stack

### Core Framework

| Package                    | Version | Purpose                 |
| :------------------------- | :------ | :---------------------- |
| `svelte`                   | ^5.0.0  | UI framework with runes |
| `@sveltejs/kit`            | ^2.0.0  | Application framework   |
| `@sveltejs/adapter-static` | ^3.0.0  | Static site generation  |

### UI Components

| Package          | Version  | Purpose                       |
| :--------------- | :------- | :---------------------------- |
| `bits-ui`        | ^1.0.0   | Headless component primitives |
| `shadcn-svelte`  | CLI      | Component collection          |
| `tailwindcss`    | ^4.0.0   | Utility-first CSS             |
| `lucide-svelte`  | ^0.563.0 | Icon library                  |
| `clsx`           | ^2.0.0   | Conditional class names       |
| `tailwind-merge` | ^2.0.0   | Tailwind class merging        |

### Forms & Validation

| Package   | Version | Purpose           |
| :-------- | :------ | :---------------- |
| `valibot` | ^1.0.0  | Schema validation |

> **Note:** Forms use native HTML `<form>` elements with SvelteKit's built-in `form()` and `query()` functions from `$app/server`. This pattern uses **remote functions** for server-side validation and data mutations—no `+page.server.ts` actions needed.

### Authentication (Optional - for future cloud sync)

| Package       | Version | Purpose                    |
| :------------ | :------ | :------------------------- |
| `better-auth` | ^1.0.0  | Authentication (if needed) |

### PDF Generation

| Package   | Version | Purpose                 |
| :-------- | :------ | :---------------------- |
| `pdfmake` | ^0.2.10 | PDF document generation |

### Data Storage

| Package | Version | Purpose           |
| :------ | :------ | :---------------- |
| `dexie` | ^4.0.0  | IndexedDB wrapper |

### Date Handling

| Package                   | Version | Purpose                         |
| :------------------------ | :------ | :------------------------------ |
| `@internationalized/date` | ^3.5.0  | Date handling (shadcn calendar) |

### Development

| Package                       | Version | Purpose             |
| :---------------------------- | :------ | :------------------ |
| `typescript`                  | ^5.0.0  | Type safety         |
| `vite`                        | ^6.0.0  | Build tool          |
| `prettier`                    | ^3.0.0  | Code formatting     |
| `prettier-plugin-svelte`      | ^3.0.0  | Svelte formatting   |
| `prettier-plugin-tailwindcss` | ^0.6.0  | Tailwind formatting |

---

## Project Structure

```
tech-invoice-forge/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/                    # shadcn-svelte components
│   │   │   │   ├── button/
│   │   │   │   ├── input/
│   │   │   │   ├── select/
│   │   │   │   ├── textarea/
│   │   │   │   ├── card/
│   │   │   │   ├── dialog/
│   │   │   │   ├── popover/
│   │   │   │   ├── calendar/
│   │   │   │   ├── table/
│   │   │   │   ├── tabs/
│   │   │   │   ├── tooltip/
│   │   │   │   └── ...
│   │   │   ├── invoice/               # Invoice-specific components
│   │   │   │   ├── SenderForm.svelte
│   │   │   │   ├── ClientForm.svelte
│   │   │   │   ├── InvoiceDetails.svelte
│   │   │   │   ├── LineItems.svelte
│   │   │   │   ├── LineItemRow.svelte
│   │   │   │   ├── Totals.svelte
│   │   │   │   ├── Notes.svelte
│   │   │   │   └── InvoiceForm.svelte
│   │   │   ├── preview/               # PDF preview components
│   │   │   │   ├── PreviewPanel.svelte
│   │   │   │   ├── TemplateSelector.svelte
│   │   │   │   └── ActionButtons.svelte
│   │   │   ├── data/                  # Data management components
│   │   │   │   ├── ClientSelector.svelte
│   │   │   │   ├── ServiceSelector.svelte
│   │   │   │   ├── InvoiceHistory.svelte
│   │   │   │   └── ExportImport.svelte
│   │   │   └── layout/                # Layout components
│   │   │       ├── Header.svelte
│   │   │       ├── Footer.svelte
│   │   │       └── ThemeToggle.svelte
│   │   ├── stores/                    # Svelte 5 rune stores
│   │   │   ├── invoice.svelte.ts
│   │   │   ├── clients.svelte.ts
│   │   │   ├── services.svelte.ts
│   │   │   └── settings.svelte.ts
│   │   ├── db/                        # Database layer
│   │   │   ├── index.ts               # Dexie instance
│   │   │   ├── schema.ts              # Table definitions
│   │   │   ├── invoices.ts            # Invoice CRUD
│   │   │   ├── clients.ts             # Client CRUD
│   │   │   └── services.ts            # Service CRUD
│   │   ├── pdf/                       # PDF generation
│   │   │   ├── generator.ts           # Main PDF generator
│   │   │   ├── templates/
│   │   │   │   ├── classic.ts
│   │   │   │   ├── modern.ts
│   │   │   │   ├── tech.ts
│   │   │   │   └── compact.ts
│   │   │   ├── fonts.ts               # Font configuration
│   │   │   └── styles.ts              # Shared PDF styles
│   │   ├── utils/                     # Utility functions
│   │   │   ├── currency.ts            # Currency formatting
│   │   │   ├── date.ts                # Date formatting
│   │   │   ├── invoice-number.ts      # Number generation
│   │   │   ├── calculations.ts        # Totals, taxes
│   │   │   └── export-import.ts       # JSON backup
│   │   ├── schemas/                   # Validation schemas (Valibot)
│   │   │   ├── invoice.ts
│   │   │   ├── client.ts
│   │   │   ├── service.ts
│   │   │   └── settings.ts
│   │   ├── remote/                    # Remote functions (form/query)
│   │   │   ├── index.ts               # Re-export all remote functions
│   │   │   ├── invoice.remote.ts      # Invoice form handlers
│   │   │   ├── client.remote.ts       # Client CRUD forms
│   │   │   ├── service.remote.ts      # Service CRUD forms
│   │   │   └── settings.remote.ts     # Settings forms
│   │   └── constants/                 # App constants
│   │       ├── currencies.ts
│   │       ├── units.ts
│   │       ├── payment-terms.ts
│   │       └── templates.ts
│   ├── routes/
│   │   ├── +layout.svelte             # Root layout
│   │   ├── +page.svelte               # Main invoice page
│   │   ├── history/
│   │   │   └── +page.svelte           # Invoice history
│   │   ├── settings/
│   │   │   └── +page.svelte           # App settings
│   │   └── receipt/
│   │       └── +page.svelte           # Receipt mode
│   ├── app.html                       # HTML shell
│   ├── app.css                        # Global styles + Tailwind
│   └── app.d.ts                       # Type declarations
├── static/
│   ├── fonts/                         # Custom fonts for PDF
│   ├── favicon.ico
│   └── og-image.png
├── svelte.config.js
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## State Management

### Global State with Svelte 5 Runes

Using class-based stores with `$state` and `$derived` runes for reactive state management.

#### Invoice Store

```typescript
// src/lib/stores/invoice.svelte.ts
import type { Invoice, LineItem, Sender, Client, Discount } from '$lib/db/schema';

class InvoiceStore {
	// Current working invoice
	invoice = $state<Invoice>({
		id: undefined,
		number: '',
		type: 'invoice',
		status: 'draft',
		issueDate: new Date(),
		dueDate: null,
		currency: 'USD',
		lineItems: [],
		discount: { type: 'percentage', value: 0 },
		notes: '',
		terms: ''
	});

	// Sender info (persisted separately)
	sender = $state<Sender>({
		businessName: '',
		address: '',
		email: '',
		phone: '',
		taxId: '',
		logo: null
	});

	// Selected client
	client = $state<Client | null>(null);

	// Derived calculations
	subtotal = $derived.by(() => {
		return this.invoice.lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0);
	});

	taxTotal = $derived.by(() => {
		return this.invoice.lineItems.reduce(
			(sum, item) => sum + item.quantity * item.rate * (item.taxRate / 100),
			0
		);
	});

	discountAmount = $derived.by(() => {
		if (this.invoice.discount.type === 'percentage') {
			return this.subtotal * (this.invoice.discount.value / 100);
		}
		return this.invoice.discount.value;
	});

	total = $derived.by(() => {
		return this.subtotal + this.taxTotal - this.discountAmount;
	});

	// Actions
	addLineItem(item: Partial<LineItem> = {}) {
		this.invoice.lineItems = [
			...this.invoice.lineItems,
			{
				description: item.description ?? '',
				quantity: item.quantity ?? 1,
				unit: item.unit ?? 'unit',
				rate: item.rate ?? 0,
				taxRate: item.taxRate ?? 0
			}
		];
	}

	removeLineItem(index: number) {
		this.invoice.lineItems = this.invoice.lineItems.filter((_, i) => i !== index);
	}

	updateLineItem(index: number, updates: Partial<LineItem>) {
		this.invoice.lineItems = this.invoice.lineItems.map((item, i) =>
			i === index ? { ...item, ...updates } : item
		);
	}

	reset() {
		this.invoice = {
			id: undefined,
			number: '',
			type: 'invoice',
			status: 'draft',
			issueDate: new Date(),
			dueDate: null,
			currency: 'USD',
			lineItems: [],
			discount: { type: 'percentage', value: 0 },
			notes: '',
			terms: ''
		};
		this.client = null;
	}
}

export const invoiceStore = new InvoiceStore();
```

#### Settings Store

```typescript
// src/lib/stores/settings.svelte.ts
class SettingsStore {
	settings = $state({
		theme: 'dark' as 'light' | 'dark',
		defaultCurrency: 'USD',
		defaultTemplate: 'modern',
		invoicePrefix: 'INV',
		dateFormat: 'YYYY-MM-DD',
		taxRate: 0,
		paymentTerms: 'net30',
		lastInvoiceNumber: 0
	});

	// Persist to localStorage
	save() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('invoice-forge-settings', JSON.stringify(this.settings));
		}
	}

	load() {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('invoice-forge-settings');
			if (saved) {
				this.settings = { ...this.settings, ...JSON.parse(saved) };
			}
		}
	}
}

export const settingsStore = new SettingsStore();
```

---

## Remote Functions Layer

Remote functions use SvelteKit's built-in `form()` and `query()` from `$app/server` for server-side validation and data mutations. This pattern eliminates the need for `+page.server.ts` actions.

### Form Function Example

```typescript
// src/lib/remote/client.remote.ts
import { form, query, getRequestEvent } from '$app/server';
import * as v from 'valibot';
import { db } from '$lib/db';

// Validation schema
const createClientSchema = v.object({
	name: v.pipe(v.string(), v.nonEmpty('Name is required'), v.maxLength(100)),
	company: v.optional(v.pipe(v.string(), v.maxLength(100))),
	address: v.pipe(v.string(), v.nonEmpty('Address is required'), v.maxLength(500)),
	email: v.pipe(v.string(), v.email('Invalid email format'))
});

// Create client form handler
export const createClientForm = form(createClientSchema, async (data, issue) => {
	try {
		const id = await db.clients.add({
			...data,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		return { success: true, id };
	} catch (error: any) {
		issue(error.message || 'Failed to create client');
	}
});

// Update client form handler
const updateClientSchema = v.object({
	id: v.number(),
	name: v.pipe(v.string(), v.nonEmpty('Name is required')),
	company: v.optional(v.string()),
	address: v.pipe(v.string(), v.nonEmpty('Address is required')),
	email: v.pipe(v.string(), v.email('Invalid email format'))
});

export const updateClientForm = form(updateClientSchema, async (data, issue) => {
	const { id, ...updates } = data;

	try {
		await db.clients.update(id, {
			...updates,
			updatedAt: new Date()
		});

		return { success: true };
	} catch (error: any) {
		issue(error.message || 'Failed to update client');
	}
});
```

### Query Function Example

```typescript
// src/lib/remote/client.remote.ts (continued)

// Get all clients
export const getClients = query(async () => {
	return await db.clients.orderBy('name').toArray();
});

// Get single client by ID
export const getClient = query(async (id: number) => {
	return await db.clients.get(id);
});

// Search clients
export const searchClients = query(async (searchTerm: string) => {
	return await db.clients
		.filter(
			(client) =>
				client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				client.email.toLowerCase().includes(searchTerm.toLowerCase())
		)
		.toArray();
});
```

### Using Forms in Components

```html
<!-- src/routes/clients/+page.svelte -->
<script lang="ts">
  import { createClientForm, getClients } from '$lib/remote';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

  let isSubmitting = $state(false);
  let clients = $state<Client[]>([]);

  // Load clients on mount
  $effect(() => {
    getClients().then(data => clients = data);
  });
</script>

<Card>
  <CardHeader>
    <CardTitle>Add Client</CardTitle>
  </CardHeader>
  <CardContent>
    <form
      {...createClientForm.enhance(async ({ form, submit }) => {
        isSubmitting = true;
        await submit();
        isSubmitting = false;

        if (createClientForm.result?.success) {
          // Refresh client list
          clients = await getClients();
          form.reset();
        }
      })}
    >
      {#each createClientForm.fields.allIssues() as issue}
        <p class="text-sm text-destructive">{issue.message}</p>
      {/each}

      <div class="grid gap-4">
        <div class="grid gap-2">
          <label for="name">Name *</label>
          <Input id="name" {...createClientForm.fields.name.as('text')} />
          {#each createClientForm.fields.name.issues() as issue}
            <p class="text-sm text-destructive">{issue.message}</p>
          {/each}
        </div>

        <div class="grid gap-2">
          <label for="email">Email *</label>
          <Input id="email" type="email" {...createClientForm.fields.email.as('email')} />
          {#each createClientForm.fields.email.issues() as issue}
            <p class="text-sm text-destructive">{issue.message}</p>
          {/each}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Add Client'}
        </Button>
      </div>
    </form>
  </CardContent>
</Card>
```

### Re-export Pattern

```typescript
// src/lib/remote/index.ts
export * from './client.remote';
export * from './invoice.remote';
export * from './service.remote';
export * from './settings.remote';
```

---

## Database Layer

### Dexie.js Configuration

```typescript
// src/lib/db/index.ts
import Dexie, { type Table } from 'dexie';
import type { Sender, Client, ServiceItem, Invoice } from './schema';

class InvoiceForgeDB extends Dexie {
	senders!: Table<Sender>;
	clients!: Table<Client>;
	services!: Table<ServiceItem>;
	invoices!: Table<Invoice>;

	constructor() {
		super('InvoiceForgeDB');

		this.version(1).stores({
			senders: '++id, businessName, isDefault',
			clients: '++id, name, company, email, createdAt',
			services: '++id, name, category, createdAt',
			invoices: '++id, number, type, status, clientId, issueDate, createdAt'
		});
	}
}

export const db = new InvoiceForgeDB();

// Initialize with error handling
db.open().catch((err) => {
	console.error('Failed to open database:', err);
});
```

### CRUD Operations

```typescript
// src/lib/db/invoices.ts
import { db } from './index';
import type { Invoice } from './schema';

export async function createInvoice(
	invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>
): Promise<number> {
	const now = new Date();
	return await db.invoices.add({
		...invoice,
		createdAt: now,
		updatedAt: now
	});
}

export async function getInvoice(id: number): Promise<Invoice | undefined> {
	return await db.invoices.get(id);
}

export async function updateInvoice(id: number, updates: Partial<Invoice>): Promise<number> {
	return await db.invoices.update(id, {
		...updates,
		updatedAt: new Date()
	});
}

export async function deleteInvoice(id: number): Promise<void> {
	await db.invoices.delete(id);
}

export async function getAllInvoices(): Promise<Invoice[]> {
	return await db.invoices.orderBy('createdAt').reverse().toArray();
}

export async function getInvoicesByStatus(status: Invoice['status']): Promise<Invoice[]> {
	return await db.invoices.where('status').equals(status).toArray();
}

export async function getLastInvoiceNumber(year: number): Promise<string | null> {
	const startOfYear = new Date(year, 0, 1);
	const endOfYear = new Date(year, 11, 31, 23, 59, 59);

	const invoice = await db.invoices.where('issueDate').between(startOfYear, endOfYear).last();

	return invoice?.number ?? null;
}
```

---

## PDF Generation Architecture

### Template System

Each template is a function that returns a pdfmake document definition:

```typescript
// src/lib/pdf/templates/modern.ts
import type { Invoice, Sender, Client } from '$lib/db/schema';
import { formatCurrency } from '$lib/utils/currency';
import { formatDate } from '$lib/utils/date';
import { pdfStyles } from '../styles';

interface TemplateContext {
	invoice: Invoice;
	sender: Sender;
	client: Client;
	subtotal: number;
	taxTotal: number;
	discountAmount: number;
	total: number;
}

export function modernTemplate(ctx: TemplateContext) {
	const { invoice, sender, client, subtotal, taxTotal, discountAmount, total } = ctx;

	return {
		pageSize: 'A4' as const,
		pageMargins: [40, 60, 40, 60] as [number, number, number, number],
		defaultStyle: {
			font: 'Helvetica',
			fontSize: 10,
			color: '#334155'
		},
		content: [
			// Header
			{
				columns: [
					sender.logo
						? { image: sender.logo, width: 100 }
						: { text: sender.businessName, style: 'businessName' },
					{
						stack: [
							{ text: 'INVOICE', style: 'documentTitle' },
							{ text: invoice.number, style: 'invoiceNumber' }
						],
						alignment: 'right'
					}
				],
				margin: [0, 0, 0, 30]
			},

			// From / To
			{
				columns: [
					{
						width: '50%',
						stack: [
							{ text: 'FROM', style: 'sectionLabel' },
							{ text: sender.businessName, style: 'bold' },
							{ text: sender.address },
							{ text: sender.email, style: 'link' },
							sender.phone ? { text: sender.phone } : null,
							sender.taxId ? { text: `Tax ID: ${sender.taxId}` } : null
						].filter(Boolean)
					},
					{
						width: '50%',
						stack: [
							{ text: 'BILL TO', style: 'sectionLabel' },
							{ text: client.name, style: 'bold' },
							client.company ? { text: client.company } : null,
							{ text: client.address },
							{ text: client.email, style: 'link' }
						].filter(Boolean)
					}
				],
				margin: [0, 0, 0, 30]
			},

			// Invoice meta
			{
				columns: [
					{ text: `Issue Date: ${formatDate(invoice.issueDate)}` },
					invoice.dueDate ? { text: `Due Date: ${formatDate(invoice.dueDate)}` } : {},
					{ text: `Currency: ${invoice.currency}`, alignment: 'right' }
				],
				margin: [0, 0, 0, 20],
				style: 'meta'
			},

			// Line items table
			{
				table: {
					headerRows: 1,
					widths: ['*', 50, 50, 70, 45, 80],
					body: [
						[
							{ text: 'Description', style: 'tableHeader' },
							{ text: 'Qty', style: 'tableHeader' },
							{ text: 'Unit', style: 'tableHeader' },
							{ text: 'Rate', style: 'tableHeader' },
							{ text: 'Tax', style: 'tableHeader' },
							{ text: 'Amount', style: 'tableHeader', alignment: 'right' }
						],
						...invoice.lineItems.map((item) => [
							item.description,
							item.quantity.toString(),
							item.unit,
							formatCurrency(item.rate, invoice.currency),
							`${item.taxRate}%`,
							{
								text: formatCurrency(item.quantity * item.rate, invoice.currency),
								alignment: 'right'
							}
						])
					]
				},
				layout: {
					hLineWidth: (i: number, node: any) =>
						i === 0 || i === 1 || i === node.table.body.length ? 1 : 0,
					vLineWidth: () => 0,
					hLineColor: () => '#E2E8F0',
					paddingTop: () => 8,
					paddingBottom: () => 8
				}
			},

			// Totals
			{
				columns: [
					{ width: '*', text: '' },
					{
						width: 200,
						stack: [
							{
								columns: [
									{ text: 'Subtotal', width: '*' },
									{
										text: formatCurrency(subtotal, invoice.currency),
										alignment: 'right'
									}
								]
							},
							taxTotal > 0
								? {
										columns: [
											{ text: 'Tax', width: '*' },
											{
												text: formatCurrency(taxTotal, invoice.currency),
												alignment: 'right'
											}
										]
									}
								: null,
							discountAmount > 0
								? {
										columns: [
											{ text: 'Discount', width: '*' },
											{
												text: `-${formatCurrency(discountAmount, invoice.currency)}`,
												alignment: 'right'
											}
										]
									}
								: null,
							{
								canvas: [
									{
										type: 'line',
										x1: 0,
										y1: 5,
										x2: 200,
										y2: 5,
										lineWidth: 1,
										lineColor: '#E2E8F0'
									}
								]
							},
							{
								columns: [
									{ text: 'Total Due', width: '*', style: 'bold' },
									{
										text: formatCurrency(total, invoice.currency),
										alignment: 'right',
										style: 'totalAmount'
									}
								],
								margin: [0, 5, 0, 0]
							}
						].filter(Boolean)
					}
				],
				margin: [0, 20, 0, 30]
			},

			// Notes
			invoice.notes
				? {
						stack: [{ text: 'Notes', style: 'sectionLabel' }, { text: invoice.notes }],
						margin: [0, 0, 0, 15]
					}
				: null,

			// Terms
			invoice.terms
				? {
						stack: [
							{ text: 'Terms & Conditions', style: 'sectionLabel' },
							{ text: invoice.terms, style: 'small' }
						]
					}
				: null
		].filter(Boolean),

		styles: pdfStyles
	};
}
```

### Generator Function

```typescript
// src/lib/pdf/generator.ts
import pdfMake from 'pdfmake/build/pdfmake';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { classicTemplate } from './templates/classic';
import { modernTemplate } from './templates/modern';
import { techTemplate } from './templates/tech';
import { compactTemplate } from './templates/compact';
import type { Invoice, Sender, Client } from '$lib/db/schema';

// Dynamically import fonts to optimize bundle
let fontsLoaded = false;
async function loadFonts() {
	if (fontsLoaded) return;
	const pdfFonts = await import('pdfmake/build/vfs_fonts');
	pdfMake.vfs = pdfFonts.pdfMake.vfs;
	fontsLoaded = true;
}

const templates = {
	classic: classicTemplate,
	modern: modernTemplate,
	tech: techTemplate,
	compact: compactTemplate
} as const;

type TemplateName = keyof typeof templates;

interface GenerateOptions {
	invoice: Invoice;
	sender: Sender;
	client: Client;
	template?: TemplateName;
	calculations: {
		subtotal: number;
		taxTotal: number;
		discountAmount: number;
		total: number;
	};
}

export async function generatePDF(options: GenerateOptions): Promise<void> {
	await loadFonts();

	const { invoice, sender, client, template = 'modern', calculations } = options;
	const templateFn = templates[template];

	const docDefinition = templateFn({
		invoice,
		sender,
		client,
		...calculations
	}) as TDocumentDefinitions;

	pdfMake.createPdf(docDefinition).download(`${invoice.number}.pdf`);
}

export async function previewPDF(options: GenerateOptions): Promise<Blob> {
	await loadFonts();

	const { invoice, sender, client, template = 'modern', calculations } = options;
	const templateFn = templates[template];

	const docDefinition = templateFn({
		invoice,
		sender,
		client,
		...calculations
	}) as TDocumentDefinitions;

	return new Promise((resolve, reject) => {
		pdfMake.createPdf(docDefinition).getBlob((blob) => {
			resolve(blob);
		});
	});
}
```

---

## Build Configuration

### SvelteKit Config

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: true
		}),
		alias: {
			$components: 'src/lib/components',
			$stores: 'src/lib/stores',
			$db: 'src/lib/db',
			$pdf: 'src/lib/pdf',
			$utils: 'src/lib/utils',
			$schemas: 'src/lib/schemas',
			$constants: 'src/lib/constants'
		}
	}
};

export default config;
```

### Vite Config

```typescript
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['pdfmake/build/pdfmake', 'pdfmake/build/vfs_fonts']
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					pdfmake: ['pdfmake/build/pdfmake', 'pdfmake/build/vfs_fonts']
				}
			}
		}
	}
});
```

### Tailwind Config

```javascript
// tailwind.config.js
import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		extend: {
			colors: {
				// Brand colors - NO GRADIENTS
				brand: {
					primary: '#4F46E5', // Indigo
					secondary: '#10B981', // Emerald
					accent: '#F59E0B' // Amber
				},
				// Surface colors
				surface: {
					base: '#0F172A', // Slate-900
					elevated: '#1E293B', // Slate-800
					overlay: '#334155' // Slate-700
				},
				// Semantic colors
				success: '#10B981',
				warning: '#F59E0B',
				error: '#EF4444',
				info: '#3B82F6'
			},
			fontFamily: {
				sans: ['Inter Variable', ...fontFamily.sans],
				mono: ['JetBrains Mono Variable', ...fontFamily.mono]
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require('tailwindcss-animate')]
};

export default config;
```

---

## Related Documents

- [Master Plan](./master-plan.md) - Full project overview
- [Features](./features.md) - Feature specifications
- [Data Models](./data-models.md) - Schema details
- [Dependencies](./dependencies.md) - NPM packages
- [UI/UX Design](./ui-ux.md) - Component design

---

## Deployment

### Static Hosting Options

Since this is a static site, it can be deployed to any static hosting:

| Platform             | Command                 | Notes                    |
| :------------------- | :---------------------- | :----------------------- |
| **Vercel**           | `vercel`                | Zero config, recommended |
| **Netlify**          | `netlify deploy`        | Great free tier          |
| **Cloudflare Pages** | `wrangler pages deploy` | Fast global CDN          |
| **GitHub Pages**     | GitHub Actions          | Free for public repos    |

### Build Command

```bash
bun run build
```

Outputs to `build/` directory.
