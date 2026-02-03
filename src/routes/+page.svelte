<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { Zap, Shield, FileText, Smartphone } from '@lucide/svelte';
</script>

<div class="flex flex-col gap-12 pb-12">
	<!-- Hero Section -->
	<section
		class="container mx-auto flex flex-col items-center gap-6 px-4 py-24 text-center md:py-32 lg:py-40"
	>
		<Badge variant="secondary" class="rounded-full px-4 py-1 text-sm">
			v1.0 Public Beta is Here
		</Badge>
		<h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
			Professional Invoices <br class="hidden sm:inline" />
			<span class="text-primary">for Tech Pros</span>
		</h1>
		<p class="max-w-2xl leading-normal text-muted-foreground sm:text-xl sm:leading-8">
			Tech Invoice Forge is an offline-first, client-side invoice generator. Private, fast, and
			built for developers who want to bill like a boss.
		</p>
		<div class="flex gap-4">
			<Button size="lg" href="/app">Start Invoicing</Button>
			<Button
				size="lg"
				variant="outline"
				href="https://github.com/Michael-Obele/tif"
				target="_blank"
			>
				View on GitHub
			</Button>
		</div>
	</section>

	<!-- Features Section -->
	<section class="container mx-auto px-4 py-12 md:py-24 lg:py-32" id="features">
		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
			<Card.Root>
				<Card.Header>
					<Shield class="mb-2 h-10 w-10 text-primary" />
					<Card.Title>Private by Default</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-muted-foreground">
						All data is stored locally in your browser using IndexedDB. No servers, no tracking.
					</p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Zap class="mb-2 h-10 w-10 text-primary" />
					<Card.Title>Blazing Fast</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-muted-foreground">
						Built with Svelte 5 and Bun. Instant loads, zero latency PDF generation.
					</p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<FileText class="mb-2 h-10 w-10 text-primary" />
					<Card.Title>Client-Side PDF</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-muted-foreground">
						Generate beautiful PDFs directly in your browser using pdfmake. No internet required.
					</p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Smartphone class="mb-2 h-10 w-10 text-primary" />
					<Card.Title>Mobile Responsive</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-muted-foreground">
						Design invoices on the go. Fully responsive interface optimized for all devices.
					</p>
				</Card.Content>
			</Card.Root>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="container mx-auto px-4 py-12 md:py-24">
		<div class="rounded-3xl bg-muted px-6 py-12 text-center md:px-12 md:py-24">
			<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Ready to get paid?</h2>
			<p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
				Join thousands of developers managing their freelance invoices with Tech Invoice Forge.
			</p>
			<div class="mt-8">
				<Button size="lg" href="/app">Create First Invoice</Button>
			</div>
		</div>
	</section>
</div>
