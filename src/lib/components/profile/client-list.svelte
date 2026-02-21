<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Sheet from '$lib/components/ui/sheet';
	import { profileStore } from '$lib/stores/profile.svelte';
	import { Plus, Trash2, Edit, Search, User, Mail, Phone, MapPin } from '@lucide/svelte';
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
			toast.success('Client saved successfully');
		} catch (error) {
			toast.error('Failed to save client');
		}
	}

	async function deleteClient(id: number) {
		if (!confirm('Are you sure you want to delete this client?')) return;
		try {
			await profileStore.deleteClient(id);
			toast.success('Client deleted');
		} catch (error) {
			toast.error('Failed to delete client');
		}
	}
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between gap-4">
		<div class="relative max-w-sm flex-1">
			<Search class="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
			<Input type="search" placeholder="Search clients..." class="pl-9" bind:value={searchQuery} />
		</div>
		<Button onclick={openNewClient} class="gap-2">
			<Plus class="h-4 w-4" /> Add Client
		</Button>
	</div>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each filteredClients as client (client.id)}
			<Card.Root class="group relative transition-colors hover:border-primary/50">
				<div
					class="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100"
				>
					<Button variant="ghost" size="icon" class="h-8 w-8" onclick={() => editClient(client)}>
						<Edit class="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						class="h-8 w-8 text-destructive hover:text-destructive"
						onclick={() => client.id && deleteClient(client.id)}
					>
						<Trash2 class="h-4 w-4" />
					</Button>
				</div>
				<Card.Header>
					<Card.Title class="flex items-center gap-2 text-base">
						<User class="h-4 w-4 text-primary" />
						{client.name}
					</Card.Title>
					{#if client.company}
						<Card.Description>{client.company}</Card.Description>
					{/if}
				</Card.Header>
				<Card.Content class="space-y-2 text-sm text-muted-foreground">
					{#if client.email}
						<div class="flex items-center gap-2">
							<Mail class="h-3 w-3" />
							<a href="mailto:{client.email}" class="hover:underline">{client.email}</a>
						</div>
					{/if}
					{#if client.phone}
						<div class="flex items-center gap-2">
							<Phone class="h-3 w-3" />
							<span>{client.phone}</span>
						</div>
					{/if}
					{#if client.address}
						<div class="flex items-start gap-2">
							<MapPin class="mt-0.5 h-3 w-3" />
							<span class="line-clamp-2 whitespace-pre-line">{client.address}</span>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		{:else}
			<div
				class="col-span-full rounded-lg border-2 border-dashed py-12 text-center text-muted-foreground"
			>
				<User class="mx-auto mb-4 h-12 w-12 opacity-20" />
				<p>No clients found.</p>
				<Button variant="link" onclick={openNewClient}>Create your first client</Button>
			</div>
		{/each}
	</div>
</div>

<Sheet.Root bind:open={isSheetOpen}>
	<Sheet.Content class="w-full overflow-y-auto sm:max-w-md">
		<Sheet.Header>
			<Sheet.Title>{editingClient?.id ? 'Edit Client' : 'New Client'}</Sheet.Title>
			<Sheet.Description>Add or update client details for your invoices.</Sheet.Description>
		</Sheet.Header>

		{#if editingClient}
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="name">Name</Label>
					<Input id="name" bind:value={editingClient.name} placeholder="John Doe" />
				</div>
				<div class="grid gap-2">
					<Label for="company">Company</Label>
					<Input id="company" bind:value={editingClient.company} placeholder="Acme Inc." />
				</div>
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						bind:value={editingClient.email}
						placeholder="john@example.com"
					/>
				</div>
				<div class="grid gap-2">
					<Label for="phone">Phone</Label>
					<Input
						id="phone"
						type="tel"
						bind:value={editingClient.phone}
						placeholder="+1 555 000 0000"
					/>
				</div>
				<div class="grid gap-2">
					<Label for="taxId">Tax ID / VAT</Label>
					<Input id="taxId" bind:value={editingClient.taxId} placeholder="Optional" />
				</div>
				<div class="grid gap-2">
					<Label for="address">Address</Label>
					<Textarea
						id="address"
						bind:value={editingClient.address}
						placeholder="Billing Address"
						rows={3}
					/>
				</div>
				<div class="grid gap-2">
					<Label for="notes">Notes (Internal)</Label>
					<Textarea
						id="notes"
						bind:value={editingClient.notes}
						placeholder="Private notes about this client"
						rows={2}
					/>
				</div>
			</div>

			<Sheet.Footer>
				<Button type="submit" onclick={saveClient}>Save Client</Button>
			</Sheet.Footer>
		{/if}
	</Sheet.Content>
</Sheet.Root>
