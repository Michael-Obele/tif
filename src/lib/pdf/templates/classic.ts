/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TemplateContext, TemplateDefinition } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { parseMarkdown } from '../markdown';

export const classicTemplate: TemplateDefinition = {
	id: 'classic',
	name: 'Classic',
	description: 'Traditional formal design with boxed Layout.',
	generate: (ctx: TemplateContext) => {
		const { invoice, totals } = ctx;
		const { currency, senderData, clientSnapshot, lineItems } = invoice;

		// Build line items table body
		const tableBody: any[][] = [
			// Header row
			[
				{ text: 'DESCRIPTION', style: 'tableHeader' },
				{ text: 'QTY', style: 'tableHeader', alignment: 'center' },
				{ text: 'RATE', style: 'tableHeader', alignment: 'right' },
				{ text: 'AMOUNT', style: 'tableHeader', alignment: 'right' }
			]
		];

		// Add line items
		lineItems.forEach((item) => {
			const amount = item.quantity * item.rate;
			tableBody.push([
				{ text: item.description || 'Service', margin: [0, 3, 0, 3] },
				{ text: String(item.quantity), alignment: 'center', margin: [0, 3, 0, 3] },
				{ text: formatCurrency(item.rate, currency), alignment: 'right', margin: [0, 3, 0, 3] },
				{ text: formatCurrency(amount, currency), alignment: 'right', margin: [0, 3, 0, 3] }
			]);
		});

		return {
			content: [
				// Header
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
							fontSize: 9,
							bold: true,
							color: '#64748b',
							characterSpacing: 2,
							margin: [0, 0, 0, 8]
						},
						{
							text: invoice.number || 'INV-001',
							fontSize: 26,
							bold: true,
							margin: [0, 0, 0, 0],
							color: '#0f172a'
						}
					],
					margin: [0, 0, 0, 10]
				},

				// Double Line Separator
				{
					canvas: [
						{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1, lineColor: '#cbd5e1' },
						{ type: 'line', x1: 0, y1: 10, x2: 515, y2: 10, lineWidth: 1, lineColor: '#cbd5e1' }
					],
					margin: [0, 0, 0, 10]
				},

				// Boxed Info Section (From / To) - Better spacing
				{
					table: {
						widths: ['*'],
						body: [
							[
								{
									columns: [
										{
											width: '50%',
											stack: [
												{ text: 'FROM', style: 'sectionLabel' },
												{
													text: senderData?.businessName || 'Your Business',
													style: 'companyName'
												},
												{ text: senderData?.address || '', margin: [0, 8, 0, 0], lineHeight: 1.5 },
												{ text: senderData?.email || '', color: '#666', margin: [0, 6, 0, 0] },
												{ text: senderData?.phone || '', color: '#666' },
												{
													text: senderData?.taxId ? `Tax ID: ${senderData.taxId}` : '',
													fontSize: 9,
													color: '#9ca3af',
													margin: [0, 6, 0, 0]
												}
											]
										},
										{
											width: '50%',
											stack: [
												{ text: 'BILL TO', style: 'sectionLabel' },
												{
													text: clientSnapshot?.name || 'Client Name',
													style: 'companyName'
												},
												{ text: clientSnapshot?.company || '', margin: [0, 2, 0, 0] },
												{
													text: clientSnapshot?.address || '',
													margin: [0, 8, 0, 0],
													lineHeight: 1.5
												},
												{ text: clientSnapshot?.email || '', color: '#666', margin: [0, 6, 0, 0] },
												{
													text: clientSnapshot?.taxId ? `Tax ID: ${clientSnapshot.taxId}` : '',
													fontSize: 9,
													color: '#9ca3af',
													margin: [0, 6, 0, 0]
												}
											]
										}
									],
									margin: [15, 15, 15, 15]
								}
							]
						]
					},
					layout: {
						hLineWidth: () => 1.5,
						vLineWidth: () => 1.5,
						hLineColor: '#cbd5e1',
						vLineColor: '#cbd5e1'
					},
					margin: [0, 0, 0, 10]
				},

				// Dates Bar (Grey, 4 columns) - Better spacing
				{
					table: {
						widths: ['25%', '25%', '25%', '25%'],
						body: [
							[
								{
									stack: [
										{ text: 'ISSUE DATE', style: 'dateLabel' },
										{
											text: formatDate(invoice.issueDate),
											style: 'dateValue',
											margin: [0, 6, 0, 0]
										}
									]
								},
								{
									stack: [
										{ text: 'DUE DATE', style: 'dateLabel' },
										{ text: formatDate(invoice.dueDate), style: 'dateValue', margin: [0, 6, 0, 0] }
									]
								},
								{
									stack: [
										{ text: 'CURRENCY', style: 'dateLabel' },
										{ text: invoice.currency, style: 'dateValue', margin: [0, 6, 0, 0] }
									]
								},
								{
									stack: [
										{ text: 'TAX ID', style: 'dateLabel' },
										{ text: senderData?.taxId || '-', style: 'dateValue', margin: [0, 6, 0, 0] }
									]
								}
							]
						]
					},
					layout: {
						hLineWidth: (i: number) => (i === 0 || i === 1 ? 1.5 : 0),
						vLineWidth: () => 0,
						hLineColor: '#cbd5e1',
						fillColor: '#f8fafc',
						paddingTop: () => 5,
						paddingBottom: () => 5,
						paddingLeft: () => 8,
						paddingRight: () => 12
					},
					margin: [0, 0, 0, 12]
				},

				// Items Table
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
						hLineColor: '#cbd5e1',
						paddingTop: () => 5,
						paddingBottom: () => 6
					},
					margin: [0, 0, 0, 12]
				},

				// Totals Section
				{
					columns: [
						{ width: '*', text: '' },
						{
							width: 200,
							stack: [
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
												{ text: 'Discount', style: 'totalLabel', color: '#16a34a' },
												{
													text: `-${formatCurrency(totals.discountAmount, currency)}`,
													style: 'totalValue',
													color: '#16a34a'
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
											x2: 200,
											y2: 0,
											lineWidth: 1.5,
											lineColor: '#0f172a'
										}
									],
									margin: [0, 6, 0, 10]
								},
								{
									columns: [
										{ text: 'TOTAL DUE', style: 'totalLabelBold' },
										{ text: formatCurrency(totals.total, currency), style: 'totalValueBold' }
									]
								}
							]
						}
					],
					margin: [0, 0, 0, 12]
				},

				// Footer Notes
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
				sectionLabel: {
					fontSize: 9,
					bold: true,
					margin: [0, 0, 0, 5],
					color: '#9ca3af',
					characterSpacing: 0.5
				},
				companyName: {
					fontSize: 13,
					bold: true,
					margin: [0, 2, 0, 0],
					color: '#0f172a'
				},
				dateLabel: {
					fontSize: 8,
					bold: true,
					color: '#9ca3af',
					margin: [0, 0, 0, 2],
					characterSpacing: 0.5
				},
				dateValue: {
					fontSize: 11,
					bold: true,
					color: '#0f172a'
				},
				tableHeader: {
					bold: true,
					fontSize: 9,
					color: '#666',
					fillColor: '#f8fafc',
					alignment: 'left',
					characterSpacing: 0.5
				},
				totalLabel: {
					bold: true,
					alignment: 'right',
					color: '#666',
					fontSize: 10
				},
				totalValue: {
					alignment: 'right',
					color: '#0f172a',
					fontSize: 10,
					bold: true
				},
				totalLabelBold: {
					bold: true,
					alignment: 'right',
					fontSize: 11,
					color: '#0f172a'
				},
				totalValueBold: {
					bold: true,
					alignment: 'right',
					fontSize: 12,
					color: '#0f172a'
				}
			},
			defaultStyle: {
				fontSize: 10,
				color: '#475569'
			}
		};
	}
};
