<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select/index';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Badge } from '$lib/components/ui/badge';
	import { profileStore } from '$lib/stores/profile.svelte';
	import { Plus, Minus, Trash2, Save, Building2, Landmark, Banknote } from '@lucide/svelte';
	import type { BankAccount, Sender } from '$lib/types';
	import { toast } from 'svelte-sonner';
	import { CURRENCIES } from '$lib/constants';

	let { sender = $bindable() }: { sender: Sender } = $props();

	const FIELD_PRESETS = [
		{ label: 'Routing Number', hint: 'US domestic' },
		{ label: 'SWIFT / BIC', hint: 'International wire' },
		{ label: 'IBAN', hint: 'European transfers' },
		{ label: 'Sort Code', hint: 'UK' },
		{ label: 'BSB Number', hint: 'Australia' },
		{ label: 'Branch Code', hint: 'Various' },
		{ label: 'Wire Instructions', hint: '' }
	] as const;

	// Tracks which accordion items are open. New accounts expand automatically.
	let openAccounts = $state<string[]>([]);

	function addBankAccount() {
		if (!sender.bankAccounts) sender.bankAccounts = [];
		const id = crypto.randomUUID();
		sender.bankAccounts.push({
			id,
			bankName: '',
			accountName: '',
			accountNumber: '',
			currency: 'USD',
			fields: []
		});
		openAccounts = [...openAccounts, id];
	}

	function removeBankAccount(index: number) {
		if (!sender.bankAccounts) return;
		const removed = sender.bankAccounts[index];
		sender.bankAccounts = sender.bankAccounts.filter((_, i) => i !== index);
		if (removed) openAccounts = openAccounts.filter((id) => id !== removed.id);
	}

	function addPresetField(account: BankAccount, label: string) {
		if (!account.fields) account.fields = [];
		account.fields.push({ id: crypto.randomUUID(), label, value: '' });
	}

	function addCustomField(account: BankAccount) {
		if (!account.fields) account.fields = [];
		account.fields.push({ id: crypto.randomUUID(), label: '', value: '' });
	}

	function removeField(account: BankAccount, fieldId: string) {
		if (!account.fields) return;
		account.fields = account.fields.filter((f) => f.id !== fieldId);
	}

	async function save() {
		try {
			await profileStore.saveSender(sender);
			toast.success('Profile saved successfully');
		} catch (error) {
			toast.error('Failed to save profile');
		}
	}
</script>

