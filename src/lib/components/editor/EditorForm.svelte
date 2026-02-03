<script lang="ts">
	import { invoiceStore } from '$lib/stores/invoice.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';

	// In a real app, these would be separate sub-components
</script>

<div class="space-y-8 p-6">
	<!-- Sender Section -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Sender Info</Card.Title>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<div class="grid gap-2">
				<Label for="sender-name">Business Name</Label>
				<Input id="sender-name" placeholder="Your Business" />
				<!-- Note: binding to nested objects in store requires care or direct access -->
			</div>
			<div class="grid gap-2">
				<Label for="sender-email">Email</Label>
				<Input id="sender-email" type="email" placeholder="you@example.com" />
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Client Section -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Client Info</Card.Title>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<div class="grid gap-2">
				<Label for="client-name">Client Name</Label>
				<Input id="client-name" placeholder="Client Business" />
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Line Items -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Line Items</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-4">
			{#each invoiceStore.invoice.lineItems as item, i}
				<div class="flex items-end gap-2">
					<div class="grid flex-1 gap-2">
						<Label>Description</Label>
						<Input
							value={item.description}
							onchange={(e) =>
								invoiceStore.updateLineItem(i, { description: e.currentTarget.value })}
						/>
					</div>
					<div class="grid w-24 gap-2">
						<Label>Qty</Label>
						<Input
							type="number"
							value={item.quantity}
							onchange={(e) =>
								invoiceStore.updateLineItem(i, { quantity: Number(e.currentTarget.value) })}
						/>
					</div>
					<div class="grid w-24 gap-2">
						<Label>Price</Label>
						<Input
							type="number"
							value={item.rate}
							onchange={(e) =>
								invoiceStore.updateLineItem(i, { rate: Number(e.currentTarget.value) })}
						/>
					</div>
				</div>
			{/each}
		</Card.Content>
	</Card.Root>
</div>
