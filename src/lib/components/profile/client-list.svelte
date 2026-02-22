<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Sheet from '$lib/components/ui/sheet';
	import { profileStore } from '$lib/stores/profile.svelte';
	import {
		Plus,
		Trash2,
		Edit,
		Search,
		User,
		Mail,
		Phone,
		MapPin,
		Building2,
		FileText,
		ArrowRight
	} from '@lucide/svelte';
	import type { Client } from '$lib/types';
	import { toast } from 'svelte-sonner';

	let searchQuery = $state('');
	let isSheetOpen = $state(false);
	let editingClient = $state<Client | null>(null);

	// Derived filtered clients
	let filteredClients = $derived(
		profileStore.clients.filter(
			(c) =>
				c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase()))
		)
	);

	function openNewClient() {
		editingClient = {
			name: '',
			company: '',
			address: '',
			email: '',
			phone: '',
			notes: '',
			createdAt: new Date(),
			updatedAt: new Date()
		};
		isSheetOpen = true;
	}

	function editClient(client: Client) {
		editingClient = { ...client }; // Clone
		isSheetOpen = true;
	}

	async function saveClient() {
		if (!editingClient) return;
		try {
			await profileStore.saveClient(editingClient);
			isSheetOpen = false;
			toast.success('Client profile updated');
		} catch (error) {
			toast.error('Failed to save client');
		}
	}

	async function deleteClient(id: number) {
		if (!confirm('Are you sure you want to remove this client?')) return;
		try {
			await profileStore.deleteClient(id);
			toast.success('Client removed');
		} catch (error) {
			toast.error('Failed to remove client');
		}
	}
</script>

