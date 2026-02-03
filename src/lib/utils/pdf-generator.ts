/* eslint-disable @typescript-eslint/no-explicit-any */
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import type { Invoice } from '$lib/types';

// Initialize pdfMake with fonts
(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || pdfFonts;

interface InvoiceTotals {
    subtotal: number;
    taxTotal: number;
    discountAmount: number;
    total: number;
}

/**
 * Format a number as currency
 */
function formatCurrency(amount: number, currency: string): string {
    return `${currency} ${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

/**
 * Format a date for display
 */
function formatDate(date: Date | undefined): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Generate and download invoice PDF
 */
export function generateInvoicePdf(invoice: Invoice, totals: InvoiceTotals): void {
    console.log('[PDF Generator] Starting PDF generation...', { invoice, totals });

    const { currency, senderData, clientSnapshot, lineItems } = invoice;

    // Build line items table body
    const tableBody: any[][] = [
        // Header row
        [
            { text: 'Description', style: 'tableHeader' },
            { text: 'Qty', style: 'tableHeader', alignment: 'center' as const },
            { text: 'Rate', style: 'tableHeader', alignment: 'right' as const },
            { text: 'Amount', style: 'tableHeader', alignment: 'right' as const }
        ]
    ];

    // Add line items
    lineItems.forEach((item) => {
        const amount = item.quantity * item.rate;
        tableBody.push([
            { text: item.description || 'Service', margin: [0, 5, 0, 5] },
            { text: String(item.quantity), alignment: 'center' as const, margin: [0, 5, 0, 5] },
            {
                text: formatCurrency(item.rate, currency),
                alignment: 'right' as const,
                margin: [0, 5, 0, 5]
            },
            {
                text: formatCurrency(amount, currency),
                alignment: 'right' as const,
                margin: [0, 5, 0, 5]
            }
        ]);
    });

    // Build totals stack
    const totalsStack: any[] = [
        {
            columns: [
                { text: 'Subtotal', color: '#666' },
                { text: formatCurrency(totals.subtotal, currency), alignment: 'right' as const }
            ],
            margin: [0, 15, 0, 5]
        }
    ];

    if (totals.taxTotal > 0) {
        totalsStack.push({
            columns: [
                { text: 'Tax', color: '#666' },
                { text: formatCurrency(totals.taxTotal, currency), alignment: 'right' as const }
            ],
            margin: [0, 0, 0, 5]
        });
    }

    if (totals.discountAmount > 0) {
        totalsStack.push({
            columns: [
                { text: 'Discount', color: '#16a34a' },
                {
                    text: `-${formatCurrency(totals.discountAmount, currency)}`,
                    alignment: 'right' as const,
                    color: '#16a34a'
                }
            ],
            margin: [0, 0, 0, 5]
        });
    }

    totalsStack.push(
        {
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 1 }],
            margin: [0, 5, 0, 5]
        },
        {
            columns: [
                { text: 'Total Due', bold: true, fontSize: 12 },
                {
                    text: formatCurrency(totals.total, currency),
                    alignment: 'right' as const,
                    bold: true,
                    fontSize: 14,
                    color: '#4F46E5'
                }
            ]
        }
    );

    // Build content array
    const content: any[] = [
        // Header with Invoice Number
        {
            columns: [
                {
                    stack: [
                        { text: 'INVOICE', style: 'invoiceLabel' },
                        { text: invoice.number || 'INV-001', style: 'invoiceNumber' }
                    ]
                },
                {
                    stack: [
                        { text: formatDate(invoice.issueDate), alignment: 'right' as const, color: '#666' },
                        {
                            text: `Due: ${formatDate(invoice.dueDate)}`,
                            alignment: 'right' as const,
                            color: '#666',
                            margin: [0, 5, 0, 0]
                        }
                    ]
                }
            ],
            margin: [0, 0, 0, 30]
        },

        // Sender and Client Info
        {
            columns: [
                {
                    width: '50%',
                    stack: [
                        { text: 'From', style: 'sectionLabel' },
                        { text: senderData?.businessName || 'Your Business', style: 'companyName' },
                        { text: senderData?.address || '', color: '#666', margin: [0, 5, 0, 0] },
                        { text: senderData?.email || '', color: '#666' },
                        { text: senderData?.phone || '', color: '#666' }
                    ]
                },
                {
                    width: '50%',
                    stack: [
                        { text: 'Bill To', style: 'sectionLabel' },
                        { text: clientSnapshot?.name || 'Client Name', style: 'companyName' },
                        { text: clientSnapshot?.company || '', color: '#444' },
                        { text: clientSnapshot?.address || '', color: '#666', margin: [0, 5, 0, 0] },
                        { text: clientSnapshot?.email || '', color: '#666' }
                    ]
                }
            ],
            margin: [0, 0, 0, 30]
        },

        // Line Items Table
        {
            table: {
                headerRows: 1,
                widths: ['*', 50, 80, 80],
                body: tableBody
            },
            layout: {
                hLineWidth: (i: number, node: any) =>
                    i === 0 || i === 1 || i === node.table.body.length ? 1 : 0,
                vLineWidth: () => 0,
                hLineColor: () => '#e5e7eb',
                paddingTop: () => 8,
                paddingBottom: () => 8
            }
        },

        // Totals Section
        {
            columns: [
                { width: '*', text: '' },
                {
                    width: 200,
                    stack: totalsStack
                }
            ]
        }
    ];

    // Add notes if present
    if (invoice.notes) {
        content.push({
            stack: [
                { text: 'Notes', style: 'sectionLabel', margin: [0, 30, 0, 5] },
                { text: invoice.notes, color: '#666' }
            ]
        });
    }

    // Add terms if present
    if (invoice.terms) {
        content.push({
            stack: [
                { text: 'Terms & Conditions', style: 'sectionLabel', margin: [0, 20, 0, 5] },
                { text: invoice.terms, color: '#666', fontSize: 9 }
            ]
        });
    }

    // Document definition
    const docDefinition: any = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        content,
        styles: {
            invoiceLabel: {
                fontSize: 10,
                color: '#666',
                bold: true
            },
            invoiceNumber: {
                fontSize: 24,
                bold: true,
                color: '#1e293b'
            },
            sectionLabel: {
                fontSize: 9,
                color: '#9ca3af',
                bold: true,
                margin: [0, 0, 0, 5]
            },
            companyName: {
                fontSize: 12,
                bold: true,
                color: '#1e293b'
            },
            tableHeader: {
                bold: true,
                fontSize: 10,
                color: '#6b7280',
                fillColor: '#f9fafb',
                margin: [0, 8, 0, 8]
            }
        },
        defaultStyle: {
            fontSize: 10,
            color: '#374151'
        }
    };

    console.log('[PDF Generator] Document definition created, generating PDF...');

    try {
        pdfMake.createPdf(docDefinition).download(`${invoice.number || 'invoice'}.pdf`);
        console.log('[PDF Generator] PDF download triggered successfully');
    } catch (error) {
        console.error('[PDF Generator] Error generating PDF:', error);
        throw error;
    }
}
