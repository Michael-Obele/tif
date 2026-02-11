/* eslint-disable @typescript-eslint/no-explicit-any */
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import type { Invoice } from '$lib/types';
import { getTemplate } from '$lib/pdf/templates';
import type { TemplateContext, InvoiceTotals } from '$lib/pdf/types';

// Initialize pdfMake with fonts
(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || pdfFonts;

// Define default fonts if needed
(pdfMake as any).fonts = {
	Roboto: {
		normal: 'Roboto-Regular.ttf',
		bold: 'Roboto-Medium.ttf',
		italics: 'Roboto-Italic.ttf',
		bolditalics: 'Roboto-MediumItalic.ttf'
	}
};

/**
 * Generate and download invoice PDF
 */
export function generateInvoicePdf(invoice: Invoice, totals: InvoiceTotals): void {
	console.log('[PDF Generator] Starting PDF generation...', { invoice, totals });

	const template = getTemplate(invoice.template as any);
	const ctx: TemplateContext = { invoice, totals };

	// Generate definition from template
	const templateOutput = template.generate(ctx);

	// Merge with base definition
	const docDefinition: any = {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		...templateOutput,
		info: {
			title: `Invoice ${invoice.number}`,
			author: invoice.senderData?.businessName
		}
	};

	console.log(`[PDF Generator] Generated definition using template: ${template.name}`);

	try {
		pdfMake.createPdf(docDefinition).download(`${invoice.number || 'invoice'}.pdf`);
		console.log('[PDF Generator] PDF download triggered successfully');
	} catch (error) {
		console.error('[PDF Generator] Error generating PDF:', error);
		throw error;
	}
}