<div class="animate-in space-y-8 duration-500 fade-in">
	<!-- Action Bar -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="group relative w-full sm:max-w-md">
			<Search
				class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
			/>
			<Input
				type="search"
				placeholder="Find clients by name, email, or company..."
				class="h-11 w-full border-muted-foreground/20 bg-muted/40 pl-10 transition-all hover:border-muted-foreground/30 focus-visible:bg-background"
				bind:value={searchQuery}
			/>
		</div>
		<Button
			onclick={openNewClient}
			size="lg"
			class="w-full shrink-0 gap-2 tracking-wide shadow-sm sm:w-auto"
		>
			<Plus class="h-4 w-4" /> New Client
		</Button>
	</div>

	<!-- Client Grid -->
	<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
		{#each filteredClients as client (client.id)}
			<Card.Root
				class="group relative flex flex-col justify-between overflow-hidden border-muted-foreground/10 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.1)]"
			>
				<Card.Header class="pb-4">
					<div class="flex items-start justify-between gap-4">
						<div class="min-w-0 space-y-1.5">
							<Card.Title class="truncate text-base font-semibold tracking-tight">
								{client.name}
							</Card.Title>
							{#if client.company}
								<Card.Description
									class="flex items-center gap-1.5 truncate text-xs font-medium text-muted-foreground"
								>
									<Building2 class="h-3.5 w-3.5" />
									{client.company}
								</Card.Description>
							{/if}
						</div>

						<!-- Action Menu (Hover) -->
						<div
							class="flex shrink-0 translate-x-1 -translate-y-1 gap-1 rounded-md bg-background/50 p-0.5 opacity-100 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 sm:opacity-0"
						>
							<Button
								variant="ghost"
								size="icon"
								class="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
								onclick={() => editClient(client)}
							>
								<Edit class="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								class="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
								onclick={() => client.id && deleteClient(client.id)}
							>
								<Trash2 class="h-4 w-4" />
							</Button>
						</div>
					</div>
				</Card.Header>

				<Card.Content
					class="mt-auto flex flex-col gap-3 border-t border-muted/50 bg-muted/10 py-4 text-sm"
				>
					{#if client.email}
						<div
							class="flex items-center gap-3 text-foreground/70 transition-colors hover:text-foreground"
						>
							<Mail class="h-4 w-4 shrink-0 text-muted-foreground" />
							<a
								href="mailto:{client.email}"
								class="truncate transition-colors hover:text-primary hover:underline"
								>{client.email}</a
							>
						</div>
					{/if}
					{#if client.phone}
						<div class="flex items-center gap-3 text-foreground/70">
							<Phone class="h-4 w-4 shrink-0 text-muted-foreground" />
							<span>{client.phone}</span>
						</div>
					{/if}
					{#if client.address}
						<div class="flex items-start gap-3 text-foreground/70">
							<MapPin class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
							<span class="line-clamp-2 text-xs leading-relaxed">{client.address}</span>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		{:else}
			<div
				class="col-span-full flex min-h-87.5 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/10 p-12 text-center animate-in zoom-in-95 duration-500"
			>
				<div
					class="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-muted"
				>
					<User class="h-8 w-8 text-muted-foreground" />
				</div>
				<h3 class="mb-2 text-xl font-semibold tracking-tight">No clients found</h3>
				<p class="mb-6 max-w-sm text-sm text-muted-foreground leading-relaxed">
					{#if searchQuery}
						No clients match your search query "{searchQuery}". Try different keywords or clear the
						search.
					{:else}
						Get started by adding your first client. Their details will be saved for easy invoicing.
					{/if}
				</p>
				<Button size="lg" class="shadow-sm" onclick={openNewClient}>
					<Plus class="mr-2 h-4 w-4" /> Add New Client
				</Button>
			</div>
		{/each}
	</div>
</div>

<Sheet.Root bind:open={isSheetOpen}>
	<Sheet.Content
		class="flex h-full w-full flex-col border-l bg-background/95 p-0 shadow-2xl backdrop-blur-xl sm:max-w-md"
	>
		<div class="border-b bg-muted/20 px-6 py-6">
			<Sheet.Header>
				<Sheet.Title class="text-2xl font-semibold tracking-tight">
					{editingClient?.id ? 'Edit Client Profile' : 'New Client'}
				</Sheet.Title>
				<Sheet.Description class="pt-1 text-sm">
					Fill out the details below. This information will be used directly in your generated
					invoices.
				</Sheet.Description>
			</Sheet.Header>
		</div>

		{#if editingClient}
			<div class="scrollbar-thin flex-1 overflow-y-auto p-6">
				<div class="grid gap-8">
					<!-- Personal / Business Section -->
					<div class="space-y-4">
						<div class="flex items-center gap-2 text-sm font-medium text-foreground">
							<User class="h-4 w-4 text-primary" /> Profile Basics
						</div>
						<div
							class="space-y-4 rounded-xl border border-muted-foreground/10 bg-card p-5 shadow-sm"
						>
							<div class="space-y-2.5">
								<Label
									for="name"
									class="text-xs font-medium tracking-wider text-muted-foreground uppercase"
									>Client Name <span class="text-destructive">*</span></Label
								>
								<Input
									id="name"
									bind:value={editingClient.name}
									placeholder="e.g. John Doe or Acme Corp"
									class="h-10 bg-muted/40 transition-colors focus-visible:bg-background"
								/>
							</div>
							<div class="space-y-2.5">
								<Label
									for="company"
									class="text-xs font-medium tracking-wider text-muted-foreground uppercase"
									>Company Name</Label
								>
								<Input
									id="company"
									bind:value={editingClient.company}
									placeholder="e.g. Acme Inc."
									class="h-10 bg-muted/40 transition-colors focus-visible:bg-background"
								/>
							</div>
						</div>
					</div>

					<!-- Contact Section -->
					<div class="space-y-4">
						<div class="flex items-center gap-2 text-sm font-medium text-foreground">
							<Phone class="h-4 w-4 text-primary" /> Contact Details
						</div>
						<div
							class="space-y-4 rounded-xl border border-muted-foreground/10 bg-card p-5 shadow-sm"
						>
							<div class="grid grid-cols-2 gap-4">
								<div class="col-span-2 space-y-2.5 sm:col-span-1">
									<Label
										for="email"
										class="text-xs font-medium tracking-wider text-muted-foreground uppercase"
										>Email Address</Label
									>
									<Input
										id="email"
										type="email"
										bind:value={editingClient.email}
										placeholder="john@example.com"
										class="h-10 bg-muted/40 transition-colors focus-visible:bg-background"
									/>
								</div>
								<div class="col-span-2 space-y-2.5 sm:col-span-1">
									<Label
										for="phone"
										class="text-xs font-medium tracking-wider text-muted-foreground uppercase"
										>Phone Number</Label
									>
									<Input
										id="phone"
										type="tel"
										bind:value={editingClient.phone}
										placeholder="+1 555 000 0000"
										class="h-10 bg-muted/40 transition-colors focus-visible:bg-background"
									/>
								</div>
							</div>
						</div>
					</div>

					<!-- Billing Section -->
					<div class="space-y-4">
						<div class="flex items-center gap-2 text-sm font-medium text-foreground">
							<FileText class="h-4 w-4 text-primary" /> Billing Information
						</div>
						<div
							class="space-y-4 rounded-xl border border-muted-foreground/10 bg-card p-5 shadow-sm"
						>
							<div class="space-y-2.5">
								<Label
									for="taxId"
									class="text-xs font-medium tracking-wider text-muted-foreground uppercase"
									>Tax ID / VAT</Label
								>
								<Input
									id="taxId"
									bind:value={editingClient.taxId}
									placeholder="e.g. VAT12345678"
									class="h-10 bg-muted/40 transition-colors focus-visible:bg-background"
								/>
							</div>
							<div class="space-y-2.5">
								<Label
									for="address"
									class="text-xs font-medium tracking-wider text-muted-foreground uppercase"
									>Billing Address</Label
								>
								<Textarea
									id="address"
									bind:value={editingClient.address}
									placeholder="Street, City, Postal Code, Country"
									rows={3}
									class="resize-none bg-muted/40 transition-colors focus-visible:bg-background"
								/>
							</div>
						</div>
					</div>

					<!-- Notes Section -->
					<div class="space-y-4 pb-4">
						<div class="space-y-2.5">
							<Label
								for="notes"
								class="text-xs font-medium tracking-wider text-muted-foreground uppercase"
								>Internal Notes</Label
							>
							<Textarea
								id="notes"
								bind:value={editingClient.notes}
								placeholder="Visible to you only. E.g. prefers Net-30 payment terms."
								rows={2}
								class="resize-none bg-muted/40 transition-colors focus-visible:bg-background"
							/>
						</div>
					</div>
				</div>
			</div>

			<div class="mt-auto border-t border-muted-foreground/10 bg-background/95 p-6 backdrop-blur">
				<Button
					type="submit"
					onclick={saveClient}
					size="lg"
					class="w-full gap-2 font-medium shadow-sm"
				>
					Save Client Profile <ArrowRight class="h-4 w-4" />
				</Button>
			</div>
		{/if}
	</Sheet.Content>
</Sheet.Root>
