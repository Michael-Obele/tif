<script lang="ts">
	import { invoiceStore } from '$lib/stores/invoice.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';

	// Format date for display
	function formatDate(date: Date | undefined): string {
		if (!date) return '—';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	// Format currency
	function formatCurrency(amount: number): string {
		return amount.toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		});
	}

	// Get status badge variant
	function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
		switch (status) {
			case 'paid':
				return 'default';
			case 'sent':
				return 'secondary';
			case 'overdue':
				return 'destructive';
			default:
				return 'outline';
		}
	}
</script>

<div class="flex h-full flex-col bg-slate-100 p-4 md:p-6 lg:p-8 dark:bg-slate-900/50">
	<!-- Invoice Document -->
	<div
		class="mx-auto w-full max-w-2xl flex-1 overflow-auto rounded-lg border border-border bg-white shadow-lg dark:bg-card"
	>
		<div class="p-6 md:p-8">
			<!-- Header -->
			<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">Invoice</p>
					<p class="font-mono text-2xl font-bold">
						{invoiceStore.invoice.number || 'INV-001'}
					</p>
				</div>
				<div class="text-right">
					<Badge variant={getStatusVariant(invoiceStore.invoice.status)} class="capitalize">
						{invoiceStore.invoice.status}
					</Badge>
				</div>
			</div>

			<!-- Sender & Client Info -->
			<div class="mb-6 grid gap-6 sm:grid-cols-2">
				<div>
					<p class="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
						From
					</p>
					<p class="font-semibold">
						{invoiceStore.invoice.senderData?.businessName || 'Your Business Name'}
					</p>
					{#if invoiceStore.invoice.senderData?.address}
						<p class="text-sm whitespace-pre-line text-muted-foreground">
							{invoiceStore.invoice.senderData.address}
						</p>
					{/if}
					{#if invoiceStore.invoice.senderData?.email}
						<p class="text-sm text-muted-foreground">{invoiceStore.invoice.senderData.email}</p>
					{/if}
					{#if invoiceStore.invoice.senderData?.phone}
						<p class="text-sm text-muted-foreground">{invoiceStore.invoice.senderData.phone}</p>
					{/if}
				</div>
				<div>
					<p class="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
						Bill To
					</p>
					<p class="font-semibold">
						{invoiceStore.invoice.clientSnapshot?.name || 'Client Name'}
					</p>
					{#if invoiceStore.invoice.clientSnapshot?.company}
						<p class="text-sm">{invoiceStore.invoice.clientSnapshot.company}</p>
					{/if}
					{#if invoiceStore.invoice.clientSnapshot?.address}
						<p class="text-sm whitespace-pre-line text-muted-foreground">
							{invoiceStore.invoice.clientSnapshot.address}
						</p>
					{/if}
					{#if invoiceStore.invoice.clientSnapshot?.email}
						<p class="text-sm text-muted-foreground">{invoiceStore.invoice.clientSnapshot.email}</p>
					{/if}
				</div>
			</div>

			<!-- Invoice Dates -->
			<div class="mb-6 grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4 sm:grid-cols-4">
				<div>
					<p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
						Issue Date
					</p>
					<p class="font-medium">{formatDate(invoiceStore.invoice.issueDate)}</p>
				</div>
				<div>
					<p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">Due Date</p>
					<p class="font-medium">{formatDate(invoiceStore.invoice.dueDate)}</p>
				</div>
				<div>
					<p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">Currency</p>
					<p class="font-medium">{invoiceStore.invoice.currency}</p>
				</div>
				{#if invoiceStore.invoice.senderData?.taxId}
					<div>
						<p class="text-xs font-medium tracking-wider text-muted-foreground uppercase">Tax ID</p>
						<p class="font-mono text-sm">{invoiceStore.invoice.senderData.taxId}</p>
					</div>
				{/if}
			</div>

			<Separator class="my-6" />

			<!-- Line Items -->
			<div class="mb-6">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-border text-left">
							<th class="pb-3 font-medium text-muted-foreground">Description</th>
							<th class="pb-3 text-right font-medium text-muted-foreground">Qty</th>
							<th class="hidden pb-3 text-right font-medium text-muted-foreground sm:table-cell">
								Rate
							</th>
							<th class="pb-3 text-right font-medium text-muted-foreground">Amount</th>
						</tr>
					</thead>
					<tbody>
						{#each invoiceStore.invoice.lineItems as item}
							<tr class="border-b border-border/50">
								<td class="py-3">
									<p class="font-medium">{item.description || 'Service'}</p>
									<p class="text-xs text-muted-foreground sm:hidden">
										{item.quantity} × {invoiceStore.invoice.currency}
										{formatCurrency(item.rate)}
									</p>
								</td>
								<td class="py-3 text-right font-mono">{item.quantity}</td>
								<td class="hidden py-3 text-right font-mono sm:table-cell">
									{invoiceStore.invoice.currency}
									{formatCurrency(item.rate)}
								</td>
								<td class="py-3 text-right font-mono font-medium">
									{invoiceStore.invoice.currency}
									{formatCurrency(item.quantity * item.rate)}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Totals -->
			<div class="flex justify-end">
				<div class="w-full space-y-2 sm:w-64">
					<div class="flex justify-between text-sm">
						<span class="text-muted-foreground">Subtotal</span>
						<span class="font-mono">
							{invoiceStore.invoice.currency}
							{formatCurrency(invoiceStore.subtotal)}
						</span>
					</div>
					{#if invoiceStore.taxTotal > 0}
						<div class="flex justify-between text-sm">
							<span class="text-muted-foreground">Tax</span>
							<span class="font-mono">
								{invoiceStore.invoice.currency}
								{formatCurrency(invoiceStore.taxTotal)}
							</span>
						</div>
					{/if}
					{#if invoiceStore.discountAmount > 0}
						<div class="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
							<span>Discount</span>
							<span class="font-mono">
								-{invoiceStore.invoice.currency}
								{formatCurrency(invoiceStore.discountAmount)}
							</span>
						</div>
					{/if}
					<Separator />
					<div class="flex justify-between">
						<span class="font-semibold">Total Due</span>
						<span class="font-mono text-xl font-bold text-primary">
							{invoiceStore.invoice.currency}
							{formatCurrency(invoiceStore.total)}
						</span>
					</div>
				</div>
			</div>

			<!-- Notes & Terms -->
			{#if invoiceStore.invoice.notes || invoiceStore.invoice.terms}
				<Separator class="my-6" />
				<div class="space-y-4 text-sm">
					{#if invoiceStore.invoice.notes}
						<div>
							<p class="mb-1 font-medium">Notes</p>
							<p class="whitespace-pre-line text-muted-foreground">{invoiceStore.invoice.notes}</p>
						</div>
					{/if}
					{#if invoiceStore.invoice.terms}
						<div>
							<p class="mb-1 font-medium">Terms & Conditions</p>
							<p class="whitespace-pre-line text-muted-foreground">{invoiceStore.invoice.terms}</p>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
