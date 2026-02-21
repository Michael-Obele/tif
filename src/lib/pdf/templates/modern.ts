import type { TemplateContext, TemplateDefinition } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { parseMarkdown } from '../markdown';

export const modernTemplate: TemplateDefinition = {
	id: 'modern',
	name: 'Modern',
	description: 'Clean, contemporary design with generous whitespace.',
	generate: (ctx: TemplateContext) => {
		const { invoice, totals } = ctx;
		const { currency, senderData, clientSnapshot, lineItems } = invoice;

		const tableBody: any[][] = [
			[
				{ text: 'Description', style: 'tableHeader' },
				{ text: 'Qty', style: 'tableHeader', alignment: 'center' },
				{ text: 'Rate', style: 'tableHeader', alignment: 'right' },
				{ text: 'Amount', style: 'tableHeader', alignment: 'right' }
			]
		];

		lineItems.forEach((item) => {
			const amount = item.quantity * item.rate;
			tableBody.push([
				{ text: item.description || 'Service', margin: [0, 5, 0, 5] },
				{ text: String(item.quantity), alignment: 'center', margin: [0, 5, 0, 5] },
				{
					text: formatCurrency(item.rate, currency),
					alignment: 'right',
					margin: [0, 5, 0, 5]
				},
				{
					text: formatCurrency(amount, currency),
					alignment: 'right',
					margin: [0, 5, 0, 5]
				}
			]);
		});

		const totalsStack: any[] = [
			{
				columns: [
					{ text: 'Subtotal', color: '#666', fontSize: 10 },
					{ text: formatCurrency(totals.subtotal, currency), alignment: 'right', fontSize: 10 }
				],
				margin: [0, 0, 0, 10]
			}
		];

		if (totals.taxTotal > 0) {
			totalsStack.push({
				columns: [
					{ text: 'Tax', color: '#666', fontSize: 10 },
					{ text: formatCurrency(totals.taxTotal, currency), alignment: 'right', fontSize: 10 }
				],
				margin: [0, 0, 0, 10]
			});
		}

		if (totals.discountAmount > 0) {
			totalsStack.push({
				columns: [
					{ text: 'Discount', color: '#16a34a', fontSize: 10 },
					{
						text: `-${formatCurrency(totals.discountAmount, currency)}`,
						alignment: 'right',
						color: '#16a34a',
						fontSize: 10
					}
				],
				margin: [0, 0, 0, 10]
			});
		}

		totalsStack.push(
			{
				canvas: [
					{ type: 'line', x1: 0, y1: 0, x2: 220, y2: 0, lineWidth: 2, lineColor: '#4F46E5' }
				],
				margin: [0, 8, 0, 12]
			},
			{
				columns: [
					{ text: 'TOTAL DUE', bold: true, fontSize: 12, color: '#0f172a' },
					{
						text: formatCurrency(totals.total, currency),
						alignment: 'right',
						bold: true,
						fontSize: 16,
						color: '#4F46E5'
					}
				]
			}
		);

		return {
			content: [
				invoice.senderData?.logo
					? {
							image: invoice.senderData.logo,
							width: 80,
							margin: [0, 0, 0, 10]
						}
					: {},

				// Header with Invoice Number and Dates - Better spacing
				{
					columns: [
						{
							width: 'auto',
							stack: [
								{ text: 'INVOICE', style: 'invoiceLabel' },
								{ text: invoice.number || 'INV-001', style: 'invoiceNumber' }
							]
						},
						{
							width: '*',
							text: ''
						},
						{
							width: 'auto',
							stack: [
								{ text: 'ISSUE DATE', style: 'dateLabel' },
								{ text: formatDate(invoice.issueDate), style: 'dateValue', margin: [0, 3, 0, 0] },
								{ text: 'DUE DATE', style: 'dateLabel', margin: [0, 10, 0, 0] },
								{ text: formatDate(invoice.dueDate), style: 'dateValue', margin: [0, 3, 0, 0] }
							],
							alignment: 'right'
						}
					],
					margin: [0, 0, 0, 10]
				},

				// Sender and Client Info - Better visual separation
				{
					columns: [
						{
							width: '50%',
							stack: [
								{ text: 'FROM', style: 'sectionLabel' },
								{ text: senderData?.businessName || 'Your Business', style: 'companyName' },
								{
									text: senderData?.address || '',
									color: '#666',
									margin: [0, 8, 0, 0],
									lineHeight: 1.4
								},
								{ text: senderData?.email || '', color: '#666', margin: [0, 2, 0, 0] },
								{ text: senderData?.phone || '', color: '#666' },
								{
									text: senderData?.taxId ? `Tax ID: ${senderData.taxId}` : '',
									fontSize: 9,
									color: '#9ca3af',
									margin: [0, 2, 0, 0]
								}
							]
						},
						{
							width: '50%',
							stack: [
								{ text: 'BILL TO', style: 'sectionLabel' },
								{ text: clientSnapshot?.name || 'Client Name', style: 'companyName' },
								{ text: clientSnapshot?.company || '', color: '#666', margin: [0, 2, 0, 0] },
								{
									text: clientSnapshot?.address || '',
									color: '#666',
									margin: [0, 8, 0, 0],
									lineHeight: 1.4
								},
								{ text: clientSnapshot?.email || '', color: '#666', margin: [0, 2, 0, 0] },
								{
									text: clientSnapshot?.taxId ? `Tax ID: ${clientSnapshot.taxId}` : '',
									fontSize: 9,
									color: '#9ca3af',
									margin: [0, 2, 0, 0]
								}
							]
						}
					],
					margin: [0, 0, 0, 10]
				},

				// Line Items Table - Better spacing and visibility
				{
					table: {
						headerRows: 1,
						widths: ['*', 50, 80, 80],
						body: tableBody
					},
					layout: {
						hLineWidth: (i: number, node: any) =>
							i === 0 || i === 1 || i === node.table.body.length ? 1.5 : 0,
						vLineWidth: () => 0,
						hLineColor: () => '#cbd5e1',
						paddingTop: () => 5,
						paddingBottom: () => 5
					},
					margin: [0, 0, 0, 10]
				},

				// Totals Section - Improved visuals
				{
					columns: [
						{ width: '*', text: '' },
						{
							width: 220,
							stack: totalsStack
						}
					],
					margin: [0, 0, 0, 10]
				},

				// Notes Section
				invoice.notes
					? {
							stack: [
								{ text: 'NOTES', style: 'sectionLabel' },
								{
									stack: parseMarkdown(invoice.notes),
									color: '#666',
									lineHeight: 1.5,
									margin: [0, 8, 0, 0]
								}
							],
							margin: [0, 0, 0, 12]
						}
					: {},

				// Terms Section
				invoice.terms
					? {
							stack: [
								{ text: 'TERMS & CONDITIONS', style: 'sectionLabel' },
								{
									stack: parseMarkdown(invoice.terms),
									color: '#666',
									fontSize: 9,
									lineHeight: 1.5,
									margin: [0, 8, 0, 0]
								}
							]
						}
					: {}
			],
			styles: {
				invoiceLabel: { fontSize: 9, color: '#9ca3af', bold: true, characterSpacing: 1 },
				invoiceNumber: { fontSize: 28, bold: true, color: '#0f172a', margin: [0, 2, 0, 0] },
				dateLabel: { fontSize: 8, color: '#9ca3af', bold: true, characterSpacing: 0.5 },
				dateValue: { fontSize: 11, color: '#0f172a', bold: true },
				sectionLabel: { fontSize: 9, color: '#9ca3af', bold: true, characterSpacing: 0.5 },
				companyName: { fontSize: 13, bold: true, color: '#0f172a', margin: [0, 2, 0, 0] },
				tableHeader: {
					bold: true,
					fontSize: 9,
					color: '#666',
					fillColor: '#f8fafc',
					margin: [0, 4, 0, 4],
					characterSpacing: 0.5
				}
			},
			defaultStyle: { fontSize: 10, color: '#475569' }
		};
	}
};