<div class="space-y-6">
	<Card.Root>
		<Card.Header>
			<div class="flex items-center gap-2">
				<div class="rounded-lg bg-primary/10 p-2 text-primary">
					<Building2 class="h-5 w-5" />
				</div>
				<div>
					<Card.Title>Business Information</Card.Title>
					<Card.Description>Your business details that will appear on invoices.</Card.Description>
				</div>
			</div>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="businessName">Business Name</Label>
					<Input id="businessName" bind:value={sender.businessName} placeholder="Acme Inc." />
				</div>
				<div class="space-y-2">
					<Label for="email">Email</Label>
					<Input id="email" type="email" bind:value={sender.email} placeholder="contact@acme.com" />
				</div>
				<div class="space-y-2">
					<Label for="phone">Phone</Label>
					<Input id="phone" type="tel" bind:value={sender.phone} placeholder="+1 (555) 000-0000" />
				</div>
				<div class="space-y-2">
					<Label for="taxId">Tax ID / VAT</Label>
					<Input id="taxId" bind:value={sender.taxId} placeholder="US-123456789" />
				</div>
				<div class="space-y-2">
					<Label for="website">Website</Label>
					<Input
						id="website"
						type="url"
						bind:value={sender.website}
						placeholder="https://acme.com"
					/>
				</div>
				<div class="space-y-2">
					<Label class="flex items-center gap-2">
						<Banknote class="h-4 w-4" />
						Default Currency
					</Label>
					<Select.Root type="single" bind:value={sender.defaultCurrency}>
						<Select.Trigger class="w-full">
							{@const selected = CURRENCIES.find((c) => c.code === sender.defaultCurrency)}
							{selected ? `${selected.name} (${selected.symbol})` : 'Select currency'}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Currencies</Select.Label>
								{#each CURRENCIES as currency}
									<Select.Item value={currency.code} label={currency.name}>
										<div class="flex items-center gap-2">
											<span class="w-8 font-mono text-xs text-muted-foreground"
												>{currency.code}</span
											>
											<span>{currency.name}</span>
											<span class="ml-auto font-mono">{currency.symbol}</span>
										</div>
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
			<div class="space-y-2">
				<Label for="address">Address</Label>
				<Textarea
					id="address"
					bind:value={sender.address}
					placeholder="123 Business St, City, Country"
					rows={3}
				/>
			</div>
			<div class="space-y-2">
				<Label for="defaultTerms">Default Terms & Conditions</Label>
				<Textarea
					id="defaultTerms"
					bind:value={sender.defaultTerms}
					placeholder="Default payment terms to be applied to new invoices..."
					rows={3}
				/>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<div class="flex items-center gap-2">
				<div class="rounded-lg bg-primary/10 p-2 text-primary">
					<Landmark class="h-5 w-5" />
				</div>
				<div>
					<Card.Title>Bank Accounts</Card.Title>
					<Card.Description
						>Add payment details for invoices. Use <strong>Quick Add</strong> to insert common fields
						(routing numbers, SWIFT codes, IBANs) or add fully custom label / value fields per
						account.</Card.Description
					>
				</div>
			</div>
		</Card.Header>
		<Card.Content class="space-y-4">
			{#if sender.bankAccounts && sender.bankAccounts.length > 0}
				<Accordion.Root type="multiple" bind:value={openAccounts} class="space-y-2">
					{#each sender.bankAccounts as account, i (account.id)}
						<Accordion.Item
							value={account.id}
							class="rounded-lg border bg-muted/20 border-b-0"
						>
							<Accordion.Trigger class="px-4 hover:no-underline">
								<div class="flex min-w-0 flex-1 items-center gap-2 text-left">
									<div class="min-w-0 flex-1">
										<span class="block truncate font-medium">
											{account.bankName || 'Unnamed Account'}
										</span>
										{#if account.accountName}
											<span class="block truncate text-xs text-muted-foreground"
												>{account.accountName}</span
											>
										{/if}
									</div>
									<Badge variant="outline" class="shrink-0 font-mono text-xs"
										>{account.currency}</Badge
									>
									{#if account.fields && account.fields.length > 0}
										<Badge variant="secondary" class="shrink-0 text-xs">
											{account.fields.length}
											{account.fields.length === 1 ? 'field' : 'fields'}
										</Badge>
									{/if}
								</div>
							</Accordion.Trigger>
							<Accordion.Content class="px-4 pb-4 pt-0">
								<!-- Core identity fields -->
								<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div class="space-y-2">
										<Label>Bank Name</Label>
										<Input bind:value={account.bankName} placeholder="Bank of America" />
									</div>
									<div class="space-y-2">
										<Label>Account Name</Label>
										<Input bind:value={account.accountName} placeholder="Acme Inc." />
									</div>
									<div class="space-y-2">
										<Label>Account Number</Label>
										<Input
											bind:value={account.accountNumber}
											placeholder="1234567890"
										/>
									</div>
									<div class="space-y-2">
										<Label class="flex items-center gap-1.5">
											<Banknote class="h-3 w-3 text-muted-foreground" />
											Currency
										</Label>
										<Select.Root type="single" bind:value={account.currency}>
											<Select.Trigger class="w-full">
												{@const selected = CURRENCIES.find(
													(c) => c.code === account.currency
												)}
												{selected
													? `${selected.name} (${selected.symbol})`
													: 'Select currency'}
											</Select.Trigger>
											<Select.Content>
												<Select.Group>
													<Select.Label>Currencies</Select.Label>
													{#each CURRENCIES as currency}
														<Select.Item value={currency.code} label={currency.name}>
															<div class="flex items-center gap-2">
																<span
																	class="w-8 font-mono text-xs text-muted-foreground"
																	>{currency.code}</span
																>
																<span>{currency.name}</span>
																<span class="ml-auto font-mono"
																	>{currency.symbol}</span
																>
															</div>
														</Select.Item>
													{/each}
												</Select.Group>
											</Select.Content>
										</Select.Root>
									</div>
								</div>

								<!-- Additional dynamic fields -->
								{#if account.fields && account.fields.length > 0}
									<div class="mt-4 space-y-2">
										<p
											class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
										>
											Additional Fields
										</p>
										<div class="space-y-2">
											{#each account.fields as field (field.id)}
												<div class="flex items-center gap-2">
													<Input
														bind:value={field.label}
														placeholder="Label"
														class="w-40 shrink-0 text-sm"
														aria-label="Field label"
													/>
													<span class="text-muted-foreground" aria-hidden="true">:</span>
													<Input
														bind:value={field.value}
														placeholder="Value"
														class="flex-1 text-sm"
														aria-label="Field value for {field.label || 'custom field'}"
													/>
													<Button
														variant="ghost"
														size="icon"
														class="size-8 shrink-0 text-muted-foreground hover:text-destructive"
														onclick={() => removeField(account, field.id)}
														aria-label="Remove {field.label || 'field'}"
													>
														<Minus class="h-3.5 w-3.5" />
													</Button>
												</div>
											{/each}
										</div>
									</div>
								{/if}

								<!-- Quick-add preset fields -->
								<div class="mt-4 space-y-2">
									<p
										class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
									>
										Quick Add Field
									</p>
									<div class="flex flex-wrap gap-1.5">
										{#each FIELD_PRESETS as preset (preset.label)}
											<Button
												variant="outline"
												size="sm"
												class="h-7 gap-1 border-dashed text-xs"
												onclick={() => addPresetField(account, preset.label)}
												title={preset.hint}
											>
												<Plus class="h-3 w-3" />{preset.label}
											</Button>
										{/each}
									</div>
									<Button
										variant="ghost"
										size="sm"
										class="mt-0.5 h-7 gap-1.5 text-xs text-muted-foreground"
										onclick={() => addCustomField(account)}
									>
										<Plus class="h-3 w-3" /> Custom field
									</Button>
								</div>

								<!-- Remove account -->
								<div class="mt-4 border-t pt-3">
									<Button
										variant="ghost"
										size="sm"
										class="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
										onclick={() => removeBankAccount(i)}
									>
										<Trash2 class="h-3.5 w-3.5" /> Remove Account
									</Button>
								</div>
							</Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>
			{:else}
				<div
					class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center text-muted-foreground"
				>
					<Landmark class="mb-2 h-8 w-8 opacity-50" />
					<p>No bank accounts added yet.</p>
					<p class="text-sm">Add bank details to easily insert them into invoices.</p>
				</div>
			{/if}

			<Button variant="outline" class="w-full gap-2 border-dashed" onclick={addBankAccount}>
				<Plus class="h-4 w-4" /> Add Bank Account
			</Button>
		</Card.Content>
	</Card.Root>

	<div class="flex justify-end">
		<Button size="lg" onclick={save} class="gap-2">
			<Save class="h-4 w-4" /> Save Profile
		</Button>
	</div>
</div>
