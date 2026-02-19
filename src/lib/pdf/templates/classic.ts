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
				// Centered Header
				{
					text: 'INVOICE',
					fontSize: 28,
					bold: true,
					alignment: 'center',
					margin: [0, 0, 0, 10]
				},
				{
					text: invoice.number || 'INV-001',
					fontSize: 12,
					alignment: 'center',
					margin: [0, 0, 0, 30]
				},

				// Boxed Info Section
				{
					table: {
						widths: ['50%', '50%'],
						body: [
							[
								{
									stack: [
										{ text: 'FROM:', style: 'sectionLabel' },
										{ text: senderData?.businessName || 'Your Business', style: 'companyName' },
										{ text: senderData?.address || '', margin: [0, 2, 0, 0] },
										{ text: senderData?.email || '' },
										{ text: senderData?.phone || '' },
										{ text: senderData?.taxId ? `Tax ID: ${senderData.taxId}` : '', fontSize: 9 }
									],
									margin: [10, 10, 10, 10]
								},
								{
									stack: [
										{ text: 'TO:', style: 'sectionLabel' },
										{ text: clientSnapshot?.name || 'Client Name', style: 'companyName' },
										{ text: clientSnapshot?.company || '' },
										{ text: clientSnapshot?.address || '', margin: [0, 2, 0, 0] },
										{ text: clientSnapshot?.email || '' },
										{ text: clientSnapshot?.taxId ? `Tax ID: ${clientSnapshot.taxId}` : '', fontSize: 9 }
									],
									margin: [10, 10, 10, 10]
								}
							]
						]
					},
					margin: [0, 0, 0, 20]
				},

				// Dates Bar
				{
					table: {
						widths: ['33%', '33%', '33%'],
						body: [
							[
								{
									text: `Issue Date: ${formatDate(invoice.issueDate)}`,
									alignment: 'center',
									margin: [0, 5, 0, 5]
								},
								{
									text: `Due Date: ${formatDate(invoice.dueDate)}`,
									alignment: 'center',
									margin: [0, 5, 0, 5]
								},
								{
									text: `Amount Due: ${formatCurrency(totals.total, currency)}`,
									alignment: 'center',
									bold: true,
									margin: [0, 5, 0, 5]
								}
							]
						]
					},
					layout: 'headerLineOnly',
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
						vLineWidth: () => 1,
						hLineColor: '#000',
						vLineColor: '#000',
						paddingTop: () => 8,
						paddingBottom: () => 8
					}
				},

				// Footer Notes
				invoice.notes
					? {
							text: ['Notes: ', { text: invoice.notes, italics: true }],
							margin: [0, 30, 0, 5]
						}
					: {},
				invoice.terms
					? {
							text: ['Terms: ', { text: invoice.terms, italics: true }],
							fontSize: 9
						}
					: {}
			],
			styles: {
				sectionLabel: { fontSize: 10, bold: true, margin: [0, 0, 0, 5] },
				companyName: { fontSize: 11, bold: true, margin: [0, 0, 0, 2] },
				tableHeader: {
					bold: true,
					fontSize: 10,
					color: 'black',
					fillColor: '#eeeeee',
					alignment: 'center'
				},
				totalLabel: { bold: true, alignment: 'right' },
				totalValue: { alignment: 'right' },
				totalLabelBold: { bold: true, alignment: 'right', fontSize: 11 },
				totalValueBold: { bold: true, alignment: 'right', fontSize: 11 }
			},
			defaultStyle: { fontSize: 10, font: 'Times' }
		};
	}
};
