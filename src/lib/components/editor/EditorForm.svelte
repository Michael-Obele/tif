<script lang="ts">
	import { invoiceStore } from '$lib/stores/invoice.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { Separator } from '$lib/components/ui/separator';
	import { Badge } from '$lib/components/ui/badge';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import {
		Plus,
		Trash2,
		ChevronDown,
		Building2,
		User,
		FileText,
		Package,
		StickyNote,
		Sparkles,
		Scroll,
		Terminal,
		Zap,
		Dot,
		Clock
	} from '@lucide/svelte';
	import type { Unit, InvoiceStatus } from '$lib/types';
	import { templates } from '$lib/pdf/templates';
	import type { TemplateId } from '$lib/pdf/types';

	// Currency options
	const currencies = [
		{ value: 'USD', label: 'USD ($)' },
		{ value: 'EUR', label: 'EUR (€)' },
		{ value: 'GBP', label: 'GBP (£)' },
		{ value: 'CAD', label: 'CAD ($)' },
		{ value: 'AUD', label: 'AUD ($)' },
		{ value: 'JPY', label: 'JPY (¥)' },
		{ value: 'INR', label: 'INR (₹)' },
		{ value: 'NGN', label: 'NGN (₦)' },
		{ value: 'CHF', label: 'CHF' },
		{ value: 'CNY', label: 'CNY (¥)' },
		{ value: 'BRL', label: 'BRL (R$)' },
		{ value: 'MXN', label: 'MXN ($)' }
	];

	// Unit options
	const units: { value: Unit; label: string }[] = [
		{ value: 'hour', label: 'Hour' },
		{ value: 'day', label: 'Day' },
		{ value: 'unit', label: 'Unit' },
		{ value: 'flat', label: 'Flat Rate' },
		{ value: 'project', label: 'Project' },
		{ value: 'month', label: 'Month' },
		{ value: 'word', label: 'Word' },
		{ value: 'page', label: 'Page' }
	];

	// Status options
	const statuses: { value: InvoiceStatus; label: string }[] = [
		{ value: 'draft', label: 'Draft' },
		{ value: 'sent', label: 'Sent' },
		{ value: 'paid', label: 'Paid' },
		{ value: 'overdue', label: 'Overdue' },
		{ value: 'cancelled', label: 'Cancelled' }
	];

	// Payment terms options
	const paymentTermsOptions = [
		{ value: 'due_on_receipt', label: 'Due on Receipt' },
		{ value: 'net_7', label: 'Net 7' },
		{ value: 'net_15', label: 'Net 15' },
		{ value: 'net_30', label: 'Net 30' },
		{ value: 'net_45', label: 'Net 45' },
		{ value: 'net_60', label: 'Net 60' }
	];

	// Template options
	const templateOptions = Object.values(templates).map((t) => ({
		value: t.id,
		label: t.name
	}));

	// Collapsible states
	let senderOpen = $state(true);
	let clientOpen = $state(true);
	let detailsOpen = $state(true);
	let notesOpen = $state(false);

	// Format dates for input
	function formatDateForInput(date: Date | undefined): string {
		if (!date) return '';
		const d = new Date(date);
		return d.toISOString().split('T')[0];
	}

	// Handle date changes
	function handleIssueDateChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.value) {
			invoiceStore.invoice.issueDate = new Date(target.value);
		}
	}

	function handleDueDateChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.value) {
			invoiceStore.invoice.dueDate = new Date(target.value);
		}
	}

	// Calculate line item amount
	function getLineAmount(qty: number, rate: number): number {
		return qty * rate;
	}

	async function handleLogoUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result as string;
			if (result && invoiceStore.invoice.senderData) {
				invoiceStore.invoice.senderData.logo = result;
			}
		};
		reader.readAsDataURL(file);
	}

	function removeLogo() {
		if (invoiceStore.invoice.senderData) {
			invoiceStore.invoice.senderData.logo = null;
		}
	}
</script>

