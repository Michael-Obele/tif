<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
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
		Lock,
		Sparkles,
		Layers,
		Cpu,
		Fingerprint,
		Rocket,
		CreditCard,
		MoveRight
	} from '@lucide/svelte';
</script>

<svelte:head>
	<title>Tech Invoice Forge | The Future of Invoicing</title>
	<meta
		name="description"
		content="Professional, offline-first invoice generator for tech freelancers. Aesthetic, private, and insanely fast."
	/>
</svelte:head>

<div
	class="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground selection:bg-primary/20 selection:text-primary"
>
	<!-- Ambient Background Light -->
	<div class="pointer-events-none fixed inset-0 z-0">
		<div
			class="absolute top-[-20%] left-[-10%] h-[50vw] w-[50vw] rounded-full bg-primary/5 blur-[120px]"
		></div>
		<div
			class="absolute right-[-10%] bottom-[-20%] h-[50vw] w-[50vw] rounded-full bg-emerald-500/5 blur-[120px]"
		></div>
	</div>

	<!-- Hero Section -->
	<section class="relative z-10 pt-24 pb-32 md:pt-32 md:pb-48">
		<div class="container mx-auto px-4">
			<div class="mx-auto flex max-w-4xl flex-col items-center space-y-8 text-center">
				<!-- Animated Pill Badge -->
				<div class="animate-fade-in-up" style="animation-delay: 100ms;">
					<Badge
						variant="outline"
						class="cursor-default rounded-full border-primary/20 bg-background/50 px-4 py-1.5 shadow-sm backdrop-blur-md transition-colors hover:border-primary/40"
					>
						<span class="relative mr-2 flex h-2 w-2">
							<span
								class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
							></span>
							<span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
						</span>
						<span
							class="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text font-medium text-transparent"
							>v1.0 Beta is Live</span
						>
					</Badge>
				</div>

				<!-- Main Headline -->
				<h1
					class="animate-fade-in-up text-5xl leading-[1.1] font-bold tracking-tighter md:text-7xl lg:text-8xl"
					style="animation-delay: 200ms;"
				>
					Start invoicing, <br class="hidden md:block" />
					<span
						class="bg-linear-to-br from-primary via-primary/90 to-emerald-500/80 bg-clip-text text-transparent"
						>stop stressing.</span
					>
				</h1>

				<!-- Subheadline -->
				<p
					class="animate-fade-in-up max-w-2xl text-lg leading-relaxed text-balance text-muted-foreground/80 md:text-xl"
					style="animation-delay: 300ms;"
				>
					The offline-first invoice generator that respects your privacy. Zero friction, zero fees,
					100% client-side.
				</p>

				<!-- CTA Buttons -->
				<div
					class="animate-fade-in-up flex w-full flex-col items-center justify-center gap-4 pt-4 sm:flex-row"
					style="animation-delay: 400ms;"
				>
					<Button
						size="lg"
						href="/invoice/new"
						class="group h-12 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/30 active:scale-95"
					>
						Create Invoice
						<MoveRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Button>
					<Button
						size="lg"
						variant="outline"
						href="https://github.com/Michael-Obele/tif"
						target="_blank"
						class="h-12 rounded-full border-border/50 bg-background/50 px-8 backdrop-blur-sm transition-all hover:bg-muted/50 hover:text-foreground"
					>
						<svg class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor"
							><path
								d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
							/></svg
						>
						Star on GitHub
					</Button>
				</div>
			</div>

			<!-- Abstract UI Mockup -->
			<div
				class="perspective-1000 animate-zoom-in relative mx-auto mt-20 max-w-5xl md:mt-32"
				style="animation-delay: 500ms;"
			>
				<!-- Main Card -->
				<div
					class="relative rotate-x-2 transform rounded-3xl border border-border/50 bg-card/50 p-1 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl transition-transform duration-700 ease-out hover:rotate-x-0 dark:ring-white/5"
				>
					<div class="overflow-hidden rounded-[1.25rem] border border-border/30 bg-background">
						<!-- Mockup Header -->
						<div class="flex h-12 items-center gap-2 border-b border-border/40 bg-muted/20 px-4">
							<div class="flex gap-1.5">
								<div class="h-2.5 w-2.5 rounded-full bg-red-400/80"></div>
								<div class="h-2.5 w-2.5 rounded-full bg-amber-400/80"></div>
								<div class="h-2.5 w-2.5 rounded-full bg-emerald-400/80"></div>
							</div>
							<div
								class="mx-auto flex h-6 w-48 items-center justify-center rounded-full bg-muted/40 font-mono text-[10px] text-muted-foreground"
							>
								tif.svelte-apps.me/invoice/new
							</div>
						</div>
						<!-- Mockup Content -->
						<div class="flex min-h-[400px] flex-col gap-6 p-8 md:p-12">
							<div class="flex items-start justify-between">
								<div class="space-y-2">
									<div class="h-8 w-32 animate-pulse rounded-lg bg-primary/10"></div>
									<div class="h-4 w-48 animate-pulse rounded bg-muted"></div>
								</div>
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10"
								>
									<Check class="h-5 w-5 text-emerald-500" />
								</div>
							</div>
							<div class="mt-4 grid grid-cols-2 gap-8">
								<div class="space-y-2">
									<div class="h-3 w-12 rounded bg-muted"></div>
									<div class="h-4 w-24 rounded bg-muted/50"></div>
								</div>
								<div class="space-y-2 text-right">
									<div class="ml-auto h-3 w-12 rounded bg-muted"></div>
									<div class="ml-auto h-4 w-24 rounded bg-muted/50"></div>
								</div>
							</div>
							<div class="mt-8 space-y-4">
								<div class="flex items-center justify-between border-b border-border/40 py-4">
									<div class="space-y-1">
										<div class="h-4 w-48 rounded bg-muted/60"></div>
										<div class="h-3 w-24 rounded bg-muted/30"></div>
									</div>
									<div class="h-4 w-16 rounded bg-muted/60"></div>
								</div>
								<div class="flex items-center justify-between border-b border-border/40 py-4">
									<div class="space-y-1">
										<div class="h-4 w-40 rounded bg-muted/60"></div>
										<div class="h-3 w-20 rounded bg-muted/30"></div>
									</div>
									<div class="h-4 w-16 rounded bg-muted/60"></div>
								</div>
							</div>
							<div class="mt-auto flex justify-end">
								<div class="space-y-1 text-right">
									<div class="ml-auto h-3 w-12 rounded bg-muted"></div>
									<div class="mt-2 h-8 w-32 rounded-lg bg-primary/10"></div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Floating Elements -->
				<div
					class="animate-bounce-slow absolute -top-8 -right-8 hidden rounded-2xl border border-border/50 bg-card p-4 shadow-xl md:block"
				>
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
							<Check class="h-5 w-5 text-emerald-500" />
						</div>
						<div>
							<div class="text-sm font-semibold">Payment Received</div>
							<div class="text-xs text-muted-foreground">Just now</div>
						</div>
					</div>
				</div>
				<div
					class="animate-bounce-slow-delay absolute bottom-20 -left-8 hidden rounded-2xl border border-border/50 bg-card p-4 shadow-xl md:block"
				>
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
							<Clock class="h-5 w-5 text-blue-500" />
						</div>
						<div>
							<div class="text-sm font-semibold">PDF Generated</div>
							<div class="font-mono text-xs text-emerald-500">&lt; 100ms</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<Separator class="opacity-30" />

	<!-- Features Section (Bento Grid) -->
	<section class="relative overflow-hidden py-24 md:py-32" id="features">
		<div class="container mx-auto px-4">
			<div class="mx-auto mb-16 max-w-3xl space-y-4 md:text-center">
				<Badge variant="secondary" class="rounded-full">Why TIF?</Badge>
				<h2 class="text-3xl font-bold tracking-tight md:text-5xl">
					Everything you need, <br />nothing you don't.
				</h2>
				<p class="text-lg text-muted-foreground">
					We stripped away the complexity of traditional accounting software to focus on what
					matters: getting you paid.
				</p>
			</div>

			<div class="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
				<!-- Privacy Card (Large) -->
				<Card.Root
					class="group overflow-hidden rounded-3xl border-border/50 bg-linear-to-br from-card to-card/50 transition-all duration-500 hover:shadow-xl md:col-span-2 md:row-span-2"
				>
					<div class="relative z-10 flex h-full flex-col p-8">
						<div
							class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition-transform duration-300 group-hover:scale-110"
						>
							<Shield class="h-6 w-6 text-primary" />
						</div>
						<h3 class="mb-3 text-2xl font-bold">Privacy by Design</h3>
						<p class="mb-6 flex-1 text-lg leading-relaxed text-muted-foreground">
							Your financial data never touches our servers. We use <strong>IndexedDB</strong> to store
							everything locally in your browser. It's like having a vault on your device that only you
							can open.
						</p>
						<div class="flex flex-wrap gap-2">
							<Badge variant="outline" class="bg-background/50 backdrop-blur"
								>End-to-End Local</Badge
							>
							<Badge variant="outline" class="bg-background/50 backdrop-blur">No Tracking</Badge>
						</div>
					</div>
					<div
						class="absolute right-[-20%] bottom-[-20%] h-64 w-64 rounded-full bg-primary/5 blur-3xl transition-colors duration-500 group-hover:bg-primary/10"
					></div>
				</Card.Root>

				<!-- Speed Card -->
				<Card.Root
					class="group overflow-hidden rounded-3xl border-border/50 bg-card transition-all duration-300 hover:bg-muted/30 md:col-span-1"
				>
					<div class="p-8">
						<div
							class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 transition-transform duration-300 group-hover:rotate-12"
						>
							<Zap class="h-6 w-6 text-amber-500" />
						</div>
						<h3 class="mb-2 text-xl font-bold">Blazing Fast</h3>
						<p class="text-muted-foreground">
							Built with Svelte 5. Instant loads, zero latency interactions.
						</p>
					</div>
				</Card.Root>

				<!-- PDF Card -->
				<Card.Root
					class="group overflow-hidden rounded-3xl border-border/50 bg-card transition-all duration-300 hover:bg-muted/30 md:col-span-1"
				>
					<div class="p-8">
						<div
							class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 transition-transform duration-300 group-hover:scale-110"
						>
							<FileText class="h-6 w-6 text-emerald-500" />
						</div>
						<h3 class="mb-2 text-xl font-bold">Vector PDFs</h3>
						<p class="text-muted-foreground">
							Crisp, professional PDF generation driven completely by client-side logic.
						</p>
					</div>
				</Card.Root>

				<!-- Mobile Card -->
				<Card.Root
					class="group overflow-hidden rounded-3xl border-border/50 bg-linear-to-br from-card via-card/50 to-background transition-all duration-500 hover:shadow-lg md:col-span-3 lg:col-span-3"
				>
					<div class="flex flex-col items-center gap-8 p-8 md:flex-row md:p-10">
						<div class="flex-1 space-y-4">
							<div
								class="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 transition-transform duration-300 group-hover:scale-110"
							>
								<Smartphone class="h-6 w-6 text-indigo-500" />
							</div>
							<h3 class="text-2xl font-bold">Invoicing on the go</h3>
							<p class="text-lg text-muted-foreground">
								Fully responsive design ensures you can create, edit, and send invoices from your
								phone or tablet. Perfect for digital nomads.
							</p>
							<div class="pt-2">
								<Button variant="link" class="h-auto p-0 text-primary group-hover:underline">
									Try mobile view <ArrowRight class="ml-2 h-4 w-4" />
								</Button>
							</div>
						</div>
						<div class="relative w-full max-w-sm flex-1">
							<!-- Abstract Phone Mockup -->
							<div
								class="rotate-3 rounded-[2.5rem] border-4 border-foreground/10 bg-foreground/5 p-3 shadow-2xl transition-transform duration-500 group-hover:rotate-0"
							>
								<div
									class="relative aspect-9/16 overflow-hidden rounded-4xl border border-border/10 bg-background"
								>
									<div class="absolute inset-x-0 top-0 z-20 flex h-6 justify-center bg-muted/20">
										<div class="h-4 w-20 rounded-b-xl bg-foreground/10"></div>
									</div>
									<div class="space-y-3 p-4 pt-10">
										<div class="h-20 rounded-xl bg-primary/10"></div>
										<div class="space-y-2">
											<div class="h-4 w-3/4 rounded bg-muted/50"></div>
											<div class="h-4 w-1/2 rounded bg-muted/30"></div>
										</div>
										<div class="mt-4 grid grid-cols-2 gap-2">
											<div class="h-24 rounded-xl bg-muted/10"></div>
											<div class="h-24 rounded-xl bg-muted/10"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card.Root>
			</div>
		</div>
	</section>

	<!-- Steps Section -->
	<section class="border-y border-border/40 bg-muted/30 py-24">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-4xl">
				<div class="mb-16 text-center">
					<h2 class="mb-4 text-3xl font-bold">It's incredibly simple.</h2>
					<p class="text-muted-foreground">Three steps. Zero headaches.</p>
				</div>

				<div class="relative grid gap-12 md:grid-cols-3">
					<!-- Connecting Line (Desktop) -->
					<div
						class="absolute top-12 right-[16%] left-[16%] -z-10 hidden h-0.5 bg-linear-to-r from-transparent via-border to-transparent md:block"
					></div>

					<!-- Step 1 -->
					<div class="group relative flex flex-col items-center text-center">
						<div
							class="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-muted bg-background shadow-sm transition-all duration-300 group-hover:border-primary/20 group-hover:bg-primary/5"
						>
							<PenLine
								class="h-8 w-8 text-muted-foreground transition-colors group-hover:text-primary"
							/>
						</div>
						<h3 class="mb-2 text-xl font-bold">1. Draft</h3>
						<p class="px-4 text-sm text-muted-foreground">
							Fill in your client details and line items. The intuitive editor makes it a breeze.
						</p>
					</div>

					<!-- Step 2 -->
					<div class="group relative flex flex-col items-center text-center">
						<div
							class="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-muted bg-background shadow-sm transition-all duration-300 group-hover:border-amber-500/20 group-hover:bg-amber-500/5"
						>
							<Eye
								class="h-8 w-8 text-muted-foreground transition-colors group-hover:text-amber-500"
							/>
						</div>
						<h3 class="mb-2 text-xl font-bold">2. Review</h3>
						<p class="px-4 text-sm text-muted-foreground">
							Check the live preview. Customize the theme to match your brand identity.
						</p>
					</div>

					<!-- Step 3 -->
					<div class="group relative flex flex-col items-center text-center">
						<div
							class="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-muted bg-background shadow-sm transition-all duration-300 group-hover:border-emerald-500/20 group-hover:bg-emerald-500/5"
						>
							<Download
								class="h-8 w-8 text-muted-foreground transition-colors group-hover:text-emerald-500"
							/>
						</div>
						<h3 class="mb-2 text-xl font-bold">3. Ship</h3>
						<p class="px-4 text-sm text-muted-foreground">
							Download the PDF and send it off. No watermarks, even on the free version.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Final CTA -->
	<section class="relative overflow-hidden py-32">
		<!-- Background Glow -->
		<div class="absolute inset-0 bg-primary/5"></div>
		<div class="absolute inset-0 bg-linear-to-t from-background to-transparent"></div>

		<div class="relative z-10 container mx-auto px-4 text-center">
			<div class="mx-auto max-w-2xl space-y-8">
				<h2 class="text-4xl font-bold tracking-tight md:text-5xl">Ready to get paid?</h2>
				<p class="text-xl text-muted-foreground">
					Join thousands of developers who trust TIF for their invoicing needs.
				</p>
				<div class="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
					<Button
						size="lg"
						href="/invoice/new"
						class="h-14 rounded-full px-10 text-lg shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/50"
					>
						Start Invoicing Now
					</Button>
				</div>
				<p class="pt-8 text-sm text-muted-foreground">
					Open Source • Free Forever • No Account Needed
				</p>
			</div>
		</div>
	</section>
</div>

<style>
	/* Custom animations that aren't in Tailwind by default */
	.perspective-1000 {
		perspective: 1000px;
	}

	@keyframes bounce-slow {
		0%,
		100% {
			transform: translateY(-5%);
		}
		50% {
			transform: translateY(5%);
		}
	}
	.animate-bounce-slow {
		animation: bounce-slow 3s infinite ease-in-out;
	}
	.animate-bounce-slow-delay {
		animation: bounce-slow 3s infinite ease-in-out 1.5s;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in-up {
		animation: fadeInUp 0.7s ease-out forwards;
		opacity: 0; /* Starte hidden */
	}

	@keyframes zoomIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	.animate-zoom-in {
		animation: zoomIn 1s ease-out forwards;
		opacity: 0;
	}
</style>
