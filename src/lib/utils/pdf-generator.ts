/* eslint-disable @typescript-eslint/no-explicit-any */
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import type { Invoice } from '$lib/types';
import { getTemplate } from '$lib/pdf/templates';
import type { TemplateContext, InvoiceTotals } from '$lib/pdf/types';

// Initialize pdfMake with built-in fonts from vfs_fonts
const vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs || pdfFonts;
(pdfMake as any).vfs = vfs;

// Map font family names to Roboto variants which are in vfs_fonts
// This prevents errors trying to load non-existent AFM files for standard fonts
(pdfMake as any).fonts = {
	Roboto: {
		normal: 'Roboto-Regular.ttf',
		bold: 'Roboto-Medium.ttf',
		italics: 'Roboto-Italic.ttf',
		bolditalics: 'Roboto-MediumItalic.ttf'
	},
	Times: {
		normal: 'Roboto-Regular.ttf',
		bold: 'Roboto-Medium.ttf',
		italics: 'Roboto-Italic.ttf',
		bolditalics: 'Roboto-MediumItalic.ttf'
	},
	Courier: {
		normal: 'Roboto-Regular.ttf',
		bold: 'Roboto-Medium.ttf',
		italics: 'Roboto-Italic.ttf',
		bolditalics: 'Roboto-MediumItalic.ttf'
	},
	Helvetica: {
		normal: 'Roboto-Regular.ttf',
		bold: 'Roboto-Medium.ttf',
		italics: 'Roboto-Italic.ttf',
		bolditalics: 'Roboto-MediumItalic.ttf'
	}
};

export interface PdfOptions {
	action: 'download' | 'open' | 'print';
	filename?: string;
	targetWindow?: Window | null;
}

export async function generateInvoicePdf(
	invoice: Invoice,
	totals: InvoiceTotals,
	options: PdfOptions = { action: 'download' }
): Promise<void> {
	console.log('[PDF Generator] Starting PDF generation...', { invoice, totals, options });

	// Ensure images are ready (convert blobs to base64)
	await prepareImages(invoice);

	const template = getTemplate(invoice.template as any);
	const ctx: TemplateContext = { invoice, totals };

	// Generate definition from template
	const templateOutput = template.generate(ctx);
	console.log('[PDF Generator] Template output generated:', templateOutput);

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
		console.log('[PDF Generator] Creating PDF document...');
		const pdfDoc = pdfMake.createPdf(docDefinition);
		console.log('[PDF Generator] PDF document created successfully');

		const filename = options.filename || `${invoice.number || 'invoice'}.pdf`;

		// Use pdfMake's built-in methods directly
		if (options.action === 'download') {
			console.log('[PDF Generator] Triggering PDF download...');
			pdfDoc.download(filename);
			console.log('[PDF Generator] PDF download triggered successfully');
		} else if (options.action === 'open') {
			console.log('[PDF Generator] Opening PDF in new tab...');
			pdfDoc.open();
			console.log('[PDF Generator] PDF opened in new tab');
		} else if (options.action === 'print') {
			console.log('[PDF Generator] Opening PDF print dialog...');
			pdfDoc.print();
			console.log('[PDF Generator] PDF print dialog opened');
		}
	} catch (error) {
		console.error('[PDF Generator] Error generating PDF:', error);
		if (options.targetWindow) options.targetWindow.close();
		throw error; // Re-throw to be caught by UI
	}
}

/**
 * Pre-processes the invoice data to prepare images for pdfmake.
 * Converts Blob URLs to Base64 data URIs.
 */
async function prepareImages(invoice: Invoice): Promise<void> {
	if (invoice.senderData?.logo) {
		try {
			const logo = invoice.senderData.logo;
			// If it's a blob URL, fetch and convert
			if (logo.startsWith('blob:')) {
				const response = await fetch(logo);
				const blob = await response.blob();
				const base64 = await new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onloadend = () => resolve(reader.result as string);
					reader.onerror = reject;
					reader.readAsDataURL(blob);
				});
				invoice.senderData.logo = base64;
			}
		} catch (error) {
			console.warn('[PDF Generator] Failed to process logo image:', error);
			// Don't fail generation, just might show broken image
		}
	}
}
