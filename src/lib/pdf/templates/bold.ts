import type { TemplateContext, TemplateDefinition } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { parseMarkdown } from '../markdown';

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
				{ text: item.description, margin: [0, 3, 0, 3], bold: true, color: '#0f172a' },
				{
					text: String(item.quantity),
					alignment: 'center',
					margin: [0, 3, 0, 3],
					color: '#334155'
				},
				{
					text: formatCurrency(item.rate, currency),
					alignment: 'right',
					margin: [0, 3, 0, 3],
					color: '#334155'
				},
				{
					text: formatCurrency(item.quantity * item.rate, currency),
					alignment: 'right',
					margin: [0, 3, 0, 3],
					bold: true,
					color: '#0f172a'
				}
			]);
		});

		return {
			pageMargins: [40, 0, 40, 40], // Zero top margin to allow header to bleed
			content: [
				// Black Header Background (Full Bleed)
				{
					canvas: [{ type: 'rect', x: 0, y: 0, w: 595, h: 160, color: '#000000' }],
					absolutePosition: { x: 0, y: 0 }
				},

				// Header Content
				{
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
							color: '#cccccc',
							fontSize: 10,
							bold: true,
							characterSpacing: 2,
							margin: [0, 0, 0, 4]
						},
						{
							text: invoice.number || 'INV-001',
							color: '#ffffff',
							fontSize: 28,
							bold: true
						}
					],
					margin: [0, 30, 0, 80] // Push content below black header (160px)
				},

				// From / To Section (Now below header) - Better spacing
				{
					columns: [
						{
							stack: [
								{ text: 'FROM', style: 'sectionLabel' },
								{
									text: senderData?.businessName || 'Your Business',
									style: 'companyName'
								},
								{ text: senderData?.address || '', style: 'address', margin: [0, 8, 0, 0] },
								{ text: senderData?.email || '', style: 'contact', margin: [0, 2, 0, 0] },
								{ text: senderData?.phone || '', style: 'contact', margin: [0, 2, 0, 0] },
								{
									text: senderData?.taxId ? `Tax ID: ${senderData.taxId}` : '',
									style: 'contact',
									margin: [0, 2, 0, 0]
								}
							]
						},
						{
							stack: [
								{ text: 'BILL TO', style: 'sectionLabel' },
								{
									text: clientSnapshot?.name || 'Client Name',
									style: 'companyName'
								},
								{ text: clientSnapshot?.company || '', style: 'address', margin: [0, 2, 0, 0] },
								{ text: clientSnapshot?.address || '', style: 'address', margin: [0, 8, 0, 0] },
								{ text: clientSnapshot?.email || '', style: 'contact', margin: [0, 2, 0, 0] },
								{
									text: clientSnapshot?.taxId ? `Tax ID: ${clientSnapshot.taxId}` : '',
									style: 'contact',
									margin: [0, 2, 0, 0]
								}
							]
						}
					],
					margin: [0, 0, 0, 10]
				},

				// Details Grid (Grey Box, 4 Columns) - Better spacing
				{
					table: {
						widths: ['25%', '25%', '25%', '25%'],
						body: [
							[
								{
									stack: [
										{ text: 'ISSUE DATE', style: 'gridLabel' },
										{
											text: formatDate(invoice.issueDate),
											style: 'gridValue',
											margin: [0, 6, 0, 0]
										}
									]
								},
								{
									stack: [
										{ text: 'DUE DATE', style: 'gridLabel' },
										{ text: formatDate(invoice.dueDate), style: 'gridValue', margin: [0, 6, 0, 0] }
									]
								},
								{
									stack: [
										{ text: 'CURRENCY', style: 'gridLabel' },
										{ text: invoice.currency, style: 'gridValue', margin: [0, 6, 0, 0] }
									]
								},
								{
									stack: [
										{ text: 'TAX ID', style: 'gridLabel' },
										{ text: senderData?.taxId || '-', style: 'gridValue', margin: [0, 6, 0, 0] }
									]
								}
							]
						]
					},
					layout: {
						hLineWidth: () => 0,
						vLineWidth: () => 0,
						fillColor: '#f8fafc',
						paddingTop: () => 6,
						paddingBottom: () => 6,
						paddingLeft: () => 8,
						paddingRight: () => 12
					},
					margin: [0, 0, 0, 10]
				},

				// Table - Better spacing
				{
					table: {
						headerRows: 1,
						widths: ['*', 40, 80, 80],
						body: tableBody
					},
					layout: {
						hLineWidth: (i: number) => (i === 1 ? 0 : 1),
						vLineWidth: () => 0,
						hLineColor: '#cbd5e1',
						paddingTop: () => 11,
						paddingBottom: () => 6
					},
					margin: [0, 0, 0, 10]
				},

				// Totals section - Better styling and spacing
				{
					columns: [
						{ width: '*', text: '' },
						{
							width: 220,
							stack: [
								{
									canvas: [
										{
											type: 'line',
											x1: 0,
											y1: 0,
											x2: 220,
											y2: 0,
											lineWidth: 2,
											lineColor: '#0f172a'
										}
									],
									margin: [0, 0, 0, 12]
								},
								{
									columns: [
										{ text: 'Subtotal', style: 'totalLabel' },
										{ text: formatCurrency(totals.subtotal, currency), style: 'totalValue' }
									],
									margin: [0, 0, 0, 8]
								},
								totals.taxTotal > 0
									? {
											columns: [
												{ text: 'Tax', style: 'totalLabel' },
												{ text: formatCurrency(totals.taxTotal, currency), style: 'totalValue' }
											],
											margin: [0, 0, 0, 8]
										}
									: {},
								totals.discountAmount > 0
									? {
											columns: [
												{ text: 'Discount', style: 'totalLabel', color: '#059669' },
												{
													text: `-${formatCurrency(totals.discountAmount, currency)}`,
													style: 'totalValue',
													color: '#059669'
												}
											],
											margin: [0, 0, 0, 8]
										}
									: {},
								{
									canvas: [
										{
											type: 'line',
											x1: 0,
											y1: 0,
											x2: 220,
											y2: 0,
											lineWidth: 1.5,
											lineColor: '#cbd5e1'
										}
									],
									margin: [0, 8, 0, 12]
								},
								{
									columns: [
										{ text: 'Total Due', fontSize: 12, bold: true },
										{
											text: formatCurrency(totals.total, currency),
											fontSize: 16,
											bold: true,
											alignment: 'right',
											color: '#0f172a'
										}
									]
								}
							],
							margin: [0, 0, 0, 0]
						}
					],
					margin: [0, 0, 0, 12]
				},

				// Footer Notes - Better spacing
				invoice.notes
					? {
							stack: [
								{ text: 'Notes:', bold: true, fontSize: 9, color: '#64748b' },
								{
									stack: parseMarkdown(invoice.notes),
									italics: true,
									color: '#64748b',
									fontSize: 9,
									lineHeight: 1.4,
									margin: [0, 2, 0, 0]
								}
							],
							margin: [0, 30, 0, 10]
						}
					: {},
				invoice.terms
					? {
							stack: [
								{ text: 'Terms:', bold: true, fontSize: 9, color: '#64748b' },
								{
									stack: parseMarkdown(invoice.terms),
									italics: true,
									fontSize: 9,
									color: '#64748b',
									lineHeight: 1.4,
									margin: [0, 2, 0, 0]
								}
							],
							margin: [0, 10, 0, 0]
						}
					: {}
			],
			styles: {
				sectionLabel: { fontSize: 10, bold: true, color: '#94a3b8', characterSpacing: 1 },
				companyName: { fontSize: 12, bold: true, color: '#0f172a', margin: [0, 0, 0, 0] },
				address: { fontSize: 10, color: '#334155', lineHeight: 1.5 },
				contact: { fontSize: 10, color: '#64748b', lineHeight: 1.5 },
				gridLabel: { fontSize: 8, bold: true, color: '#64748b', characterSpacing: 0.5 },
				gridValue: { fontSize: 11, bold: true, color: '#0f172a', lineHeight: 1.3 },
				tableHeader: {
					fontSize: 10,
					bold: true,
					color: '#64748b',
					fillColor: '#f8fafc',
					margin: [0, 5, 0, 5],
					characterSpacing: 0.5
				},
				totalLabel: { color: '#64748b', fontSize: 10, lineHeight: 1.4 },
				totalValue: {
					color: '#0f172a',
					fontSize: 10,
					alignment: 'right',
					bold: true,
					lineHeight: 1.4
				}
			},
			defaultStyle: { fontSize: 10, color: '#0f172a' }
		};
	}
};
