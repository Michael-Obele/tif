<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { invoiceStore } from '$lib/stores/invoice.svelte';
	import { browser } from '$app/environment';

	let { children } = $props();

	// Set up auto-save effect for invoice changes
	// This must be in a component (not a class) for $effect to work properly
	if (browser) {
		$effect(() => {
			// Track all invoice mutations by reading the entire invoice
			const _ = JSON.stringify(invoiceStore.invoice);

			// Only trigger save if store is initialized
			if (invoiceStore.isInitialized) {
				$inspect('[Layout] Invoice changed, triggering save...');
				invoiceStore.triggerSave();
			}
		});
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher />

<div class="relative flex min-h-screen flex-col">
	<Navbar />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
