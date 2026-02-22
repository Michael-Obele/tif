<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select/index';
	import { profileStore } from '$lib/stores/profile.svelte';
	import { Plus, Trash2, Save, Building2, Landmark, Currency } from '@lucide/svelte';
	import type { Sender } from '$lib/types';
	import { toast } from 'svelte-sonner';
	import { CURRENCIES } from '$lib/constants';

	let { sender = $bindable() }: { sender: Sender } = $props();

	function addBankAccount() {
		if (!sender.bankAccounts) sender.bankAccounts = [];
		sender.bankAccounts.push({
			id: crypto.randomUUID(),
			bankName: '',
			accountName: '',
			accountNumber: '',
			currency: 'USD'
		});
	}

	function removeBankAccount(index: number) {
		if (!sender.bankAccounts) return;
		sender.bankAccounts = sender.bankAccounts.filter((_, i) => i !== index);
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
						<Currency class="h-4 w-4" />
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
											<span class="w-8 text-xs font-mono text-muted-foreground">{currency.code}</span
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
					<Card.Description>Manage your bank accounts for receiving payments.</Card.Description>
				</div>
			</div>
		</Card.Header>
		<Card.Content class="space-y-6">
			{#if sender.bankAccounts && sender.bankAccounts.length > 0}
				{#each sender.bankAccounts as account, i}
					<div
						class="relative grid grid-cols-1 gap-4 rounded-lg border bg-muted/20 p-4 md:grid-cols-2"
					>
						<Button
							variant="ghost"
							size="icon"
							class="absolute top-2 right-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
							onclick={() => removeBankAccount(i)}
						>
							<Trash2 class="h-4 w-4" />
						</Button>

						<div class="space-y-2">
							<Label>Bank Name</Label>
							<Input bind:value={account.bankName} placeholder="Bank of America" />
						</div>
						<div class="space-y-2">
							<Label>Account Name</Label>
							<Input bind:value={account.accountName} placeholder="Acme Inc." />
						</div>
						<div class="space-y-2">
							<Label>Account Number / IBAN</Label>
							<Input bind:value={account.accountNumber} placeholder="1234567890" />
						</div>
						<div class="space-y-2">
							<Label>Routing / SWIFT</Label>
							<Input bind:value={account.routingNumber} placeholder="123456789" />
						</div>
						<div class="space-y-2">
							<Label class="flex items-center gap-2">
								<Currency class="h-3 w-3 text-muted-foreground" />
								Currency
							</Label>
							<Select.Root type="single" bind:value={account.currency}>
								<Select.Trigger class="w-full">
									{@const selected = CURRENCIES.find((c) => c.code === account.currency)}
									{selected ? `${selected.name} (${selected.symbol})` : 'Select currency'}
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										<Select.Label>Currencies</Select.Label>
										{#each CURRENCIES as currency}
											<Select.Item value={currency.code} label={currency.name}>
												<div class="flex items-center gap-2">
													<span class="w-8 text-xs font-mono text-muted-foreground"
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
				{/each}
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
