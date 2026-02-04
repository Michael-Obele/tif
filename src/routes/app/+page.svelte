<script lang="ts">
	import EditorForm from '$lib/components/editor/EditorForm.svelte';
	import PdfPreviewPanel from '$lib/components/editor/PdfPreviewPanel.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Download, Eye, Loader2 } from '@lucide/svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import { invoiceStore } from '$lib/stores/invoice.svelte';
	import { generateInvoicePdf } from '$lib/utils/pdf-generator';
	import { browser } from '$app/environment';

	import * as Select from '$lib/components/ui/select';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let isGenerating = $state(false);

	const statuses = [
		{ value: 'draft', label: 'Draft' },
		{ value: 'sent', label: 'Sent' },
		{ value: 'paid', label: 'Paid' },
		{ value: 'overdue', label: 'Overdue' }
	];

	const triggerContent = $derived(
		statuses.find((s) => s.value === invoiceStore.invoice.status)?.label ?? 'Status'
	);

	async function handleDownloadPdf() {
		if (isGenerating) return;

		try {
			isGenerating = true;
			console.log('[App] Generating PDF...');

			const totals = {
				subtotal: invoiceStore.subtotal,
				taxTotal: invoiceStore.taxTotal,
				discountAmount: invoiceStore.discountAmount,
				total: invoiceStore.total
			};

			generateInvoicePdf(invoiceStore.invoice, totals);
			toast.success('PDF downloaded successfully');
			console.log('[App] PDF generation complete');
		} catch (error) {
			console.error('[App] Error generating PDF:', error);
			toast.error('Failed to generate PDF');
		} finally {
			isGenerating = false;
		}
	}

	async function handleSave() {
		try {
			await invoiceStore.saveInvoiceAndCreateNew();
			toast.success('Invoice saved to history', {
				action: {
					label: 'View',
					onClick: () => goto('/app/history')
				}
			});
		} catch (error) {
			console.error('[App] Error saving invoice:', error);
			toast.error('Failed to save invoice');
		}
	}
</script>

<div class="relative flex h-[calc(100vh-3.5rem)] flex-col bg-background md:flex-row">
	<!-- Left Panel: Editor -->
	<div class="w-full overflow-y-auto border-r bg-background pb-20 md:w-1/2 md:pb-0 lg:w-5/12">
		<EditorForm />
	</div>

	<!-- Right Panel: Preview (Desktop) -->
	<div class="hidden flex-col bg-muted/10 md:flex md:w-1/2 lg:w-7/12">
		<div class="flex items-center justify-between border-b bg-background px-6 py-2">
			<div class="flex items-center gap-2">
				<span class="text-sm font-medium">Preview</span>
				{#if invoiceStore.isSaving}
					<span class="flex items-center gap-1 text-xs text-muted-foreground">
						<Loader2 class="h-3 w-3 animate-spin" />
						Saving...
					</span>
				{:else if invoiceStore.lastSaved}
					<span class="text-xs text-muted-foreground">
						Saved {invoiceStore.lastSaved.toLocaleTimeString()}
					</span>
				{/if}
			</div>
			<div class="flex items-center gap-2">
				<div class="w-32">
					<Select.Root type="single" bind:value={invoiceStore.invoice.status}>
						<Select.Trigger class="h-8" placeholder="Status">
							{triggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="draft">Draft</Select.Item>
							<Select.Item value="sent">Sent</Select.Item>
							<Select.Item value="paid">Paid</Select.Item>
							<Select.Item value="overdue">Overdue</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
				<Button size="sm" variant="outline" onclick={handleDownloadPdf} disabled={isGenerating}>
					{#if isGenerating}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Generating...
					{:else}
						<Download class="mr-2 h-4 w-4" />
						Download PDF
					{/if}
				</Button>
				<Button variant="secondary" size="sm" onclick={handleSave} disabled={invoiceStore.isSaving}>
					{#if invoiceStore.isSaving}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Saving...
					{:else}
						<span class="flex items-center gap-2"> Save to History </span>
					{/if}
				</Button>
			</div>
		</div>
		<div class="flex flex-1 justify-center overflow-y-auto bg-slate-100 p-8 dark:bg-slate-900/50">
			<div class="w-full max-w-[210mm]">
				<PdfPreviewPanel />
			</div>
		</div>
	</div>

	<!-- Mobile Sticky Footer -->
	<div class="fixed right-0 bottom-0 left-0 z-10 flex gap-4 border-t bg-background p-4 md:hidden">
		<Sheet.Root>
			<Sheet.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" class="flex-1" {...props}>
						<Eye class="mr-2 h-4 w-4" /> Preview
					</Button>
				{/snippet}
			</Sheet.Trigger>
			<Sheet.Content side="bottom" class="h-[90vh] sm:h-[90vh]">
				<Sheet.Header>
					<Sheet.Title>Invoice Preview</Sheet.Title>
				</Sheet.Header>
				<div class="h-full overflow-y-auto py-4">
					<PdfPreviewPanel />
				</div>
			</Sheet.Content>
		</Sheet.Root>

		<Button class="flex-1" onclick={handleDownloadPdf} disabled={isGenerating}>
			{#if isGenerating}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				Generating...
			{:else}
				<Download class="mr-2 h-4 w-4" />
				Download
			{/if}
		</Button>
		<Button
			variant="secondary"
			class="flex-1"
			onclick={handleSave}
			disabled={invoiceStore.isSaving}
		>
			{#if invoiceStore.isSaving}
				<Loader2 class="h-4 w-4 animate-spin" />
			{:else}
				Save
			{/if}
		</Button>
	</div>
</div>
