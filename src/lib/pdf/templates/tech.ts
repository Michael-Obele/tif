/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TemplateContext, TemplateDefinition } from '../types';
import { formatCurrency } from '../utils';

export const techTemplate: TemplateDefinition = {
	id: 'tech',
	name: 'Tech',
	description: 'Developer-focused monospace design.',
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
		lineItems.forEach((item, index) => {
			const amount = item.quantity * item.rate;
			tableBody.push([
				{ text: `${index + 1}. ${item.description || 'Service'}`, margin: [0, 5, 0, 5] },
				{ text: String(item.quantity), alignment: 'center', margin: [0, 5, 0, 5] },
				{ text: formatCurrency(item.rate, currency), alignment: 'right', margin: [0, 5, 0, 5] },
				{ text: formatCurrency(amount, currency), alignment: 'right', margin: [0, 5, 0, 5] }
			]);
		});

		return {
			content: [
				// Code Header
				{
					table: {
						widths: ['*'],
						body: [
							[{ text: `Invoice<${invoice.number || 'INV-001'}>`, color: 'white', fillOpacity: 1 }]
						]
					},
					layout: {
						fillColor: '#2d2d2d',
						hLineWidth: () => 0,
						vLineWidth: () => 0,
						paddingTop: () => 10,
						paddingBottom: () => 10,
						paddingLeft: () => 10
					},
					margin: [0, 0, 0, 20]
				},

				// JSON-like details
				{
					columns: [
						{
							text: [
								{ text: 'const ', color: '#cc99cd' },
								{ text: 'sender ', color: '#f8c555' },
								{ text: '= {\n', color: '#e0e0e0' },
								{ text: `  name: "${senderData?.businessName || ''}",\n`, color: '#7ec699' },
								{ text: `  email: "${senderData?.email || ''}",\n`, color: '#7ec699' },
								{ text: '};', color: '#e0e0e0' }
							]
						},
						{
							text: [
								{ text: 'const ', color: '#cc99cd' },
								{ text: 'client ', color: '#f8c555' },
								{ text: '= {\n', color: '#e0e0e0' },
								{ text: `  name: "${clientSnapshot?.name || ''}",\n`, color: '#7ec699' },
								{ text: `  company: "${clientSnapshot?.company || ''}",\n`, color: '#7ec699' },
								{ text: '};', color: '#e0e0e0' }
							]
						}
					],
					margin: [0, 0, 0, 20],
					style: 'code'
				},

				// Divider
				{
					canvas: [
						{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, dash: { length: 5 } }
					]
				},
				{ text: '', margin: [0, 0, 0, 20] },

				// Items Table
				{
					table: {
						headerRows: 1,
						widths: ['*', 50, 80, 80],
						body: tableBody
					},
					layout: {
						hLineWidth: (i: number) => (i === 1 ? 1 : 0),
						vLineWidth: () => 0,
						hLineStyle: () => ({ dash: { length: 2 } })
					}
				},

				// Totals (Code comment style)
				{
					text: '\n/* Payment Summary */',
					color: '#666',
					italics: true,
					margin: [0, 20, 0, 5]
				},
				{
					columns: [
						{ width: '*', text: '' },
						{
							width: 200,
							stack: [
								{
									columns: [
										{ text: 'subtotal:', width: 80, alignment: 'right' },
										{ text: formatCurrency(totals.subtotal, currency), alignment: 'right' }
									]
								},
								totals.taxTotal > 0
									? {
											columns: [
												{ text: 'tax:', width: 80, alignment: 'right' },
												{ text: formatCurrency(totals.taxTotal, currency), alignment: 'right' }
											]
										}
									: {},
								totals.discountAmount > 0
									? {
											columns: [
												{ text: 'discount:', width: 80, alignment: 'right' },
												{
													text: `-${formatCurrency(totals.discountAmount, currency)}`,
													alignment: 'right'
												}
											]
										}
									: {},
								{ text: '----------------', alignment: 'right', margin: [0, 2, 0, 2] },
								{
									columns: [
										{ text: 'total:', width: 80, alignment: 'right', bold: true },
										{ text: formatCurrency(totals.total, currency), alignment: 'right', bold: true }
									]
								}
							]
						}
					],
					style: 'code'
				}
			],
			styles: {
				tableHeader: { bold: true, fontSize: 10, color: '#666' },
				code: { fontSize: 10 }
			},
			defaultStyle: { fontSize: 10, color: '#333' }
		};
	}
};
