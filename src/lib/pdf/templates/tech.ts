/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TemplateContext, TemplateDefinition } from '../types';
import { formatCurrency, formatDate } from '../utils';

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

		// Build line items table body
		const tableBody: any[][] = [
			// Header row
			[
				{ text: '// DESCRIPTION', style: 'tableHeader' },
				{ text: '// QTY', style: 'tableHeader', alignment: 'center' },
				{ text: '// RATE', style: 'tableHeader', alignment: 'right' },
				{ text: '// AMT', style: 'tableHeader', alignment: 'right' }
			]
		];

		// Add line items
		lineItems.forEach((item) => {
			const amount = item.quantity * item.rate;
			tableBody.push([
				{ text: item.description || 'Service', margin: [0, 8, 0, 8] },
				{ text: String(item.quantity), alignment: 'center', margin: [0, 8, 0, 8] },
				{ text: formatCurrency(item.rate, currency), alignment: 'right', margin: [0, 8, 0, 8] },
				{ text: formatCurrency(amount, currency), alignment: 'right', margin: [0, 8, 0, 8] }
			]);
		});

		// Build taxes and discounts
		const totalsStack: any[] = [
			{
				columns: [
					{ text: 'Subtotal', color: MUTED },
					{ text: formatCurrency(totals.subtotal, currency), alignment: 'right' }
				],
				margin: [0, 5, 0, 5]
			}
		];

		if (totals.taxTotal > 0) {
			totalsStack.push({
				columns: [
					{ text: 'Tax', color: MUTED },
					{ text: formatCurrency(totals.taxTotal, currency), alignment: 'right' }
				],
				margin: [0, 5, 0, 5]
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
				margin: [0, 5, 0, 5]
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
						lineWidth: 1,
						lineColor: EMERALD_500,
						dash: { length: 4 }
					}
				],
				margin: [0, 10, 0, 10]
			},
			{
				columns: [
					{ text: 'Total Due', bold: true },
					{
						text: formatCurrency(totals.total, currency),
						alignment: 'right',
						bold: true,
						fontSize: 14,
						color: EMERALD_500
					}
				]
			}
		);

		return {
			content: [
				// Header
				{
					columns: [
						{
							stack: [
								invoice.senderData?.logo
									? {
										image: invoice.senderData.logo,
										width: 80,
										margin: [0, 0, 0, 15]
									}
									: {},
								{ text: 'INVOICE', fontSize: 10, color: MUTED, characterSpacing: 2 },
								{ text: invoice.number || 'INV-001', fontSize: 24, bold: true, color: SLATE_900 }
							]
						},
						{
							stack: [
								{
									text: invoice.status.toUpperCase(),
									color: MUTED,
									alignment: 'right',
									background: '#f1f5f9',
									decorationStyle: 'dashed' // Fallback visual
								}
							]
						}
					],
					margin: [0, 0, 0, 30]
				},

				// Sender & Client (Columns)
				{
					columns: [
						{
							stack: [
								{ text: '// FROM', style: 'label' },
								{ text: senderData?.businessName || 'Your Business', style: 'valueBold' },
								{ text: senderData?.address || '', style: 'value' },
								{ text: senderData?.email || '', style: 'value' }
							]
						},
						{
							stack: [
								{ text: '// BILL TO', style: 'label' },
								{ text: clientSnapshot?.name || 'Client Name', style: 'valueBold' },
								{ text: clientSnapshot?.company || '', style: 'value' },
								{ text: clientSnapshot?.address || '', style: 'value' },
								{ text: clientSnapshot?.email || '', style: 'value' },
								{ text: clientSnapshot?.taxId ? `Tax ID: ${clientSnapshot.taxId}` : '', style: 'value', color: MUTED }
							]
						}
					],
					margin: [0, 0, 0, 30]
				},

				// Dates Box (Dashed Borders)
				{
					table: {
						widths: ['*', '*', '*', '*'],
						body: [
							[
								{
									stack: [
										{ text: 'ISSUE DATE', style: 'subLabel' },
										{ text: formatDate(invoice.issueDate), style: 'value' }
									]
								},
								{
									stack: [
										{ text: 'DUE DATE', style: 'subLabel' },
										{ text: formatDate(invoice.dueDate), style: 'value' }
									]
								},
								{
									stack: [
										{ text: 'CURRENCY', style: 'subLabel' },
										{ text: invoice.currency, style: 'value' }
									]
								},
								{
									stack: [
										{ text: 'TAX ID', style: 'subLabel' },
										{ text: senderData?.taxId || '-', style: 'value' }
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
						paddingTop: () => 10,
						paddingBottom: () => 10
					},
					margin: [0, 0, 0, 30]
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
						hLineStyle: () => ({ dash: { length: 4 } }),
						paddingTop: () => 10,
						paddingBottom: () => 10
					}
				},

				// Totals
				{
					columns: [
						{ width: '*', text: '' },
						{
							width: 200,
							stack: totalsStack,
							margin: [0, 20, 0, 0]
						}
					]
				},
				// Notes and Terms
				invoice.notes
					? {
						stack: [
							{ text: 'Notes', bold: true, margin: [0, 30, 0, 5] },
							{ text: invoice.notes, color: MUTED }
						]
					}
					: {},
				invoice.terms
					? {
						stack: [
							{ text: 'Terms & Conditions', bold: true, margin: [0, 20, 0, 5] },
							{ text: invoice.terms, color: MUTED, fontSize: 9 }
						]
					}
					: {}
			],
			styles: {
				label: { fontSize: 9, color: EMERALD_600, bold: true, margin: [0, 0, 0, 4] },
				subLabel: { fontSize: 9, color: MUTED, margin: [0, 0, 0, 4] },
				value: { fontSize: 10, color: SLATE_900, lineHeight: 1.2 },
				valueBold: { fontSize: 10, bold: true, color: SLATE_900, lineHeight: 1.2 },
				tableHeader: { fontSize: 9, bold: true, color: MUTED }
			},
			defaultStyle: {
				font: 'Courier', // Try standard Courier for the 'Tech' feel
				fontSize: 10
			}
		};
	}
};
