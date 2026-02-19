/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TemplateContext, TemplateDefinition } from '../types';
import { formatCurrency, formatDate } from '../utils';

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
				{ text: item.description || 'Service', margin: [0, 5, 0, 5] },
				{ text: String(item.quantity), alignment: 'center', margin: [0, 5, 0, 5] },
				{ text: formatCurrency(item.rate, currency), alignment: 'right', margin: [0, 5, 0, 5] },
				{ text: formatCurrency(amount, currency), alignment: 'right', margin: [0, 5, 0, 5] }
			]);
		});

		// Add totals rows to the table
		tableBody.push([
			{ text: '', border: [false, false, false, false] },
			{ text: '', border: [false, false, false, false] },
			{ text: 'SUBTOTAL', style: 'totalLabel' },
			{ text: formatCurrency(totals.subtotal, currency), style: 'totalValue' }
		]);

		if (totals.taxTotal > 0) {
			tableBody.push([
				{ text: '', border: [false, false, false, false] },
				{ text: '', border: [false, false, false, false] },
				{ text: 'TAX', style: 'totalLabel' },
				{ text: formatCurrency(totals.taxTotal, currency), style: 'totalValue' }
			]);
		}

		if (totals.discountAmount > 0) {
			tableBody.push([
				{ text: '', border: [false, false, false, false] },
				{ text: '', border: [false, false, false, false] },
				{ text: 'DISCOUNT', style: 'totalLabel' },
				{ text: `-${formatCurrency(totals.discountAmount, currency)}`, style: 'totalValue' }
			]);
		}

		tableBody.push([
			{ text: '', border: [false, false, false, false] },
			{ text: '', border: [false, false, false, false] },
			{ text: 'TOTAL DUE', style: 'totalLabelBold' },
			{ text: formatCurrency(totals.total, currency), style: 'totalValueBold' }
		]);

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
							fontSize: 10,
							bold: true,
							color: '#64748b',
							characterSpacing: 2
						},
						{
							text: invoice.number || 'INV-001',
							fontSize: 24,
							bold: true,
							margin: [0, 2, 0, 0]
						}
					]
				},
				// Double Border Separator
				{
					canvas: [
						{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1, lineColor: '#e2e8f0' },
						{ type: 'line', x1: 0, y1: 8, x2: 515, y2: 8, lineWidth: 1, lineColor: '#e2e8f0' }
					],
					margin: [0, 20, 0, 20]
				},

				// Boxed Info Section (From / To)
				{
					table: {
						widths: ['*'],
						body: [
							[
								{
									columns: [
										{
											stack: [
												{ text: 'FROM', style: 'sectionLabel' },
												{
													text: senderData?.businessName || 'Your Business',
													style: 'companyName'
												},
												{ text: senderData?.address || '', margin: [0, 2, 0, 0] },
												{ text: senderData?.email || '', color: '#666' },
												{ text: senderData?.phone || '', color: '#666' },
												{
													text: senderData?.taxId ? `Tax ID: ${senderData.taxId}` : '',
													fontSize: 9,
													color: '#666'
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
												{ text: clientSnapshot?.company || '', margin: [0, 2, 0, 0] },
												{ text: clientSnapshot?.address || '', margin: [0, 2, 0, 0] },
												{ text: clientSnapshot?.email || '', color: '#666' },
												{
													text: clientSnapshot?.taxId ? `Tax ID: ${clientSnapshot.taxId}` : '',
													fontSize: 9,
													color: '#666'
												}
											]
										}
									],
									margin: [10, 10, 10, 10]
								}
							]
						]
					},
					layout: {
						hLineWidth: () => 1,
						vLineWidth: () => 1,
						hLineColor: '#e2e8f0',
						vLineColor: '#e2e8f0'
					},
					margin: [0, 0, 0, 20]
				},

				// Dates Bar (Grey, 4 columns)
				{
					table: {
						widths: ['25%', '25%', '25%', '25%'],
						body: [
							[
								{
									stack: [
										{ text: 'ISSUE DATE', style: 'dateLabel' },
										{ text: formatDate(invoice.issueDate), style: 'dateValue' }
									]
								},
								{
									stack: [
										{ text: 'DUE DATE', style: 'dateLabel' },
										{ text: formatDate(invoice.dueDate), style: 'dateValue' }
									]
								},
								{
									stack: [
										{ text: 'CURRENCY', style: 'dateLabel' },
										{ text: invoice.currency, style: 'dateValue' }
									]
								},
								{
									stack: [
										{ text: 'TAX ID', style: 'dateLabel' },
										{ text: senderData?.taxId || '-', style: 'dateValue' }
									]
								}
							]
						]
					},
					layout: {
						hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0),
						vLineWidth: () => 0,
						hLineColor: '#e2e8f0',
						fillColor: '#f8fafc',
						paddingTop: () => 10,
						paddingBottom: () => 10
					},
					margin: [0, 0, 0, 20]
				},

				// Items Table
				{
					table: {
						headerRows: 1,
						widths: ['*', 50, 80, 80],
						body: tableBody
					},
					layout: {
						hLineWidth: () => 1,
						vLineWidth: () => 0,
						hLineColor: '#e2e8f0',
						paddingTop: () => 8,
						paddingBottom: () => 8
					}
				},

				// Footer Notes
				invoice.notes
					? {
							text: ['Notes: ', { text: invoice.notes, italics: true }],
							margin: [0, 30, 0, 5],
							color: '#666'
						}
					: {},
				invoice.terms
					? {
							text: ['Terms: ', { text: invoice.terms, italics: true }],
							fontSize: 9,
							color: '#666'
						}
					: {}
			],
			styles: {
				sectionLabel: {
					fontSize: 10,
					bold: true,
					margin: [0, 0, 0, 5],
					color: '#64748b'
				},
				companyName: {
					fontSize: 14,
					bold: true,
					italics: true, // Classic touch
					margin: [0, 0, 0, 5],
					color: '#1e293b'
				},
				dateLabel: {
					fontSize: 9,
					bold: true,
					color: '#64748b',
					margin: [0, 0, 0, 2]
				},
				dateValue: {
					fontSize: 11,
					color: '#1e293b'
				},
				tableHeader: {
					bold: true,
					fontSize: 10,
					color: '#1e293b',
					alignment: 'left'
				},
				totalLabel: {
					bold: true,
					alignment: 'right',
					color: '#64748b'
				},
				totalValue: {
					alignment: 'right',
					color: '#1e293b'
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
					fontSize: 11,
					color: '#0f172a'
				}
			},
			defaultStyle: {
				fontSize: 10,
				font: 'Times' // Will fallback to Roboto if properly aliased in pdf-generator
			}
		};
	}
};