<div class="space-y-4 p-4 md:p-6">
	<!-- Unsaved Changes Indicator -->
	{#if invoiceStore.isDirty}
		<Tooltip.Root>
			<Tooltip.Trigger>
				<div class="flex items-center gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 cursor-help">
					<Dot class="h-2 w-2 fill-amber-600 text-amber-600 animate-pulse" />
					<span class="text-sm font-medium text-amber-700 dark:text-amber-400">
						Unsaved changes
					</span>
					<Clock class="ml-auto h-4 w-4 text-amber-600 dark:text-amber-500" />
				</div>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p class="text-xs">You have made changes since last saving to history</p>
			</Tooltip.Content>
		</Tooltip.Root>
	{/if}

	<!-- Sender Section -->
	<Collapsible.Root bind:open={senderOpen}>
		<Card.Root>
			<Collapsible.Trigger class="w-full">
				<Card.Header class="flex flex-row items-center justify-between py-3">
					<div class="flex items-center gap-2">
						<Building2 class="h-4 w-4 text-muted-foreground" />
						<Card.Title class="text-base">From (Your Business)</Card.Title>
					</div>
					<ChevronDown
						class="h-4 w-4 text-muted-foreground transition-transform duration-200 {senderOpen
							? 'rotate-180'
							: ''}"
					/>
				</Card.Header>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<Card.Content class="grid gap-4 pt-0">
					<div class="grid gap-4 sm:grid-cols-2">
						<div class="space-y-2">
							<Label for="sender-name">Business Name</Label>
							<Input
								id="sender-name"
								placeholder="Your Business Name"
								bind:value={invoiceStore.invoice.senderData!.businessName}
							/>
						</div>
						<div class="space-y-2">
							<Label for="sender-logo">Logo</Label>
							<div class="flex items-center gap-2">
								{#if invoiceStore.invoice.senderData?.logo}
									<div class="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border">
										<img
											src={invoiceStore.invoice.senderData.logo}
											alt="Logo"
											class="h-full w-full object-contain"
										/>
									</div>
									<Button variant="outline" size="icon" class="h-10 w-10" onclick={removeLogo}>
										<Trash2 class="h-4 w-4 text-destructive" />
									</Button>
								{:else}
									<Input
										id="sender-logo"
										type="file"
										accept="image/*"
										class="cursor-pointer"
										onchange={handleLogoUpload}
									/>
								{/if}
							</div>
						</div>
						<div class="space-y-2">
							<Label for="sender-email">Email</Label>
							<Input
								id="sender-email"
								type="email"
								placeholder="you@business.com"
								bind:value={invoiceStore.invoice.senderData!.email}
							/>
						</div>
					</div>
					<div class="space-y-2">
						<Label for="sender-address">Address</Label>
						<Textarea
							id="sender-address"
							placeholder="123 Business St, City, State 12345"
							rows={2}
							bind:value={invoiceStore.invoice.senderData!.address}
						/>
					</div>
					<div class="grid gap-4 sm:grid-cols-2">
						<div class="space-y-2">
							<Label for="sender-phone">Phone</Label>
							<Input
								id="sender-phone"
								type="tel"
								placeholder="+1 (555) 000-0000"
								bind:value={invoiceStore.invoice.senderData!.phone}
							/>
						</div>
						<div class="space-y-2">
							<Label for="sender-taxid">Tax ID / VAT</Label>
							<Input
								id="sender-taxid"
								placeholder="XX-XXXXXXX"
								bind:value={invoiceStore.invoice.senderData!.taxId}
							/>
						</div>
					</div>
				</Card.Content>
			</Collapsible.Content>
		</Card.Root>
	</Collapsible.Root>

	<!-- Client Section -->
	<Collapsible.Root bind:open={clientOpen}>
		<Card.Root>
			<Collapsible.Trigger class="w-full">
				<Card.Header class="flex flex-row items-center justify-between py-3">
					<div class="flex items-center gap-2">
						<User class="h-4 w-4 text-muted-foreground" />
						<Card.Title class="text-base">To (Client)</Card.Title>
					</div>
					<ChevronDown
						class="h-4 w-4 text-muted-foreground transition-transform duration-200 {clientOpen
							? 'rotate-180'
							: ''}"
					/>
				</Card.Header>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<Card.Content class="grid gap-4 pt-0">
					<div class="grid gap-4 sm:grid-cols-2">
						<div class="space-y-2">
							<Label for="client-name">Client Name</Label>
							<Input
								id="client-name"
								placeholder="John Doe"
								bind:value={invoiceStore.invoice.clientSnapshot!.name}
							/>
						</div>
						<div class="space-y-2">
							<Label for="client-company">Company</Label>
							<Input
								id="client-company"
								placeholder="Acme Corp"
								bind:value={invoiceStore.invoice.clientSnapshot!.company}
							/>
						</div>
						<div class="space-y-2">
							<Label for="client-email">Email</Label>
							<Input
								id="client-email"
								type="email"
								placeholder="client@company.com"
								bind:value={invoiceStore.invoice.clientSnapshot!.email}
							/>
						</div>
						<div class="space-y-2">
							<Label for="client-taxid">Tax ID / VAT</Label>
							<Input
								id="client-taxid"
								placeholder="XX-XXXXXXX"
								bind:value={invoiceStore.invoice.clientSnapshot!.taxId}
							/>
						</div>
					</div>
					<div class="space-y-2">
						<Label for="client-address">Address</Label>
						<Textarea
							id="client-address"
							placeholder="456 Client Ave, City, State 67890"
							rows={2}
							bind:value={invoiceStore.invoice.clientSnapshot!.address}
						/>
					</div>
				</Card.Content>
			</Collapsible.Content>
		</Card.Root>
	</Collapsible.Root>

	<!-- Invoice Details Section -->
	<Collapsible.Root bind:open={detailsOpen}>
		<Card.Root>
			<Collapsible.Trigger class="w-full">
				<Card.Header class="flex flex-row items-center justify-between py-3">
					<div class="flex items-center gap-2">
						<FileText class="h-4 w-4 text-muted-foreground" />
						<Card.Title class="text-base">Invoice Details</Card.Title>
					</div>
					<ChevronDown
						class="h-4 w-4 text-muted-foreground transition-transform duration-200 {detailsOpen
							? 'rotate-180'
							: ''}"
					/>
				</Card.Header>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<Card.Content class="grid gap-4 pt-0">
					<div class="grid gap-4 sm:grid-cols-2">
						<div class="space-y-2">
							<Label for="invoice-status">Status</Label>
							<Select.Root
								type="single"
								value={invoiceStore.invoice.status}
								onValueChange={(v) => {
									if (v) invoiceStore.invoice.status = v as InvoiceStatus;
								}}
							>
								<Select.Trigger id="invoice-status" class="w-full">
									{statuses.find((s) => s.value === invoiceStore.invoice.status)?.label || 'Draft'}
								</Select.Trigger>
								<Select.Content>
									{#each statuses as status}
										<Select.Item value={status.value}>{status.label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>
						<div class="space-y-2">
							<Label for="invoice-number">Invoice Number</Label>
							<Input
								id="invoice-number"
								placeholder="INV-001"
								bind:value={invoiceStore.invoice.number}
							/>
						</div>
					</div>
					<div class="grid gap-4 sm:grid-cols-2">
						<div class="space-y-2">
							<Label for="currency">Currency</Label>
							<Select.Root
								type="single"
								value={invoiceStore.invoice.currency}
								onValueChange={(v) => {
									if (v) invoiceStore.invoice.currency = v;
								}}
							>
								<Select.Trigger id="currency" class="w-full">
									{currencies.find((c) => c.value === invoiceStore.invoice.currency)?.label ||
										'Select currency'}
								</Select.Trigger>
								<Select.Content>
									{#each currencies as currency}
										<Select.Item value={currency.value}>{currency.label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>
						<div class="space-y-2">
							<Label for="template">PDF Template Style</Label>
							<Tabs.Root
								value={invoiceStore.invoice.template}
								onValueChange={(v) => {
									if (v) invoiceStore.invoice.template = v as TemplateId;
								}}
								class="w-full"
							>
								<Tabs.List class="grid h-auto w-full grid-cols-4 p-1">
									<Tabs.Trigger
										value="modern"
										class="flex flex-col gap-1 py-1 text-[10px] tracking-tighter uppercase sm:text-xs"
									>
										<Zap class="size-3.5" />
										Modern
									</Tabs.Trigger>
									<Tabs.Trigger
										value="classic"
										class="flex flex-col gap-1 py-1 text-[10px] tracking-tighter uppercase sm:text-xs"
									>
										<Scroll class="size-3.5" />
										Classic
									</Tabs.Trigger>
									<Tabs.Trigger
										value="tech"
										class="flex flex-col gap-1 py-1 text-[10px] tracking-tighter uppercase sm:text-xs"
									>
										<Terminal class="size-3.5" />
										Tech
									</Tabs.Trigger>
									<Tabs.Trigger
										value="bold"
										class="flex flex-col gap-1 py-1 text-[10px] tracking-tighter uppercase sm:text-xs"
									>
										<Sparkles class="size-3.5" />
										Bold
									</Tabs.Trigger>
								</Tabs.List>
							</Tabs.Root>
						</div>
					</div>
					<div class="grid gap-4 sm:grid-cols-2">
						<div class="space-y-2">
							<Label for="issue-date">Issue Date</Label>
							<Input
								id="issue-date"
								type="date"
								value={formatDateForInput(invoiceStore.invoice.issueDate)}
								onchange={handleIssueDateChange}
							/>
						</div>
						<div class="space-y-2">
							<Label for="due-date">Due Date</Label>
							<Input
								id="due-date"
								type="date"
								value={formatDateForInput(invoiceStore.invoice.dueDate)}
								onchange={handleDueDateChange}
							/>
						</div>
					</div>
				</Card.Content>
			</Collapsible.Content>
		</Card.Root>
	</Collapsible.Root>

	<!-- Line Items Section -->
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between py-3">
			<div class="flex items-center gap-2">
				<Package class="h-4 w-4 text-muted-foreground" />
				<Card.Title class="text-base">Line Items</Card.Title>
			</div>
			<Button variant="outline" size="sm" onclick={() => invoiceStore.addLineItem()}>
				<Plus class="mr-1 h-4 w-4" />
				Add Item
			</Button>
		</Card.Header>
		<Card.Content class="space-y-4 pt-0">
			{#each invoiceStore.invoice.lineItems as item, index}
				<div class="rounded-lg border border-border bg-muted/20 p-3">
					<div class="mb-3 flex items-start justify-between gap-2">
						<div class="flex-1 space-y-2">
							<Label for="item-desc-{index}" class="sr-only">Description</Label>
							<Input
								id="item-desc-{index}"
								placeholder="Service description"
								bind:value={item.description}
							/>
						</div>
						{#if invoiceStore.invoice.lineItems.length > 1}
							<Button
								variant="ghost"
								size="icon"
								class="h-9 w-9 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
								onclick={() => invoiceStore.removeLineItem(index)}
							>
								<Trash2 class="h-4 w-4" />
								<span class="sr-only">Remove item</span>
							</Button>
						{/if}
					</div>
					<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
						<div class="space-y-1">
							<Label for="item-qty-{index}" class="text-xs text-muted-foreground">Qty</Label>
							<Input
								id="item-qty-{index}"
								type="number"
								min="0"
								step="0.01"
								bind:value={item.quantity}
								class="h-9"
							/>
						</div>
						<div class="space-y-1">
							<Label for="item-unit-{index}" class="text-xs text-muted-foreground">Unit</Label>
							<Select.Root
								type="single"
								value={item.unit}
								onValueChange={(v) => {
									if (v) item.unit = v as Unit;
								}}
							>
								<Select.Trigger id="item-unit-{index}" class="h-9 w-full">
									{units.find((u) => u.value === item.unit)?.label || 'Unit'}
								</Select.Trigger>
								<Select.Content>
									{#each units as unit}
										<Select.Item value={unit.value}>{unit.label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>
						<div class="space-y-1">
							<Label for="item-rate-{index}" class="text-xs text-muted-foreground">Rate</Label>
							<Input
								id="item-rate-{index}"
								type="number"
								min="0"
								step="0.01"
								bind:value={item.rate}
								class="h-9"
							/>
						</div>
						<div class="space-y-1">
							<Label for="item-tax-{index}" class="text-xs text-muted-foreground">Tax %</Label>
							<Input
								id="item-tax-{index}"
								type="number"
								min="0"
								max="100"
								step="0.1"
								bind:value={item.taxRate}
								class="h-9"
							/>
						</div>
					</div>
					<div class="mt-3 flex justify-end border-t border-border/50 pt-2">
						<span class="font-mono text-sm font-medium">
							{invoiceStore.invoice.currency}
							{getLineAmount(item.quantity, item.rate).toFixed(2)}
						</span>
					</div>
				</div>
			{/each}
		</Card.Content>
	</Card.Root>

	<!-- Discount Section -->
	<Card.Root>
		<Card.Header class="py-3">
			<Card.Title class="text-base">Discount</Card.Title>
		</Card.Header>
		<Card.Content class="grid gap-4 pt-0 sm:grid-cols-2">
			<div class="space-y-2">
				<Label for="discount-type">Type</Label>
				<Select.Root
					type="single"
					value={invoiceStore.invoice.discount.type}
					onValueChange={(v) => {
						if (v) invoiceStore.invoice.discount.type = v as 'percentage' | 'fixed';
					}}
				>
					<Select.Trigger id="discount-type" class="w-full">
						{invoiceStore.invoice.discount.type === 'percentage'
							? 'Percentage (%)'
							: 'Fixed Amount'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="percentage">Percentage (%)</Select.Item>
						<Select.Item value="fixed">Fixed Amount</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="discount-value">Value</Label>
				<Input
					id="discount-value"
					type="number"
					min="0"
					step="0.01"
					placeholder={invoiceStore.invoice.discount.type === 'percentage' ? '0%' : '0.00'}
					bind:value={invoiceStore.invoice.discount.value}
				/>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Totals Summary -->
	<Card.Root class="bg-muted/30">
		<Card.Content class="space-y-2 py-4">
			<div class="flex justify-between text-sm">
				<span class="text-muted-foreground">Subtotal</span>
				<span class="font-mono"
					>{invoiceStore.invoice.currency} {invoiceStore.subtotal.toFixed(2)}</span
				>
			</div>
			{#if invoiceStore.taxTotal > 0}
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">Tax</span>
					<span class="font-mono"
						>{invoiceStore.invoice.currency} {invoiceStore.taxTotal.toFixed(2)}</span
					>
				</div>
			{/if}
			{#if invoiceStore.discountAmount > 0}
				<div class="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
					<span>Discount</span>
					<span class="font-mono"
						>-{invoiceStore.invoice.currency} {invoiceStore.discountAmount.toFixed(2)}</span
					>
				</div>
			{/if}
			<Separator />
			<div class="flex justify-between">
				<span class="font-semibold">Total</span>
				<span class="font-mono text-xl font-bold text-primary">
					{invoiceStore.invoice.currency}
					{invoiceStore.total.toFixed(2)}
				</span>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Notes & Terms Section -->
	<Collapsible.Root bind:open={notesOpen}>
		<Card.Root>
			<Collapsible.Trigger class="w-full">
				<Card.Header class="flex flex-row items-center justify-between py-3">
					<div class="flex items-center gap-2">
						<StickyNote class="h-4 w-4 text-muted-foreground" />
						<Card.Title class="text-base">Notes & Terms</Card.Title>
					</div>
					<ChevronDown
						class="h-4 w-4 text-muted-foreground transition-transform duration-200 {notesOpen
							? 'rotate-180'
							: ''}"
					/>
				</Card.Header>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<Card.Content class="grid gap-4 pt-0">
					<div class="space-y-2">
						<Label for="notes">Notes</Label>
						<Textarea
							id="notes"
							placeholder="Thank you for your business!"
							rows={3}
							bind:value={invoiceStore.invoice.notes}
						/>
					</div>
					<div class="space-y-2">
						<Label for="terms">Terms & Conditions</Label>
						<Textarea
							id="terms"
							placeholder="Payment is due within 30 days..."
							rows={3}
							bind:value={invoiceStore.invoice.terms}
						/>
					</div>
				</Card.Content>
			</Collapsible.Content>
		</Card.Root>
	</Collapsible.Root>
</div>
