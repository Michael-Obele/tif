<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Check, Sparkles, Cloud, ArrowRight } from '@lucide/svelte';
	import { Badge } from '$lib/components/ui/badge';

	const localFeatures = [
		'Unlimited invoices',
		'Unlimited clients',
		'PDF export',
		'IndexedDB storage (private)',
		'Works offline',
		'4 professional templates',
		'30+ currencies',
		'JSON backup/restore'
	];

	const cloudFeatures = [
		'Everything in Local',
		'Cloud backup',
		'Cross-device sync',
		'Team collaboration',
		'Email invoices',
		'Payment links'
	];
</script>

<svelte:head>
	<title>Pricing | Tech Invoice Forge</title>
	<meta
		name="description"
		content="Tech Invoice Forge is free and open-source. See why we chose a client-side only approach for your privacy."
	/>
	<meta property="og:title" content="Pricing | Tech Invoice Forge" />
	<meta
		property="og:description"
		content="Free and open-source invoice generator for tech freelancers."
	/>
</svelte:head>

<div class="flex flex-col">
	<!-- Header -->
	<section class="container mx-auto px-4 py-16 text-center md:py-24">
		<Badge
			variant="secondary"
			class="mb-6 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
		>
			<Sparkles class="mr-2 h-4 w-4" />
			No Hidden Fees
		</Badge>
		<h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">Simple, Honest Pricing</h1>
		<p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
			Tech Invoice Forge is free for local use. Always has been, always will be.
		</p>
	</section>

	<!-- Pricing Cards -->
	<section class="container mx-auto px-4 pb-20">
		<div class="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
			<!-- Local Tier: Primary -->
			<Card.Root class="relative flex flex-col border-2 border-primary bg-card shadow-lg">
				<div class="absolute -top-3 left-1/2 -translate-x-1/2">
					<Badge class="bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
						Recommended
					</Badge>
				</div>
				<Card.Header class="pt-8 pb-4">
					<Card.Title class="text-2xl">Local</Card.Title>
					<Card.Description>Perfect for freelancers and contractors.</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-1 flex-col gap-6">
					<div class="flex items-baseline gap-1">
						<span class="text-5xl font-bold">$0</span>
						<span class="text-muted-foreground">/forever</span>
					</div>
					<ul class="flex-1 space-y-3">
						{#each localFeatures as feature}
							<li class="flex items-center gap-3 text-sm">
								<div class="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
									<Check class="h-3 w-3 text-primary" />
								</div>
								{feature}
							</li>
						{/each}
					</ul>
				</Card.Content>
				<Card.Footer>
					<Button class="group w-full" size="lg" href="/app">
						Get Started Free
						<ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Button>
				</Card.Footer>
			</Card.Root>

			<!-- Cloud Tier: Coming Soon -->
			<Card.Root class="relative flex flex-col border-dashed opacity-80">
				<Card.Header class="pt-8 pb-4">
					<div class="flex items-center gap-3">
						<Card.Title class="text-2xl">Cloud Sync</Card.Title>
						<Badge variant="secondary" class="text-xs">Coming Soon</Badge>
					</div>
					<Card.Description>For teams and multi-device access.</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-1 flex-col gap-6">
					<div class="flex items-baseline gap-1">
						<span class="text-5xl font-bold text-muted-foreground">TBD</span>
						<span class="text-muted-foreground">/month</span>
					</div>
					<ul class="flex-1 space-y-3">
						{#each cloudFeatures as feature}
							<li class="flex items-center gap-3 text-sm text-muted-foreground">
								<div class="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
									<Check class="h-3 w-3" />
								</div>
								{feature}
							</li>
						{/each}
					</ul>
				</Card.Content>
				<Card.Footer>
					<Button class="w-full" size="lg" variant="secondary" disabled>
						<Cloud class="mr-2 h-4 w-4" />
						Join Waitlist
					</Button>
				</Card.Footer>
			</Card.Root>
		</div>
	</section>

	<!-- Open Source Note -->
	<section class="border-t border-border/40 bg-muted/30 py-16">
		<div class="container mx-auto px-4 text-center">
			<h2 class="text-2xl font-bold">Open Source, Self-Hostable</h2>
			<p class="mx-auto mt-4 max-w-2xl text-muted-foreground">
				Tech Invoice Forge is open source under MIT license. Deploy it on your own infrastructure,
				modify it to your needs, or contribute to make it better for everyone.
			</p>
			<div class="mt-6">
				<Button variant="outline" href="https://github.com/Michael-Obele/tif" target="_blank">
					View on GitHub
				</Button>
			</div>
		</div>
	</section>
</div>
