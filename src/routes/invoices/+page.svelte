<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		Search,
		Plus,
		MoreHorizontal,
		FileText,
		Trash2,
		Copy,
		Download,
		ArrowUpDown,
		ChevronRight
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Select from '$lib/components/ui/select';
	import { invoiceStore } from '$lib/stores/invoice.svelte';
	import type { Invoice, InvoiceStatus } from '$lib/types';
	import { generateInvoicePdf } from '$lib/utils/pdf-generator';

	let invoices = $state<Invoice[]>([]);
	let isLoading = $state(true);
	let searchQuery = $state('');
	let statusFilter = $state<string>('all');
	let sortField = $state<'date' | 'amount'>('date');
	let sortDirection = $state<'asc' | 'desc'>('desc');

	// Derived state for filtering and sorting
	const filteredInvoices = $derived.by(() => {
		let filtered = invoices.filter((inv) => {
			const matchesSearch =
				(inv.number?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
				(inv.clientSnapshot?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
				(inv.senderData?.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

			const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;

			return matchesSearch && matchesStatus;
		});

		return filtered.sort((a, b) => {
			if (sortField === 'date') {
				const dateA = new Date(a.issueDate || 0).getTime();
				const dateB = new Date(b.issueDate || 0).getTime();
				return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
			} else {
				const amountA = calculateTotal(a);
				const amountB = calculateTotal(b);
				return sortDirection === 'asc' ? amountA - amountB : amountB - amountA;
			}
		});
	});

	onMount(async () => {
		isLoading = true;
		invoices = await invoiceStore.getHistory();
		isLoading = false;
	});

	function calculateTotal(invoice: Invoice): number {
		if (!invoice.lineItems) return 0;

		const subtotal = invoice.lineItems.reduce((acc, item) => {
			return acc + item.quantity * item.rate;
		}, 0);

		// Calculate Discount
		let discountAmount = 0;
		if (invoice.discount?.type === 'fixed') {
			discountAmount = invoice.discount.value;
		} else if (invoice.discount?.type === 'percentage') {
			discountAmount = subtotal * (invoice.discount.value / 100);
		}

		// Calculate Tax
		// Tax is usually applied to the subtotal (sometimes post-discount, depends on locale)
		// Based on editor logic, let's assume simple tax on lines
		const taxTotal = invoice.lineItems.reduce((acc, item) => {
			const lineAmount = item.quantity * item.rate;
			return acc + lineAmount * (item.taxRate / 100);
		}, 0);

		return Math.max(0, subtotal - discountAmount + taxTotal);
	}

	function getStatusVariant(
		status: InvoiceStatus
	): 'default' | 'secondary' | 'destructive' | 'outline' {
		switch (status) {
			case 'paid':
				return 'default'; // Using default for paid (usually primary color or green in theme)
			case 'sent':
				return 'secondary';
			case 'overdue':
				return 'destructive';
			case 'draft':
				return 'outline';
			case 'cancelled':
				return 'secondary';
			default:
				return 'outline';
		}
	}

	function formatDate(date: Date | undefined | string): string {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function formatCurrency(amount: number, currency: string): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency || 'USD'
		}).format(amount);
	}

	async function handleOpen(invoiceId: number | undefined) {
		if (!invoiceId) return;
		const success = await invoiceStore.loadInvoiceFromHistory(invoiceId);
		if (success) {
			goto('/invoice/new');
		}
	}

	async function handleDelete(invoiceId: number | undefined) {
		if (!invoiceId || !confirm('Are you sure you want to delete this invoice?')) return;
		const success = await invoiceStore.deleteInvoice(invoiceId);
		if (success) {
			invoices = invoices.filter((inv) => inv.id !== invoiceId);
		}
	}

	async function handleDownload(invoice: Invoice) {
		const total = calculateTotal(invoice);
		// Need to roughly calculate components for PDF generator if it requires them separate
		// But wait, the generateInvoicePdf takes { subtotal, taxTotal... }
		const subtotal = invoice.lineItems.reduce((acc, item) => acc + item.quantity * item.rate, 0);
		const taxTotal = invoice.lineItems.reduce(
			(acc, item) => acc + item.quantity * item.rate * (item.taxRate / 100),
			0
		);

		let discountAmount = 0;
		if (invoice.discount?.type === 'fixed') {
			discountAmount = invoice.discount.value;
		} else if (invoice.discount?.type === 'percentage') {
			discountAmount = subtotal * (invoice.discount.value / 100);
		}

		generateInvoicePdf(invoice, {
			subtotal,
			taxTotal,
			discountAmount,
			total
		});
	}

	async function handleDuplicate(invoice: Invoice) {
		// Load logic similar to open, but clear ID and set new number/dates
		if (!invoice.id) return;
		const success = await invoiceStore.loadInvoiceFromHistory(invoice.id);
		if (success) {
			// Basic duplication logic via store mutations would be ideal,
			// but since store is singleton, we modify it after load
			// Ideally store should have 'duplicateInvoice' action.
			// For now, let's just open it and let user save as new.
			// Or better:
			invoiceStore.invoice.id = undefined;
			invoiceStore.invoice.number = `${invoiceStore.invoice.number}-COPY`;
			invoiceStore.invoice.issueDate = new Date();
			invoiceStore.invoice.isDraft = true;
			invoiceStore.invoice.status = 'draft';
			goto('/invoice/new');
		}
	}
</script>

<svelte:head>
	<title>Invoice History | Tech Invoice Forge</title>
	<meta
		name="description"
		content="Access and manage your previously created invoices. All stored locally in your browser for privacy."
	/>
	<meta property="og:title" content="Invoice History | Tech Invoice Forge" />
	<meta
		property="og:description"
		content="Access and manage your previously created invoices locally."
	/>
</svelte:head>

<div class="container mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-6">
	<div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Invoice History</h1>
			<p class="mt-1 text-muted-foreground">Manage and track your generated invoices.</p>
		</div>
		<Button onclick={() => goto('/invoice/new')}>
			<Plus class="mr-2 h-4 w-4" />
			New Invoice
		</Button>
	</div>

	<div
		class="flex flex-col items-center justify-between gap-4 rounded-lg border bg-card p-4 shadow-sm sm:flex-row"
	>
		<div class="relative w-full sm:max-w-sm">
			<Search class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
			<Input placeholder="Search client, number..." class="pl-11" bind:value={searchQuery} />
		</div>
		<div class="flex w-full flex-wrap items-center gap-2 sm:w-auto">
			<Select.Root type="single" bind:value={statusFilter}>
				<Select.Trigger class="w-35">
					{statusFilter === 'all'
						? 'All Status'
						: statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="all">All Status</Select.Item>
					<Select.Item value="draft">Draft</Select.Item>
					<Select.Item value="sent">Sent</Select.Item>
					<Select.Item value="paid">Paid</Select.Item>
					<Select.Item value="overdue">Overdue</Select.Item>
					<Select.Item value="cancelled">Cancelled</Select.Item>
				</Select.Content>
			</Select.Root>

			<Select.Root type="single" bind:value={sortField}>
				<Select.Trigger class="w-35">
					<ArrowUpDown class="mr-2 h-3 w-3 text-muted-foreground" />
					{sortField === 'date' ? 'Date' : 'Amount'}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="date">Date</Select.Item>
					<Select.Item value="amount">Amount</Select.Item>
				</Select.Content>
			</Select.Root>

			<Button
				variant="outline"
				size="icon"
				onclick={() => (sortDirection = sortDirection === 'asc' ? 'desc' : 'asc')}
			>
				<ArrowUpDown
					class="h-4 w-4 {sortDirection === 'asc' ? 'rotate-180' : ''} transition-transform"
				/>
			</Button>
		</div>
	</div>

	{#if isLoading}
		<div class="space-y-4">
			{#each Array(3) as _}
				<div class="h-16 w-full animate-pulse rounded-lg bg-muted"></div>
			{/each}
		</div>
	{:else if filteredInvoices.length === 0}
		<div
			class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center"
		>
			<div class="mb-4 rounded-full bg-muted p-4">
				<FileText class="h-8 w-8 text-muted-foreground" />
			</div>
			<h3 class="text-lg font-semibold">No invoices found</h3>
			<p class="mt-2 mb-6 max-w-sm text-muted-foreground">
				{searchQuery
					? 'Try adjusting your search or filters.'
					: 'Create your first invoice to get started.'}
			</p>
			{#if !searchQuery && statusFilter === 'all'}
				<Button onclick={() => goto('/invoice/new')}>Create Invoice</Button>
			{/if}
		</div>
	{:else}
		<!-- Desktop Table -->
		<div class="hidden rounded-md border bg-card md:block">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Status</Table.Head>
						<Table.Head>Number</Table.Head>
						<Table.Head>Client</Table.Head>
						<Table.Head>Date</Table.Head>
						<Table.Head class="text-right">Amount</Table.Head>
						<Table.Head class="w-12.5"></Table.Head>
						<Table.Head class="w-12.5"></Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each filteredInvoices as invoice (invoice.id ?? invoice.number)}
						<Table.Row
							class="group cursor-pointer hover:bg-muted/50"
							onclick={() => handleOpen(invoice.id)}
						>
							<Table.Cell>
								<Badge variant={getStatusVariant(invoice.status)} class="capitalize">
									{invoice.status}
								</Badge>
							</Table.Cell>
							<Table.Cell class="font-medium">{invoice.number}</Table.Cell>
							<Table.Cell>
								<div class="flex flex-col">
									<span class="font-medium">{invoice.clientSnapshot?.name || 'Unknown'}</span>
									<span class="text-xs text-muted-foreground"
										>{invoice.clientSnapshot?.company || ''}</span
									>
								</div>
							</Table.Cell>
							<Table.Cell class="text-muted-foreground">
								{formatDate(invoice.issueDate)}
							</Table.Cell>
							<Table.Cell class="text-right font-medium">
								{formatCurrency(calculateTotal(invoice), invoice.currency)}
							</Table.Cell>
							<Table.Cell>
								<ChevronRight
									class="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-1 group-hover:text-foreground"
								/>
							</Table.Cell>
							<Table.Cell>
								<DropdownMenu.Root>
									<DropdownMenu.Trigger
										class="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
									>
										{#snippet child({ props })}
											<Button variant="ghost" size="icon" class="h-8 w-8" {...props}>
												<MoreHorizontal class="h-4 w-4" />
												<span class="sr-only">Menu</span>
											</Button>
										{/snippet}
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="end">
										<DropdownMenu.Item onclick={() => handleOpen(invoice.id)}>
											<FileText class="mr-2 h-4 w-4" />
											View / Edit
										</DropdownMenu.Item>
										<DropdownMenu.Item onclick={() => handleDuplicate(invoice)}>
											<Copy class="mr-2 h-4 w-4" />
											Duplicate
										</DropdownMenu.Item>
										<DropdownMenu.Item onclick={() => handleDownload(invoice)}>
											<Download class="mr-2 h-4 w-4" />
											Download PDF
										</DropdownMenu.Item>
										<DropdownMenu.Separator />
										<DropdownMenu.Item
											class="text-destructive focus:text-destructive"
											onclick={() => handleDelete(invoice.id)}
										>
											<Trash2 class="mr-2 h-4 w-4" />
											Delete
										</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>

		<!-- Mobile Cards -->
		<div class="space-y-4 md:hidden">
			{#each filteredInvoices as invoice (invoice.id ?? invoice.number)}
				<Card.Root>
					<Card.Header class="pb-2">
						<div class="flex items-start justify-between">
							<div class="space-y-1">
								<Card.Title>{invoice.number}</Card.Title>
								<Card.Description>{formatDate(invoice.issueDate)}</Card.Description>
							</div>
							<Badge variant={getStatusVariant(invoice.status)} class="capitalize">
								{invoice.status}
							</Badge>
						</div>
					</Card.Header>
					<Card.Content class="pb-2">
						<div class="mb-2 flex items-center justify-between">
							<span class="text-sm font-medium"
								>{invoice.clientSnapshot?.name || 'Unknown Client'}</span
							>
							<span class="text-lg font-bold">
								{formatCurrency(calculateTotal(invoice), invoice.currency)}
							</span>
						</div>
					</Card.Content>
					<Card.Footer class="flex justify-end gap-2 border-t bg-muted/20 pt-2">
						<Button variant="ghost" size="sm" onclick={() => handleDownload(invoice)}>
							<Download class="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							class="text-destructive"
							onclick={() => handleDelete(invoice.id)}
						>
							<Trash2 class="h-4 w-4" />
						</Button>
						<Button variant="outline" size="sm" onclick={() => handleOpen(invoice.id)}>Open</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>
