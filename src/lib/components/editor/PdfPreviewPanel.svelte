<script lang="ts">
	import { invoiceStore } from '$lib/stores/invoice.svelte';
</script>

<div class="h-full w-full rounded-lg border bg-muted/20 p-8 shadow-inner">
	<div class="min-h-200 bg-white p-8 text-foreground shadow-sm">
		<h2 class="mb-4 text-2xl font-bold">Invoice {invoiceStore.invoice.number}</h2>

		<div class="mb-8 flex justify-between">
			<div>
				<h3 class="font-bold">Total:</h3>
				<p class="text-3xl">${invoiceStore.total.toFixed(2)}</p>
			</div>
			<div>
				<h3 class="font-bold">Status:</h3>
				<p class="uppercase">{invoiceStore.invoice.status}</p>
			</div>
		</div>

		<table class="w-full text-left">
			<thead>
				<tr class="border-b">
					<th class="py-2">Item</th>
					<th class="py-2 text-right">Qty</th>
					<th class="py-2 text-right">Rate</th>
					<th class="py-2 text-right">Amount</th>
				</tr>
			</thead>
			<tbody>
				{#each invoiceStore.invoice.lineItems as item}
					<tr class="border-b last:border-0">
						<td class="py-2">{item.description}</td>
						<td class="py-2 text-right">{item.quantity}</td>
						<td class="py-2 text-right">${item.rate.toFixed(2)}</td>
						<td class="py-2 text-right">${(item.quantity * item.rate).toFixed(2)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
