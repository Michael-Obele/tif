import type { TemplateContext, TemplateDefinition } from '../types';
import { formatCurrency, formatDate } from '../utils';

export const boldTemplate: TemplateDefinition = {
	id: 'bold',
	name: 'Bold',
	description: 'High contrast design with distinct header block.',
	generate: (ctx: TemplateContext) => {
		const { invoice, totals } = ctx;
		const { currency, senderData, clientSnapshot, lineItems } = invoice;

		// Build line items
		const tableBody: any[][] = [
			[
				{ text: 'Description', style: 'tableHeader' },
				{ text: 'Qty', style: 'tableHeader', alignment: 'center' },
				{ text: 'Rate', style: 'tableHeader', alignment: 'right' },
				{ text: 'Amount', style: 'tableHeader', alignment: 'right' }
			]
		];

		lineItems.forEach((item) => {
			tableBody.push([
				{ text: item.description, margin: [0, 8, 0, 8], bold: true, color: '#0f172a' },
				{
					text: String(item.quantity),
					alignment: 'center',
					margin: [0, 8, 0, 8],
					color: '#334155'
				},
				{
					text: formatCurrency(item.rate, currency),
					alignment: 'right',
					margin: [0, 8, 0, 8],
					color: '#334155'
				},
				{
					text: formatCurrency(item.quantity * item.rate, currency),
					alignment: 'right',
					margin: [0, 8, 0, 8],
					bold: true,
					color: '#0f172a'
				}
			]);
		});

		return {
			pageMargins: [40, 0, 40, 40], // Zero top margin to allow header to bleed
			content: [
				// Black Header Block
				{
					stack: [
						invoice.senderData?.logo
							? {
									image: invoice.senderData.logo,
									width: 80,
									margin: [0, 0, 0, 15]
								}
							: {},
						{
							text: 'INVOICE',
							color: '#94a3b8',
							fontSize: 10,
							bold: true,
							characterSpacing: 2
						},
						{
							text: invoice.number || 'INV-001',
							color: 'white',
							fontSize: 28,
							bold: true
						}
					],
					background: '#0f172a',
					margin: [-40, 0, -40, 30],
					padding: [40, 40, 30, 40]
				},

				// From / To Section (Now below header)
				{
					columns: [
						{
							stack: [
								{ text: 'FROM', style: 'sectionLabel' },
								{
									text: senderData?.businessName || 'Your Business',
									style: 'companyName'
								},
								{ text: senderData?.address || '', style: 'address' },
								{ text: senderData?.email || '', style: 'contact' },
								{ text: senderData?.phone || '', style: 'contact' },
								{ text: senderData?.taxId ? `Tax ID: ${senderData.taxId}` : '', style: 'contact' }
							]
						},
						{
							stack: [
								{ text: 'BILL TO', style: 'sectionLabel' },
								{
									text: clientSnapshot?.name || 'Client Name',
									style: 'companyName'
								},
								{ text: clientSnapshot?.company || '', style: 'address' },
								{ text: clientSnapshot?.address || '', style: 'address' },
								{ text: clientSnapshot?.email || '', style: 'contact' },
								{
									text: clientSnapshot?.taxId ? `Tax ID: ${clientSnapshot.taxId}` : '',
									style: 'contact'
								}
							]
						}
					],
					margin: [0, 0, 0, 30]
				},

				// Details Grid (Grey Box, 4 Columns)
				{
					table: {
						widths: ['25%', '25%', '25%', '25%'],
						body: [
							[
								{
									stack: [
										{ text: 'ISSUE DATE', style: 'gridLabel' },
										{ text: formatDate(invoice.issueDate), style: 'gridValue' }
									]
								},
								{
									stack: [
										{ text: 'DUE DATE', style: 'gridLabel' },
										{ text: formatDate(invoice.dueDate), style: 'gridValue' }
									]
								},
								{
									stack: [
										{ text: 'CURRENCY', style: 'gridLabel' },
										{ text: invoice.currency, style: 'gridValue' }
									]
								},
								{
									stack: [
										{ text: 'TAX ID', style: 'gridLabel' },
										{ text: senderData?.taxId || '-', style: 'gridValue' }
									]
								}
							]
						]
					},
					layout: {
						hLineWidth: () => 0,
						vLineWidth: () => 0,
						fillColor: '#f8fafc',
						paddingTop: () => 10,
						paddingBottom: () => 10,
						paddingLeft: () => 10,
						paddingRight: () => 10
					},
					margin: [0, 0, 0, 30]
				},

				// Table
				{
					table: {
						headerRows: 1,
						widths: ['*', 40, 80, 80],
						body: tableBody
					},
					layout: {
						hLineWidth: (i: number) => (i === 1 ? 0 : 1),
						vLineWidth: () => 0,
						hLineColor: '#e2e8f0',
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
							stack: [
								{
									canvas: [
										{
											type: 'line',
											x1: 0,
											y1: 0,
											x2: 200,
											y2: 0,
											lineWidth: 1,
											lineColor: '#0f172a'
										}
									]
								},
								{
									columns: [
										{ text: 'Subtotal', style: 'totalLabel' },
										{ text: formatCurrency(totals.subtotal, currency), style: 'totalValue' }
									],
									margin: [0, 10, 0, 0]
								},
								totals.taxTotal > 0
									? {
											columns: [
												{ text: 'Tax', style: 'totalLabel' },
												{ text: formatCurrency(totals.taxTotal, currency), style: 'totalValue' }
											],
											margin: [0, 5, 0, 0]
										}
									: {},
								totals.discountAmount > 0
									? {
											columns: [
												{ text: 'Discount', style: 'totalLabel', color: '#16a34a' },
												{
													text: `-${formatCurrency(totals.discountAmount, currency)}`,
													style: 'totalValue',
													color: '#16a34a'
												}
											],
											margin: [0, 5, 0, 0]
										}
									: {},
								{
									columns: [
										{ text: 'Total Due', fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
										{
											text: formatCurrency(totals.total, currency),
											fontSize: 16,
											bold: true,
											alignment: 'right',
											margin: [0, 10, 0, 0],
											color: '#0f172a'
										}
									]
								}
							],
							margin: [0, 20, 0, 0]
						}
					]
				},

				// Footer Notes
				invoice.notes
					? {
							text: ['Notes: ', { text: invoice.notes, italics: true }],
							margin: [0, 40, 0, 5],
							color: '#64748b'
						}
					: {},
				invoice.terms
					? {
							text: ['Terms: ', { text: invoice.terms, italics: true }],
							fontSize: 9,
							color: '#64748b'
						}
					: {}
			],
			styles: {
				sectionLabel: { fontSize: 10, bold: true, color: '#94a3b8', margin: [0, 0, 0, 5] },
				companyName: { fontSize: 12, bold: true, color: '#0f172a', margin: [0, 0, 0, 2] },
				address: { fontSize: 10, color: '#334155', lineHeight: 1.4 },
				contact: { fontSize: 10, color: '#64748b', lineHeight: 1.4 },
				gridLabel: { fontSize: 9, bold: true, color: '#64748b', margin: [0, 0, 0, 4] },
				gridValue: { fontSize: 11, bold: true, color: '#0f172a' },
				tableHeader: {
					fontSize: 10,
					bold: true,
					color: '#64748b',
					fillColor: '#f8fafc',
					margin: [0, 5, 0, 5]
				},
				totalLabel: { color: '#64748b', fontSize: 10 },
				totalValue: { color: '#0f172a', fontSize: 10, alignment: 'right', bold: true }
			},
			defaultStyle: { fontSize: 10, color: '#0f172a' }
		};
	}
};
