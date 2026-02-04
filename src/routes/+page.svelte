<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import {
		Zap,
		Shield,
		FileText,
		Smartphone,
		ArrowRight,
		Check,
		PenLine,
		Eye,
		Download,
		Globe,
		Clock,
		Lock
	} from '@lucide/svelte';
</script>

<svelte:head>
	<title>Tech Invoice Forge | Free Offline-First Invoice Generator</title>
	<meta
		name="description"
		content="Professional, offline-first invoice generator for tech freelancers and small businesses. No signup required, your data stays in your browser."
	/>
	<meta property="og:title" content="Tech Invoice Forge | Free Offline-First Invoice Generator" />
	<meta
		property="og:description"
		content="Professional, offline-first invoice generator for tech freelancers. No signup required, your data stays in your browser."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<div class="flex flex-col">
	<!-- Hero Section -->
	<section class="relative overflow-hidden border-b border-border/40">
		<!-- Subtle dot pattern background -->
		<div
			class="absolute inset-0 opacity-[0.03]"
			style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 24px 24px;"
		></div>

		<div class="container relative mx-auto px-4 py-20 md:py-28 lg:py-36">
			<div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
				<!-- Left: Text Content -->
				<div class="flex flex-col gap-6">
					<Badge
						variant="secondary"
						class="w-fit rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
					>
						<span class="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
						v1.0 Beta — Free Forever
					</Badge>

					<h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
						Professional invoices,
						<span class="text-primary">zero friction.</span>
					</h1>

					<p class="max-w-lg text-lg leading-relaxed text-muted-foreground">
						The offline-first invoice generator built for developers. Create beautiful PDFs in
						seconds—no account, no tracking, no nonsense.
					</p>

					<div class="flex flex-col gap-3 sm:flex-row sm:gap-4">
						<Button size="lg" href="/app" class="group">
							Start Invoicing
							<ArrowRight
								class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
							/>
						</Button>
						<Button
							size="lg"
							variant="outline"
							href="https://github.com/Michael-Obele/tif"
							target="_blank"
						>
							View on GitHub
						</Button>
					</div>

					<!-- Trust indicators -->
					<div class="flex flex-wrap items-center gap-4 pt-4 text-sm text-muted-foreground">
						<span class="flex items-center gap-1.5">
							<Check class="h-4 w-4 text-emerald-500" />
							No sign-up required
						</span>
						<span class="flex items-center gap-1.5">
							<Check class="h-4 w-4 text-emerald-500" />
							100% client-side
						</span>
						<span class="flex items-center gap-1.5">
							<Check class="h-4 w-4 text-emerald-500" />
							Open source
						</span>
					</div>
				</div>

				<!-- Right: Invoice Preview Mockup -->
				<div class="relative hidden lg:block">
					<div
						class="relative mx-auto w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl"
					>
						<div class="mb-4 flex items-start justify-between">
							<div>
								<p class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
									Invoice
								</p>
								<p class="font-mono text-lg font-bold">INV-2026-0042</p>
							</div>
							<Badge class="bg-emerald-500/15 text-emerald-500">Paid</Badge>
						</div>

						<div class="mb-4 grid grid-cols-2 gap-4 text-sm">
							<div>
								<p class="text-muted-foreground">From</p>
								<p class="font-medium">Your Business</p>
							</div>
							<div>
								<p class="text-muted-foreground">To</p>
								<p class="font-medium">Acme Corp</p>
							</div>
						</div>

						<div class="mb-4 space-y-2 border-t border-border pt-4">
							<div class="flex justify-between text-sm">
								<span class="text-muted-foreground">Frontend Development</span>
								<span class="font-mono">$3,200.00</span>
							</div>
							<div class="flex justify-between text-sm">
								<span class="text-muted-foreground">API Integration</span>
								<span class="font-mono">$1,800.00</span>
							</div>
						</div>

						<div class="flex justify-between border-t border-border pt-4">
							<span class="font-semibold">Total</span>
							<span class="font-mono text-xl font-bold text-primary">$5,000.00</span>
						</div>
					</div>

					<!-- Decorative elements -->
					<div
						class="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/10"
					></div>
					<div
						class="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-emerald-500/10"
					></div>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section: Bento Grid -->
	<section class="container mx-auto px-4 py-20 md:py-28" id="features">
		<div class="mb-12 text-center">
			<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Built for developers</h2>
			<p class="mx-auto mt-4 max-w-2xl text-muted-foreground">
				Every feature designed with privacy, speed, and simplicity in mind.
			</p>
		</div>

		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			<!-- Feature 1: Large Card -->
			<Card.Root
				class="group col-span-1 row-span-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg md:col-span-1"
			>
				<Card.Header class="pb-4">
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20"
					>
						<Shield class="h-6 w-6 text-primary" />
					</div>
					<Card.Title class="text-xl">Private by Default</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-muted-foreground">
						All your data stays in your browser. We use IndexedDB for local storage—no servers, no
						tracking, no data mining. Your invoices are yours alone.
					</p>
					<div class="mt-6 flex flex-wrap gap-2">
						<Badge variant="outline" class="text-xs">IndexedDB</Badge>
						<Badge variant="outline" class="text-xs">Zero Analytics</Badge>
						<Badge variant="outline" class="text-xs">No Cookies</Badge>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Feature 2 -->
			<Card.Root class="group transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
				<Card.Header>
					<div
						class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 transition-colors group-hover:bg-amber-500/20"
					>
						<Zap class="h-5 w-5 text-amber-500" />
					</div>
					<Card.Title>Blazing Fast</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground">
						Built with Svelte 5 and Bun. Instant loads, sub-100ms interactions, zero latency PDF
						generation.
					</p>
				</Card.Content>
			</Card.Root>

			<!-- Feature 3 -->
			<Card.Root class="group transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
				<Card.Header>
					<div
						class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20"
					>
						<FileText class="h-5 w-5 text-emerald-500" />
					</div>
					<Card.Title>Client-Side PDF</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground">
						Generate professional PDFs directly in your browser using pdfmake. Works completely
						offline.
					</p>
				</Card.Content>
			</Card.Root>

			<!-- Feature 4 -->
			<Card.Root class="group transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
				<Card.Header>
					<div
						class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20"
					>
						<Smartphone class="h-5 w-5 text-primary" />
					</div>
					<Card.Title>Mobile Ready</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground">
						Fully responsive design. Create invoices on the go from any device.
					</p>
				</Card.Content>
			</Card.Root>

			<!-- Feature 5 -->
			<Card.Root class="group transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
				<Card.Header>
					<div
						class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20"
					>
						<Globe class="h-5 w-5 text-primary" />
					</div>
					<Card.Title>Multi-Currency</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground">
						30+ currencies with proper formatting. Bill clients anywhere in the world.
					</p>
				</Card.Content>
			</Card.Root>
		</div>
	</section>

	<!-- How It Works Section -->
	<section class="border-y border-border/40 bg-muted/30 py-20 md:py-28">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center">
				<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Three steps to get paid</h2>
				<p class="mx-auto mt-4 max-w-2xl text-muted-foreground">
					No signup, no learning curve. Just create and download.
				</p>
			</div>

			<div class="grid gap-8 md:grid-cols-3">
				<!-- Step 1 -->
				<div class="relative text-center">
					<div
						class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
					>
						<PenLine class="h-7 w-7" />
					</div>
					<h3 class="mb-2 text-xl font-semibold">1. Create</h3>
					<p class="text-muted-foreground">
						Fill in your details, add line items, and customize your invoice in seconds.
					</p>
					<!-- Connector line (hidden on mobile) -->
					<div
						class="absolute top-8 right-0 hidden h-0.5 w-1/3 translate-x-full bg-border md:block"
					></div>
				</div>

				<!-- Step 2 -->
				<div class="relative text-center">
					<div
						class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
					>
						<Eye class="h-7 w-7" />
					</div>
					<h3 class="mb-2 text-xl font-semibold">2. Preview</h3>
					<p class="text-muted-foreground">
						See your invoice update in real-time. What you see is what you get.
					</p>
					<!-- Connector line -->
					<div
						class="absolute top-8 right-0 hidden h-0.5 w-1/3 translate-x-full bg-border md:block"
					></div>
				</div>

				<!-- Step 3 -->
				<div class="text-center">
					<div
						class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white"
					>
						<Download class="h-7 w-7" />
					</div>
					<h3 class="mb-2 text-xl font-semibold">3. Download</h3>
					<p class="text-muted-foreground">
						Export a professional PDF and send it to your client. Done.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Stats Section -->
	<section class="container mx-auto px-4 py-20 md:py-28">
		<div class="grid gap-8 text-center md:grid-cols-4">
			<div>
				<p class="text-4xl font-bold text-primary">0</p>
				<p class="mt-1 text-sm text-muted-foreground">Data sent to servers</p>
			</div>
			<div>
				<p class="text-4xl font-bold">30+</p>
				<p class="mt-1 text-sm text-muted-foreground">Currencies supported</p>
			</div>
			<div>
				<p class="text-4xl font-bold">&lt;2s</p>
				<p class="mt-1 text-sm text-muted-foreground">Time to first invoice</p>
			</div>
			<div>
				<p class="text-4xl font-bold text-emerald-500">100%</p>
				<p class="mt-1 text-sm text-muted-foreground">Free, forever</p>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="container mx-auto px-4 pb-20 md:pb-28">
		<div
			class="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-16 text-center md:px-12"
		>
			<!-- Decorative elements -->
			<div class="absolute top-0 left-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5"></div>
			<div class="absolute right-0 bottom-0 h-60 w-60 translate-x-1/3 translate-y-1/3 rounded-full bg-emerald-500/5"></div>

			<div class="relative">
				<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Ready to get paid?</h2>
				<p class="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
					Create your first invoice in under 30 seconds. No signup, no credit card, no strings
					attached.
				</p>
				<div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
					<Button size="lg" href="/app" class="group">
						Create Your First Invoice
						<ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Button>
				</div>
			</div>
		</div>
	</section>
</div>

