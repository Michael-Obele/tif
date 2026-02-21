# Tech Invoice Forge - PDF Templates

[← Back to Index](./index.md) | [Master Plan](./master-plan.md) | [UI/UX Design](./ui-ux.md)

---

## Template Overview

Tech Invoice Forge offers four professionally designed invoice templates. Each template is implemented as a pdfmake document definition function.

---

## Template Comparison

| Template    | Style          | Best For          | Character                  |
| :---------- | :------------- | :---------------- | :------------------------- |
| **Modern**  | Clean, minimal | General use       | Contemporary, professional |
| **Classic** | Traditional    | Corporate clients | Formal, established        |
| **Tech**    | Code-inspired  | Developer clients | Technical, distinctive     |
| **Compact** | Dense layout   | Many line items   | Efficient, detailed        |

---

## 1. Modern Template (Default)

### Description

Clean, contemporary design with generous whitespace and subtle typography hierarchy.

### Visual Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [LOGO]                                              INVOICE    │
│  Acme Development LLC                               INV-2026-001│
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FROM                              BILL TO                      │
│  Acme Development LLC              John Smith                   │
│  123 Tech Lane                     TechStartup Inc              │
│  San Francisco, CA 94105           456 Innovation Blvd          │
│  billing@acmedev.com               New York, NY 10001           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Issue Date: Feb 1, 2026    Due Date: Mar 3, 2026    USD        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Description                   Qty  Unit  Rate    Tax   Amount  │
│  ─────────────────────────────────────────────────────────────  │
│  Frontend Development          40   hour  $75.00  10%  $3,000   │
│  API Integration                8   hour  $85.00  10%    $680   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                           Subtotal    $3,680.00 │
│                                           Tax          $368.00  │
│                                           Discount     -$50.00  │
│                                           ─────────────────────  │
│                                           Total Due   $3,998.00 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Notes                                                          │
│  Thank you for your business!                                   │
│                                                                 │
│  Terms & Conditions                                             │
│  Payment due within 30 days. Late fees may apply.               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Design Characteristics

