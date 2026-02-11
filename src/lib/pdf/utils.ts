/**
 * Format a number as currency
 */
export function formatCurrency(amount: number, currency: string): string {
	return `${currency} ${amount.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	})}`;
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | undefined | string): string {
	if (!date) return '—';
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}
