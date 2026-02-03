<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Check } from '@lucide/svelte';
	import { Badge } from '$lib/components/ui/badge';
</script>

<div class="container mx-auto flex flex-col gap-12 px-4 py-24 md:py-32">
	<div class="mx-auto max-w-232 text-center">
		<h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">Simple, Transparent Pricing</h1>
		<p class="mt-4 text-xl text-muted-foreground">
			Tech Invoice Forge is, and always will be, free for local use.
		</p>
	</div>

	<div class="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:gap-12">
		<!-- Free Tier -->
		<Card.Root class="flex flex-col">
			<Card.Header>
				<Card.Title class="text-2xl">Local</Card.Title>
				<Card.Description>Perfect for freelancers and individual contractors.</Card.Description>
			</Card.Header>
			<Card.Content class="grid flex-1 place-items-start gap-6">
				<div class="text-5xl font-bold">
					$0<span class="text-lg font-normal text-muted-foreground">/mo</span>
				</div>
				<ul class="space-y-2 text-sm text-muted-foreground">
					<li class="flex items-center gap-2">
						<Check class="h-4 w-4 text-primary" /> Unlimited Invoices
					</li>
					<li class="flex items-center gap-2">
						<Check class="h-4 w-4 text-primary" /> Unlimited Clients
					</li>
					<li class="flex items-center gap-2">
						<Check class="h-4 w-4 text-primary" /> PDF Export
					</li>
					<li class="flex items-center gap-2">
						<Check class="h-4 w-4 text-primary" /> IndexedDB Storage (Private)
					</li>
					<li class="flex items-center gap-2">
						<Check class="h-4 w-4 text-primary" /> No Internet Required
					</li>
				</ul>
			</Card.Content>
			<Card.Footer>
				<Button class="w-full" href="/app">Get Started</Button>
			</Card.Footer>
		</Card.Root>

		<!-- Cloud Tier (Future) -->
		<Card.Root class="flex flex-col border-primary/20 bg-muted/50 opacity-75">
			<Card.Header>
				<div class="flex items-center justify-between">
					<Card.Title class="text-2xl">Cloud Sync</Card.Title>
					<Badge variant="secondary">Coming Soon</Badge>
				</div>
				<Card.Description>For those who need access across multiple devices.</Card.Description>
			</Card.Header>
			<Card.Content class="grid flex-1 place-items-start gap-6">
				<div class="text-5xl font-bold">
					TBD<span class="text-lg font-normal text-muted-foreground">/mo</span>
				</div>
				<ul class="space-y-2 text-sm text-muted-foreground">
					<li class="flex items-center gap-2">
						<Check class="h-4 w-4 text-primary" /> Everything in Local
					</li>
					<li class="flex items-center gap-2">
						<Check class="h-4 w-4 text-primary" /> Cloud Backup
					</li>
					<li class="flex items-center gap-2">
						<Check class="h-4 w-4 text-primary" /> Cross-Device Sync
					</li>
					<li class="flex items-center gap-2">
						<Check class="h-4 w-4 text-primary" /> Team Collaboration
					</li>
				</ul>
			</Card.Content>
			<Card.Footer>
				<Button class="w-full" disabled>Join Waitlist</Button>
			</Card.Footer>
		</Card.Root>
	</div>

	<div class="mx-auto max-w-232 text-center">
		<p class="text-sm text-muted-foreground">
			Tech Invoice Forge is open source. You can host it yourself or use the local version forever.
		</p>
	</div>
</div>