- **Font**: Helvetica (PDF standard)
- **Header**: Logo left, Invoice title right
- **Colors**: Minimal - Indigo (#4F46E5) for title only
- **Tables**: Borderless with subtle header underline
- **Spacing**: 20-30pt between sections

### Implementation

```typescript
// $lib/pdf/templates/modern.ts
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { TemplateContext } from '../types';
import { formatCurrency, formatDate } from '$lib/utils';

export function modernTemplate(ctx: TemplateContext): TDocumentDefinitions {
	const { invoice, sender, client, subtotal, taxTotal, discountAmount, total } = ctx;

	return {
		pageSize: 'A4',
		pageMargins: [40, 50, 40, 50],
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
							{ text: 'INVOICE', style: 'title' },
							{ text: invoice.number, style: 'invoiceNumber' }
						],
						alignment: 'right'
					}
				],
				margin: [0, 0, 0, 30]
			},

			// From / Bill To
			{
				columns: [
					{
						width: '50%',
						stack: [
							{ text: 'FROM', style: 'label' },
							{ text: sender.businessName, style: 'bold', margin: [0, 5, 0, 0] },
							{ text: sender.address, margin: [0, 3, 0, 0] },
							{ text: sender.email, style: 'link', margin: [0, 3, 0, 0] },
							sender.phone ? { text: sender.phone, margin: [0, 3, 0, 0] } : {},
							sender.taxId ? { text: `Tax ID: ${sender.taxId}`, margin: [0, 3, 0, 0] } : {}
						]
					},
					{
						width: '50%',
						stack: [
							{ text: 'BILL TO', style: 'label' },
							{ text: client.name, style: 'bold', margin: [0, 5, 0, 0] },
							client.company ? { text: client.company, margin: [0, 3, 0, 0] } : {},
							{ text: client.address, margin: [0, 3, 0, 0] },
							{ text: client.email, style: 'link', margin: [0, 3, 0, 0] }
						]
					}
				],
				margin: [0, 0, 0, 25]
			},

			// Invoice details row
			{
				columns: [
					{ text: `Issue Date: ${formatDate(invoice.issueDate)}`, width: 'auto' },
					invoice.dueDate
						? {
								text: `Due Date: ${formatDate(invoice.dueDate)}`,
								width: 'auto',
								margin: [20, 0, 0, 0]
							}
						: {},
					{ text: invoice.currency, alignment: 'right' }
				],
				style: 'meta',
				margin: [0, 0, 0, 20]
			},

			// Line items table
			{
				table: {
					headerRows: 1,
					widths: ['*', 45, 45, 60, 40, 70],
					body: [
						[
							{ text: 'Description', style: 'tableHeader' },
							{ text: 'Qty', style: 'tableHeader', alignment: 'center' },
							{ text: 'Unit', style: 'tableHeader', alignment: 'center' },
							{ text: 'Rate', style: 'tableHeader', alignment: 'right' },
							{ text: 'Tax', style: 'tableHeader', alignment: 'center' },
							{ text: 'Amount', style: 'tableHeader', alignment: 'right' }
						],
						...invoice.lineItems.map((item) => [
							item.description,
							{ text: item.quantity.toString(), alignment: 'center' },
							{ text: item.unit, alignment: 'center' },
							{ text: formatCurrency(item.rate, invoice.currency), alignment: 'right' },
							{ text: `${item.taxRate}%`, alignment: 'center' },
							{
								text: formatCurrency(item.quantity * item.rate, invoice.currency),
								alignment: 'right'
							}
						])
					]
				},
				layout: {
					hLineWidth: (i, node) => (i === 1 ? 0.5 : 0),
					vLineWidth: () => 0,
					hLineColor: () => '#CBD5E1',
					paddingTop: () => 8,
					paddingBottom: () => 8
				}
			},

			// Totals
			{
				columns: [
					{ width: '*', text: '' },
					{
						width: 180,
						stack: [
							{
								columns: [
									{ text: 'Subtotal', width: '*' },
									{ text: formatCurrency(subtotal, invoice.currency), alignment: 'right' }
								],
								margin: [0, 0, 0, 5]
							},
							taxTotal > 0
								? {
										columns: [
											{ text: 'Tax', width: '*' },
											{ text: formatCurrency(taxTotal, invoice.currency), alignment: 'right' }
										],
										margin: [0, 0, 0, 5]
									}
								: {},
							discountAmount > 0
								? {
										columns: [
											{ text: 'Discount', width: '*' },
											{
												text: `-${formatCurrency(discountAmount, invoice.currency)}`,
												alignment: 'right',
												color: '#10B981'
											}
										],
										margin: [0, 0, 0, 5]
									}
								: {},
							{
								canvas: [
									{
										type: 'line',
										x1: 0,
										y1: 0,
										x2: 180,
										y2: 0,
										lineWidth: 0.5,
										lineColor: '#CBD5E1'
									}
								],
								margin: [0, 5, 0, 5]
							},
							{
								columns: [
									{ text: 'Total Due', width: '*', style: 'bold', fontSize: 12 },
									{
										text: formatCurrency(total, invoice.currency),
										alignment: 'right',
										style: 'bold',
										fontSize: 12
									}
								]
							}
						]
					}
				],
				margin: [0, 25, 0, 30]
			},

			// Notes
			invoice.notes
				? {
						stack: [
							{ text: 'Notes', style: 'label' },
							{ text: invoice.notes, margin: [0, 5, 0, 0] }
						],
						margin: [0, 0, 0, 15]
					}
				: {},

			// Terms
			invoice.terms
				? {
						stack: [
							{ text: 'Terms & Conditions', style: 'label' },
							{ text: invoice.terms, fontSize: 8, color: '#64748B', margin: [0, 5, 0, 0] }
						]
					}
				: {}
		],

		styles: {
			title: { fontSize: 28, bold: true, color: '#4F46E5' },
			invoiceNumber: { fontSize: 12, color: '#64748B' },
			businessName: { fontSize: 18, bold: true },
			label: { fontSize: 9, color: '#94A3B8', characterSpacing: 1 },
			bold: { bold: true },
			link: { color: '#4F46E5' },
			meta: { fontSize: 9, color: '#64748B' },
			tableHeader: { fontSize: 9, bold: true, color: '#64748B' }
		}
	};
}
```

---

## 2. Classic Template

### Description

Traditional, formal design with boxed sections and visible borders.

### Visual Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                          INVOICE                                │
│                       INV-2026-001                              │
│                                                                 │
├─────────────────────────────┬───────────────────────────────────┤
│ FROM:                       │ TO:                               │
│                             │                                   │
│ Acme Development LLC        │ John Smith                        │
│ 123 Tech Lane               │ TechStartup Inc                   │
│ San Francisco, CA 94105     │ 456 Innovation Blvd               │
│ billing@acmedev.com         │ New York, NY 10001                │
├─────────────────────────────┴───────────────────────────────────┤
│ Invoice #: INV-2026-001  Issue: Feb 1, 2026  Due: Mar 3, 2026  │
├─────────────────────────────────────────────────────────────────┤
│ Description              │ Qty │ Unit │ Rate    │ Tax │ Amount │
├─────────────────────────────────────────────────────────────────┤
│ Frontend Development     │ 40  │ hour │ $75.00  │ 10% │ $3,000 │
├─────────────────────────────────────────────────────────────────┤
│ API Integration          │  8  │ hour │ $85.00  │ 10% │   $680 │
├─────────────────────────────────────────────────────────────────┤
│                                            SUBTOTAL   $3,680.00 │
│                                            TAX          $368.00 │
│                                            DISCOUNT     -$50.00 │
│                                            ─────────────────────│
│                                            TOTAL DUE  $3,998.00 │
└─────────────────────────────────────────────────────────────────┘
│                                                                 │
│ Notes: Thank you for your business!                             │
│ Terms: Payment due within 30 days.                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Design Characteristics

- **Font**: Times New Roman or Helvetica
- **Header**: Centered title
- **Colors**: Minimal - Black and gray only
- **Tables**: Full borders, visible grid
- **Spacing**: Compact, formal

---

## 3. Tech Template

### Description

Developer-focused design with monospace elements and code-inspired aesthetics.

### Visual Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓ ACME DEV                               INVOICE: INV-2026-001 ▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ // Sender                      // Client                        │
│ businessName: "Acme Dev"       name: "John Smith"               │
│ address: "123 Tech Lane"       company: "TechStartup"           │
│ email: "dev@acme.io"           email: "john@startup.io"         │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│ issue_date: 2026-02-01                                          │
│ due_date: 2026-03-03                                            │
│ currency: USD                                                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ # | Description                    | Qty | Rate    | Amount    │
│ ──┼────────────────────────────────┼─────┼─────────┼───────────│
│ 1 | Frontend Development           |  40 | $75.00  | $3,000.00 │
│ 2 | API Integration                |   8 | $85.00  |   $680.00 │
│ ──┴────────────────────────────────┴─────┴─────────┴───────────│
│                                                                 │
│                                     subtotal = $3,680.00        │
│                                     tax      = $368.00          │
│                                     discount = -$50.00          │
│                                     ──────────────────          │
│                                     total    = $3,998.00        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Design Characteristics

- **Font**: JetBrains Mono or Courier
- **Header**: Dark bar with inverse text
- **Colors**: Dark header, monospace numbers
- **Tables**: ASCII-style borders
- **Spacing**: Code-like alignment

---

## 4. Compact Template

### Description

Dense layout maximizing information per page, ideal for detailed invoices.

### Visual Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Acme Development LLC            INVOICE: INV-2026-001           │
│ 123 Tech Lane, SF, CA 94105     Date: Feb 1, 2026 | Due: Mar 3  │
│ billing@acmedev.com             Currency: USD                   │
├─────────────────────────────────────────────────────────────────┤
│ Bill To: John Smith, TechStartup Inc                            │
│ 456 Innovation Blvd, New York, NY 10001 | john@startup.com      │
├─────────────────────────────────────────────────────────────────┤
│ Description                         Qty  Unit  Rate   Tax  Amt  │
│ Frontend Development                 40  hour  $75   10% $3000  │
│ API Integration                       8  hour  $85   10%  $680  │
│ Database Design                       5  hour  $90   10%  $450  │
│ Code Review                          10  hour  $70   10%  $700  │
│ Documentation                         8  hour  $60   10%  $480  │
│ Testing & QA                         12  hour  $65   10%  $780  │
├─────────────────────────────────────────────────────────────────┤
│                          Subtotal: $6,090 | Tax: $609 | -$100   │
│                                               TOTAL: $6,599.00  │
├─────────────────────────────────────────────────────────────────┤
│ Notes: Thank you! | Terms: Net 30, 1.5% late fee               │
└─────────────────────────────────────────────────────────────────┘
```

### Design Characteristics

- **Font**: 8-9pt for density
- **Header**: Minimal, inline
- **Colors**: None or minimal
- **Tables**: Condensed, abbreviated headers
- **Spacing**: Minimal margins

---

## Template Type Definition

```typescript
// $lib/pdf/types.ts

export interface TemplateContext {
	invoice: Invoice;
	sender: Sender;
	client: Client;
	subtotal: number;
	taxTotal: number;
	discountAmount: number;
	total: number;
}

export type TemplateGenerator = (ctx: TemplateContext) => TDocumentDefinitions;

export interface TemplateInfo {
	id: string;
	name: string;
	description: string;
	preview: string; // Path to preview image
}

export const TEMPLATES: TemplateInfo[] = [
	{
		id: 'modern',
		name: 'Modern',
		description: 'Clean, minimal design with subtle typography',
		preview: '/templates/modern-preview.png'
	},
	{
		id: 'classic',
		name: 'Classic',
		description: 'Traditional formal layout with borders',
		preview: '/templates/classic-preview.png'
	},
	{
		id: 'tech',
		name: 'Tech',
		description: 'Developer-focused with monospace elements',
		preview: '/templates/tech-preview.png'
	},
	{
		id: 'compact',
		name: 'Compact',
		description: 'Dense layout for detailed invoices',
		preview: '/templates/compact-preview.png'
	}
];
```

---

## PDF Shared Styles

```typescript
// $lib/pdf/styles.ts

export const pdfStyles = {
	// Titles
	title: {
		fontSize: 28,
		bold: true,
		color: '#4F46E5'
	},
	subtitle: {
		fontSize: 18,
		bold: true,
		color: '#334155'
	},

	// Text
	bold: {
		bold: true
	},
	link: {
		color: '#4F46E5'
	},
	muted: {
		color: '#64748B',
		fontSize: 9
	},

	// Labels
	label: {
		fontSize: 9,
		color: '#94A3B8',
		characterSpacing: 1
	},

	// Table
	tableHeader: {
		fontSize: 9,
		bold: true,
		color: '#64748B',
		fillColor: '#F8FAFC'
	},

	// Status
	success: {
		color: '#10B981'
	},
	warning: {
		color: '#F59E0B'
	},
	error: {
		color: '#EF4444'
	}
};

// Table layouts
export const tableLayouts = {
	modern: {
		hLineWidth: (i: number, node: any) => (i === 1 ? 0.5 : 0),
		vLineWidth: () => 0,
		hLineColor: () => '#E2E8F0',
		paddingTop: () => 8,
		paddingBottom: () => 8
	},
	classic: {
		hLineWidth: () => 0.5,
		vLineWidth: () => 0.5,
		hLineColor: () => '#94A3B8',
		vLineColor: () => '#94A3B8',
		paddingTop: () => 5,
		paddingBottom: () => 5
	},
	bordered: {
		hLineWidth: () => 1,
		vLineWidth: () => 1,
		hLineColor: () => '#334155',
		vLineColor: () => '#334155',
		paddingTop: () => 6,
		paddingBottom: () => 6
	}
};
```

---

## Receipt Template Variation

Receipts use a simplified version of the invoice templates:

### Key Differences

| Aspect          | Invoice | Receipt       |
| :-------------- | :------ | :------------ |
| Title           | INVOICE | RECEIPT       |
| Number prefix   | INV     | REC           |
| Due date        | Shown   | Hidden        |
| Paid date       | Hidden  | Shown         |
| Payment method  | Hidden  | Shown         |
| Transaction ref | Hidden  | Shown         |
| "Total Due"     | Yes     | "Amount Paid" |

### Receipt-Specific Elements

```typescript
// Additional fields for receipt
{
  columns: [
    { text: `Paid Date: ${formatDate(invoice.paidDate)}` },
    { text: `Payment Method: ${invoice.paymentMethod}` },
    invoice.transactionRef
      ? { text: `Reference: ${invoice.transactionRef}` }
      : {}
  ]
}

// Total section
{
  columns: [
    { text: 'Amount Paid', style: 'bold' },
    { text: formatCurrency(total, currency), style: 'bold' }
  ]
}

// Status badge (optional)
{
  text: '✓ PAID',
  style: { color: '#10B981', bold: true },
  alignment: 'right'
}
```

---

## Custom Font Support (Future)

For custom fonts in pdfmake:

```typescript
// $lib/pdf/fonts.ts
import pdfMake from 'pdfmake/build/pdfmake';

// Convert font files to base64 and add to VFS
const fonts = {
	Inter: {
		normal: 'Inter-Regular.ttf',
		bold: 'Inter-Bold.ttf',
		italics: 'Inter-Italic.ttf',
		bolditalics: 'Inter-BoldItalic.ttf'
	},
	JetBrainsMono: {
		normal: 'JetBrainsMono-Regular.ttf',
		bold: 'JetBrainsMono-Bold.ttf'
	}
};

pdfMake.fonts = fonts;
```

---

## Related Documents

- [UI/UX Design](./ui-ux.md) - App design system
- [Branding](./branding.md) - Colors and typography
- [Architecture](./architecture.md) - PDF generation setup
