import type { TemplateContext, TemplateDefinition } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { parseMarkdown } from '../markdown';

const EMERALD_600 = '#059669';
const EMERALD_500 = '#10b981';
const SLATE_900 = '#0f172a';
const MUTED = '#64748b';

export const techTemplate: TemplateDefinition = {
	id: 'tech',
	name: 'Tech',
	description: 'Developer-focused design with monospaced aesthetics and dashed lines.',
	generate: (ctx: TemplateContext) => {
		const { invoice, totals } = ctx;
		const { currency, senderData, clientSnapshot, lineItems } = invoice;

		const tableBody: any[][] = [
			[
				{ text: '// DESCRIPTION', style: 'tableHeader' },
				{ text: '// QTY', style: 'tableHeader', alignment: 'center' },
				{ text: '// RATE', style: 'tableHeader', alignment: 'right' },
				{ text: '// AMT', style: 'tableHeader', alignment: 'right' }
			]
		];

		lineItems.forEach((item) => {
			const amount = item.quantity * item.rate;
			tableBody.push([
				{ text: item.description || 'Service', margin: [0, 3, 0, 3] },
				{ text: String(item.quantity), alignment: 'center', margin: [0, 3, 0, 3] },
				{ text: formatCurrency(item.rate, currency), alignment: 'right', margin: [0, 3, 0, 3] },
				{ text: formatCurrency(amount, currency), alignment: 'right', margin: [0, 3, 0, 3] }
			]);
		});

		const totalsStack: any[] = [
			{
				columns: [
					{ text: 'Subtotal', color: MUTED },
					{ text: formatCurrency(totals.subtotal, currency), alignment: 'right' }
				],
				margin: [0, 3, 0, 3]
			}
		];

		if (totals.taxTotal > 0) {
			totalsStack.push({
				columns: [
					{ text: 'Tax', color: MUTED },
					{ text: formatCurrency(totals.taxTotal, currency), alignment: 'right' }
				],
				margin: [0, 3, 0, 3]
			});
		}

		if (totals.discountAmount > 0) {
			totalsStack.push({
				columns: [
					{ text: 'Discount', color: EMERALD_600 },
					{
						text: `-${formatCurrency(totals.discountAmount, currency)}`,
						alignment: 'right',
						color: EMERALD_600
					}
				],
				margin: [0, 3, 0, 3]
			});
		}

		totalsStack.push(
			{
				canvas: [
					{
						type: 'line',
						x1: 0,
						y1: 0,
						x2: 200,
						y2: 0,
						lineWidth: 1.5,
						lineColor: EMERALD_500,
						dash: { length: 4 }
					}
				],
				margin: [0, 12, 0, 12]
			},
			{
				columns: [
					{ text: 'Total Due', bold: true, fontSize: 11 },
					{
						text: formatCurrency(totals.total, currency),
						alignment: 'right',
						bold: true,
						fontSize: 14,
						color: EMERALD_500
					}
				],
				margin: [0, 0, 0, 0]
			}
		);

		return {
			content: [
				// Header with Logo and Invoice Number
				{
					columns: [
						{
							width: 'auto',
							stack: [
								invoice.senderData?.logo
									? {
											image: invoice.senderData.logo,
											width: 80,
											margin: [0, 0, 0, 10]
										}
									: {},
								{
									text: 'INVOICE',
									fontSize: 9,
									color: MUTED,
									characterSpacing: 2,
									margin: [0, 0, 0, 6]
								},
								{ text: invoice.number || 'INV-001', fontSize: 26, bold: true, color: SLATE_900 }
							]
						}
					],
					margin: [0, 0, 0, 10]
				},

				// Sender & Client Info (Columns) - Better spacing
				{
					columns: [
						{
							width: '50%',
							stack: [
								{ text: '// FROM', style: 'label' },
								{
									text: senderData?.businessName || 'Your Business',
									style: 'valueBold',
									margin: [0, 6, 0, 0]
								},
								{
									text: senderData?.address || '',
									style: 'value',
									margin: [0, 8, 0, 0],
									lineHeight: 1.4
								},
								{ text: senderData?.email || '', style: 'value', margin: [0, 2, 0, 0] },
								{ text: senderData?.phone || '', style: 'value' },
								{
									text: senderData?.taxId ? `Tax ID: ${senderData.taxId}` : '',
									style: 'value',
									color: MUTED,
									fontSize: 8,
									margin: [0, 2, 0, 0]
								}
							]
						},
						{
							width: '50%',
							stack: [
								{ text: '// BILL TO', style: 'label' },
								{
									text: clientSnapshot?.name || 'Client Name',
									style: 'valueBold',
									margin: [0, 6, 0, 0]
								},
								{ text: clientSnapshot?.company || '', style: 'value', margin: [0, 2, 0, 0] },
								{
									text: clientSnapshot?.address || '',
									style: 'value',
									margin: [0, 8, 0, 0],
									lineHeight: 1.4
								},
								{ text: clientSnapshot?.email || '', style: 'value', margin: [0, 2, 0, 0] },
								{
									text: clientSnapshot?.taxId ? `Tax ID: ${clientSnapshot.taxId}` : '',
									style: 'value',
									color: MUTED,
									fontSize: 8,
									margin: [0, 2, 0, 0]
								}
							]
						}
					],
					margin: [0, 0, 0, 10]
				},

				// Dates Box (Dashed Borders) - Better spacing
				{
					table: {
						widths: ['*', '*', '*', '*'],
						body: [
							[
								{
									stack: [
										{ text: 'ISSUE DATE', style: 'subLabel' },
										{ text: formatDate(invoice.issueDate), style: 'value', margin: [0, 6, 0, 0] }
									]
								},
								{
									stack: [
										{ text: 'DUE DATE', style: 'subLabel' },
										{ text: formatDate(invoice.dueDate), style: 'value', margin: [0, 6, 0, 0] }
									]
								},
								{
									stack: [
										{ text: 'CURRENCY', style: 'subLabel' },
										{ text: invoice.currency, style: 'value', margin: [0, 6, 0, 0] }
									]
								},
								{
									stack: [
										{ text: 'TAX ID', style: 'subLabel' },
										{ text: senderData?.taxId || '-', style: 'value', margin: [0, 6, 0, 0] }
									]
								}
							]
						]
					},
					layout: {
						hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0),
						vLineWidth: () => 0,
						hLineColor: () => EMERALD_500,
						hLineStyle: () => ({ dash: { length: 4 } }),
						paddingTop: () => 5,
						paddingBottom: () => 5,
						paddingLeft: () => 8,
						paddingRight: () => 8
					},
					margin: [0, 0, 0, 10]
				},

				// Line Items
				{
					table: {
						headerRows: 1,
						widths: ['*', 50, 80, 80],
						body: tableBody
					},
					layout: {
						hLineWidth: (i: number) => (i === 1 || i > 1 ? 1 : 0),
						vLineWidth: () => 0,
						hLineColor: (i: number) => (i === 1 ? EMERALD_500 : '#e2e8f0'),
						hLineStyle: (i: number) => (i === 1 ? { dash: { length: 4 } } : {}),
						paddingTop: () => 5,
						paddingBottom: () => 6
					},
					margin: [0, 0, 0, 10]
				},

				// Totals section with better spacing
				{
					columns: [
						{ width: '*', text: '' },
						{
							width: 220,
							stack: totalsStack
						}
					],
					margin: [0, 0, 0, 12]
				},

				// Notes section
				invoice.notes
					? {
							stack: [
								{ text: '// NOTES', style: 'label', margin: [0, 0, 0, 8] },
								{
									stack: parseMarkdown(invoice.notes),
									color: MUTED,
									lineHeight: 1.5,
									margin: [0, 8, 0, 0],
									fontSize: 9
								}
							],
							margin: [0, 6, 0, 0]
						}
					: {},

				// Terms section
				invoice.terms
					? {
							stack: [
								{ text: '// TERMS & CONDITIONS', style: 'label', margin: [0, 0, 0, 8] },
								{
									stack: parseMarkdown(invoice.terms),
									color: MUTED,
									fontSize: 9,
									lineHeight: 1.5,
									margin: [0, 8, 0, 0]
								}
							],
							margin: [0, 6, 0, 0]
						}
					: {}
			],
			styles: {
				label: { fontSize: 9, color: EMERALD_600, bold: true, characterSpacing: 1 },
				subLabel: { fontSize: 9, color: MUTED, characterSpacing: 0.5 },
				value: { fontSize: 10, color: SLATE_900, lineHeight: 1.3 },
				valueBold: { fontSize: 10, bold: true, color: SLATE_900, lineHeight: 1.3 },
				tableHeader: { fontSize: 9, bold: true, color: MUTED, characterSpacing: 0.5 }
			},
			defaultStyle: {
				font: 'Courier', // Try standard Courier for the 'Tech' feel
				fontSize: 10
			}
		};
	}
};
