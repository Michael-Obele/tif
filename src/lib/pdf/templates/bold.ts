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
				{ text: 'Price', style: 'tableHeader', alignment: 'right' },
				{ text: 'Total', style: 'tableHeader', alignment: 'right' }
			]
		];

		lineItems.forEach((item) => {
			tableBody.push([
				{ text: item.description, margin: [0, 8, 0, 8], bold: true },
				{ text: String(item.quantity), alignment: 'center', margin: [0, 8, 0, 8] },
				{ text: formatCurrency(item.rate, currency), alignment: 'right', margin: [0, 8, 0, 8] },
				{
					text: formatCurrency(item.quantity * item.rate, currency),
					alignment: 'right',
					margin: [0, 8, 0, 8],
					bold: true
				}
			]);
		});

		return {
			content: [
				// Black Header Block
				{
					table: {
						widths: ['*', 'auto'],
						body: [
							[
								{
									stack: [
										{
											text: (senderData?.businessName || 'Your Business').toUpperCase(),
											color: 'white',
											bold: true,
											fontSize: 16
										},
										{ text: senderData?.email || '', color: '#cccccc', fontSize: 10 }
									],
									margin: [20, 20, 0, 20]
								},
								{
									text: 'INVOICE',
									color: 'white',
									fontSize: 40,
									bold: true,
									margin: [0, 10, 20, 0],
									alignment: 'right'
								}
							]
						]
					},
					layout: {
						fillColor: 'black',
						hLineWidth: () => 0,
						vLineWidth: () => 0
					},
					margin: [-40, -60, -40, 20] // Bleed into margins
				},

				// Details Grid
				{
					columns: [
						{
							width: '40%',
							stack: [
								{ text: 'BILLED TO', fontSize: 9, bold: true, color: '#888' },
								{
									text: clientSnapshot?.name || 'Client Name',
									fontSize: 14,
									bold: true,
									margin: [0, 0, 0, 5]
								},
								{ text: clientSnapshot?.company || '', fontSize: 10 },
								{ text: clientSnapshot?.address || '', fontSize: 10, color: '#555' }
							]
						},
						{
							width: '60%',
							columns: [
								{
									stack: [
										{ text: 'INVOICE NO.', fontSize: 9, bold: true, color: '#888' },
										{ text: invoice.number || 'INV-001', fontSize: 12, bold: true }
									]
								},
								{
									stack: [
										{ text: 'ISSUED', fontSize: 9, bold: true, color: '#888' },
										{ text: formatDate(invoice.issueDate), fontSize: 12, bold: true }
									]
								},
								{
									stack: [
										{ text: 'DUE DATE', fontSize: 9, bold: true, color: '#888' },
										{ text: formatDate(invoice.dueDate), fontSize: 12, bold: true }
									]
								}
							]
						}
					],
					margin: [0, 20, 0, 40]
				},

				// Table
				{
					table: {
						headerRows: 1,
						widths: ['*', 40, 80, 80],
						body: tableBody
					},
					layout: {
						hLineWidth: (i: number) => (i === 1 ? 2 : 0),
						vLineWidth: () => 0,
						hLineColor: 'black'
					}
				},

				// Totals - Large and Bold
				{
					columns: [
						{ width: '*', text: '' },
						{
							width: 250,
							stack: [
								{
									canvas: [{ type: 'line', x1: 0, y1: 0, x2: 250, y2: 0, lineWidth: 2 }]
								},
								{
									columns: [
										{ text: 'Total Due', fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
										{
											text: formatCurrency(totals.total, currency),
											fontSize: 24,
											bold: true,
											alignment: 'right',
											margin: [0, 5, 0, 0]
										}
									]
								}
							],
							margin: [0, 20, 0, 0]
						}
					]
				}
			],
			styles: {
				tableHeader: { fontSize: 10, bold: true, color: '#888' }
			},
			defaultStyle: { fontSize: 11, color: 'black' }
		};
	}
};
