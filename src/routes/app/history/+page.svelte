<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { ArrowLeft, Trash2, Eye } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { invoiceStore } from '$lib/stores/invoice.svelte';
	import type { Invoice } from '$lib/types';

	let invoices: Invoice[] = $state([]);
	let isLoading = $state(true);
	let selectedInvoices = $state<Set<number>>(new Set());

	onMount(async () => {
		isLoading = true;
		invoices = await invoiceStore.getHistory();
		isLoading = false;
	});

	async function openInvoice(invoiceId: number | undefined) {
		if (!invoiceId) return;
		const success = await invoiceStore.loadInvoiceFromHistory(invoiceId);
		if (success) {
			goto('/app');
		}
	}

	async function deleteInvoice(invoiceId: number | undefined) {
		if (!invoiceId || !confirm('Are you sure you want to delete this invoice?')) return;
		const success = await invoiceStore.deleteInvoice(invoiceId);
		if (success) {
			invoices = invoices.filter((inv) => inv.id !== invoiceId);
			selectedInvoices.delete(invoiceId);
		}
	}

	async function deleteSelected() {
		if (selectedInvoices.size === 0) return;
		if (!confirm(`Delete ${selectedInvoices.size} invoice(s)?`)) return;

		for (const id of selectedInvoices) {
			await invoiceStore.deleteInvoice(id);
		}
		invoices = invoices.filter((inv) => !selectedInvoices.has(inv.id!));
		selectedInvoices.clear();
	}

	function toggleSelectAll() {
		if (selectedInvoices.size === invoices.length) {
			selectedInvoices.clear();
		} else {
			selectedInvoices.clear();
			invoices.forEach((inv) => {
				if (inv.id) selectedInvoices.add(inv.id);
			});
		}
	}

	function toggleSelect(invoiceId: number | undefined) {
		if (!invoiceId) return;
		if (selectedInvoices.has(invoiceId)) {
			selectedInvoices.delete(invoiceId);
		} else {
			selectedInvoices.add(invoiceId);
		}
	}

	function formatDate(date: Date | undefined): string {
		if (!date) return '-';
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		}).format(new Date(date));
	}

	function formatCurrency(amount: number, currency: string): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency
		}).format(amount);
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<Button variant="outline" size="sm" onclick={() => goto('/app')} class="gap-2">
				<ArrowLeft class="h-4 w-4" />
				Back to Editor
			</Button>
			<div>
				<h1 class="text-3xl font-bold tracking-tight">Invoice History</h1>
				<p class="text-muted-foreground">View and manage your saved invoices</p>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<Card>
		<CardHeader>
			<div class="flex items-center justify-between">
				<div>
					<CardTitle>All Invoices</CardTitle>
					<CardDescription>{invoices.length} invoice(s) saved</CardDescription>
				</div>
				{#if selectedInvoices.size > 0}
					<Button variant="destructive" size="sm" onclick={deleteSelected}>
						<Trash2 class="mr-2 h-4 w-4" />
						Delete {selectedInvoices.size}
					</Button>
				{/if}
			</div>
		</CardHeader>

		<CardContent>
			{#if isLoading}
				<div class="py-8 text-center">
					<p class="text-muted-foreground">Loading invoices...</p>
				</div>
			{:else if invoices.length === 0}
				<div class="py-12 text-center">
					<p class="mb-4 text-muted-foreground">No invoices saved yet</p>
					<Button onclick={() => goto('/app')}>Create your first invoice</Button>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead class="w-12">
									<input
										type="checkbox"
										class="rounded border-slate-200"
										checked={selectedInvoices.size === invoices.length && invoices.length > 0}
										onchange={toggleSelectAll}
									/>
								</TableHead>
								<TableHead>Invoice #</TableHead>
								<TableHead>Client</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Total</TableHead>
								<TableHead>Status</TableHead>
								<TableHead class="w-12"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{#each invoices as invoice (invoice.id)}
								<TableRow>
									<TableCell>
										<input
											type="checkbox"
											class="rounded border-slate-200"
											checked={invoice.id ? selectedInvoices.has(invoice.id) : false}
											onchange={() => toggleSelect(invoice.id)}
										/>
									</TableCell>
									<TableCell class="font-medium">{invoice.number}</TableCell>
									<TableCell>{invoice.clientSnapshot?.name || 'Unknown Client'}</TableCell>
									<TableCell>{formatDate(invoice.issueDate)}</TableCell>
									<TableCell
										>{formatCurrency(
											invoice.lineItems.reduce(
												(sum, item) => sum + item.quantity * item.rate * (1 + item.taxRate / 100),
												0
											),
											invoice.currency
										)}</TableCell
									>
									<TableCell>
										<div class="capitalize">
											{#if invoice.status === 'draft'}
												<span
													class="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800"
												>
													Draft
												</span>
											{:else if invoice.status === 'sent'}
												<span
													class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
												>
													Sent
												</span>
											{:else if invoice.status === 'paid'}
												<span
													class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
												>
													Paid
												</span>
											{:else if invoice.status === 'overdue'}
												<span
													class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800"
												>
													Overdue
												</span>
											{/if}
										</div>
									</TableCell>
									<TableCell>
										<div class="flex gap-1">
											<Button
												variant="ghost"
												size="sm"
												onclick={() => openInvoice(invoice.id)}
												title="Open invoice"
											>
												<Eye class="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onclick={() => deleteInvoice(invoice.id)}
												title="Delete invoice"
												class="text-destructive hover:text-destructive"
											>
												<Trash2 class="h-4 w-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					</Table>
				</div>
			{/if}
		</CardContent>
	</Card>
</div>
