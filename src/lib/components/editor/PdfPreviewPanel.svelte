<script lang="ts">
	import { invoiceStore } from '$lib/stores/invoice.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { cn } from '$lib/utils';
	import { Sparkles, Scroll, Terminal, Zap } from '@lucide/svelte';

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

	// Template-specific styling
	const template = $derived(invoiceStore.invoice.template);

	const isModern = $derived(template === 'modern');
	const isClassic = $derived(template === 'classic');
	const isTech = $derived(template === 'tech');
	const isBold = $derived(template === 'bold');

	const templateConfig = $derived({
		icon: isClassic ? Scroll : isTech ? Terminal : isBold ? Zap : Sparkles,
		name: isClassic ? 'Classic' : isTech ? 'Tech' : isBold ? 'Bold' : 'Modern',
		colors: {
			accent: isTech ? 'text-emerald-500' : isBold ? 'text-slate-900' : 'text-primary'
		}
	});
</script>

<div
	class="flex h-full flex-col bg-slate-100 p-4 transition-colors duration-500 md:p-6 lg:p-8 dark:bg-slate-900/50"
>
	<!-- Template Indicator Badge -->
	<div class="mb-4 flex justify-center">
		<Badge variant="outline" class="bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
			<templateConfig.icon class="mr-1.5 h-3.5 w-3.5" />
			Style: {templateConfig.name}
		</Badge>
	</div>

	<!-- Invoice Document -->
	<div
		class={cn(
			'mx-auto w-full max-w-2xl flex-1 overflow-auto rounded-lg border border-border bg-white shadow-lg transition-all duration-300 dark:bg-card',
			isClassic && 'font-serif',
			isTech && 'border-2 border-slate-900 font-mono',
			isBold && 'border-t-12 border-slate-900'
		)}
	>
		<div class="p-6 md:p-8">
			<!-- Header -->
			<div
				class={cn(
					'mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
					isClassic && 'border-b-2 border-double border-slate-200 pb-6',
					isBold && '-mx-8 -mt-8 bg-slate-900 p-8 text-white'
				)}
			>
				<div>
					{#if invoiceStore.invoice.senderData?.logo}
						<div class="mb-4">
							<img
								src={invoiceStore.invoice.senderData.logo}
								alt="Business Logo"
								class="h-16 w-auto object-contain"
							/>
						</div>
					{/if}
					<p
						class={cn(
							'text-xs font-medium tracking-wider text-muted-foreground uppercase',
							isBold && 'text-slate-400'
						)}
					>
						Invoice
					</p>
					<p class={cn('text-2xl font-bold', isModern && 'font-mono', isBold && 'text-3xl')}>
						{invoiceStore.invoice.number || 'INV-001'}
					</p>
				</div>
				<div class="text-right">
					<Badge
						variant={getStatusVariant(invoiceStore.invoice.status)}
						class={cn('capitalize', isBold && 'bg-white text-slate-900')}
					>
						{invoiceStore.invoice.status}
					</Badge>
				</div>
			</div>

			<!-- Sender & Client Info -->
			<div class={cn('mb-6 grid gap-6 sm:grid-cols-2', isClassic && 'rounded-md border p-4')}>
				<div>
					<p
						class={cn(
							'mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase',
							isTech && 'text-emerald-600 before:content-["//_"]'
						)}
					>
						From
					</p>
					<p class={cn('font-semibold', isClassic && 'text-lg italic')}>
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
				</div>
				<div>
					<p
						class={cn(
							'mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase',
							isTech && 'text-emerald-600 before:content-["//_"]'
						)}
					>
						Bill To
					</p>
					<p class={cn('font-semibold', isClassic && 'text-lg italic')}>
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
					{#if invoiceStore.invoice.clientSnapshot?.taxId}
						<p class="text-sm text-muted-foreground">
							Tax ID: {invoiceStore.invoice.clientSnapshot.taxId}
						</p>
					{/if}
				</div>
			</div>

			<!-- Invoice Dates -->
			<div
				class={cn(
					'mb-6 grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4 sm:grid-cols-4',
					isTech && 'border-y border-dashed border-emerald-500 bg-transparent',
					isClassic && 'rounded-none border-y border-slate-200 '
				)}
			>
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

			<Separator class={cn('my-6', isTech && 'border-dashed border-emerald-200')} />

			<!-- Line Items -->
			<div class="mb-6">
				<table class="w-full text-sm">
					<thead>
						<tr
							class={cn(
								'border-b border-border text-left',
								isBold && '',
								isTech && 'border-emerald-500'
							)}
						>
							<th class={cn('pb-3 font-medium text-muted-foreground', isBold && 'p-2')}>
								Description
							</th>
							<th class={cn('pb-3 text-right font-medium text-muted-foreground', isBold && 'p-2')}>
								Qty
							</th>
							<th
								class={cn(
									'hidden pb-3 text-right font-medium text-muted-foreground sm:table-cell',
									isBold && 'p-2'
								)}
							>
								Rate
							</th>
							<th class={cn('pb-3 text-right font-medium text-muted-foreground', isBold && 'p-2')}>
								Amount
							</th>
						</tr>
					</thead>
					<tbody>
						{#each invoiceStore.invoice.lineItems as item (item.description)}
							<tr class={cn('border-b border-border/50', isTech && 'border-dashed')}>
								<td class="py-3">
									<p class="font-medium">{item.description || 'Service'}</p>
									<p class="text-xs text-muted-foreground sm:hidden">
										{item.quantity} × {invoiceStore.invoice.currency}
										{formatCurrency(item.rate)}
									</p>
								</td>
								<td class="py-3 text-right">{item.quantity}</td>
								<td class="hidden py-3 text-right sm:table-cell">
									{invoiceStore.invoice.currency}
									{formatCurrency(item.rate)}
								</td>
								<td class="py-3 text-right font-medium">
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
				<div
					class={cn('w-full space-y-2 sm:w-64', isClassic && 'border-t-2 border-slate-900 pt-4')}
				>
					<div class="flex justify-between text-sm">
						<span class="text-muted-foreground">Subtotal</span>
						<span>
							{invoiceStore.invoice.currency}
							{formatCurrency(invoiceStore.subtotal)}
						</span>
					</div>
					{#if invoiceStore.taxTotal > 0}
						<div class="flex justify-between text-sm">
							<span class="text-muted-foreground">Tax</span>
							<span>
								{invoiceStore.invoice.currency}
								{formatCurrency(invoiceStore.taxTotal)}
							</span>
						</div>
					{/if}
					{#if invoiceStore.discountAmount > 0}
						<div class="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
							<span>Discount</span>
							<span>
								-{invoiceStore.invoice.currency}
								{formatCurrency(invoiceStore.discountAmount)}
							</span>
						</div>
					{/if}
					<Separator class={cn(isTech && 'border-emerald-500')} />
					<div class="flex justify-between">
						<span class="font-semibold">Total Due</span>
						<span class={cn('text-xl font-bold', templateConfig.colors.accent)}>
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
