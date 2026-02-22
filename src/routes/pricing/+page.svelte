<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Check, X, Shield, ChevronRight, Sparkles } from '@lucide/svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { animate, inView, stagger } from 'motion';
	import type { Attachment } from 'svelte/attachments';
	import WaitlistForm from '$lib/components/blocks/WaitlistForm.svelte';

	const localFeatures = [
		'Unlimited invoices',
		'Unlimited clients',
		'PDF export & generation',
		'IndexedDB storage (private)',
		'100% Offline capability',
		'4 professional templates',
		'30+ currencies supported'
	];

	const cloudFeatures = [
		'Everything in Local Edition',
		'Cloud backup & sync',
		'Cross-device accessibility',
		'Team workspace & roles',
		'Email invoices directly',
		'Payment links (Stripe/Paypal)',
		'Priority support'
	];

	const animatePricing: Attachment<HTMLElement> = (node) => {
		const swissReveal = animate(
			'.swiss-reveal',
			{ y: [50, 0], opacity: [0, 1] },
			{ duration: 1, delay: stagger(0.15), ease: [0.16, 1, 0.3, 1] } // expo.out
		);

		const stopInView = inView(
			'.pricing-cards-container',
			() => {
				animate(
					'.glass-card',
					{ y: [60, 0], opacity: [0, 1] },
					{ duration: 1.2, delay: stagger(0.2), ease: [0.16, 1, 0.3, 1] }
				);
			},
			{ margin: '0px 0px -15% 0px' }
		);

		return () => {
			swissReveal.stop();
			stopInView();
		};
	};

	const animateLocalPrice: Attachment<HTMLElement> = (node) => {
		const stopInViewPrice = inView(
			node,
			() => {
				const controls = animate(100, 0, {
					duration: 3,
					ease: [0.16, 1, 0.3, 1],
					onUpdate: (v) => {
						node.textContent = `$${Math.round(v)}`;
					}
				});
				return () => controls.stop();
			},
			{ margin: '0px 0px -15% 0px' }
		);
		return () => stopInViewPrice();
	};

	const animateCloudPrice: Attachment<HTMLElement> = (node) => {
		const stopInViewPrice = inView(
			node,
			() => {
				const controls = animate(0, 8, {
					duration: 3.5,
					ease: [0.16, 1, 0.3, 1],
					onUpdate: (v) => {
						node.textContent = `$${Math.round(v)}`;
					}
				});
				return () => controls.stop();
			},
			{ margin: '0px 0px -15% 0px' }
		);
		return () => stopInViewPrice();
	};
</script>

<svelte:head>
	<title>Pricing | Tech Invoice Forge</title>
	<meta name="description" content="Transparent, privacy-first pricing model." />
</svelte:head>

<!-- Outer Container: Gradient / Mesh background for Glassmorphism pop -->
<div
	{@attach animatePricing}
	class="relative min-h-screen w-full overflow-hidden bg-white text-slate-900 selection:bg-indigo-500/30 dark:bg-[#07070A] dark:text-zinc-50"
>
	<!-- Ambient Background Orbs -->
	<div
		class="pointer-events-none absolute top-[-10%] left-[-10%] h-[50vh] w-[50vh] rounded-full bg-indigo-500/20 blur-[100px] dark:bg-indigo-600/30"
	></div>
	<div
		class="pointer-events-none absolute right-[-10%] bottom-[-10%] h-[50vh] w-[50vh] rounded-full bg-blue-500/20 blur-[120px] dark:bg-fuchsia-600/20"
	></div>

	<!-- Swiss Grid Overlay -->
	<div
		class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]"
	></div>

	<!-- Main Content -->
	<div class="relative mx-auto max-w-7xl px-6 pt-32 pb-32">
		<!-- Hero Section -->
		<header class="swiss-reveal mb-24 grid grid-cols-1 gap-12 lg:grid-cols-12">
			<div class="lg:col-span-8">
				<Badge
					variant="secondary"
					class="mb-6 border border-indigo-200/50 bg-white/50 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-indigo-600 uppercase backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-indigo-400"
				>
					Pricing Schema
				</Badge>
				<h1 class="text-6xl leading-[1.05] font-normal tracking-tight md:text-8xl">
					Own your <br />
					<span
						class="bg-linear-to-r from-indigo-600 to-blue-500 bg-clip-text font-bold text-transparent dark:from-indigo-400 dark:to-cyan-400"
						>financial data.</span
					>
				</h1>
			</div>
			<div class="flex flex-col justify-end lg:col-span-4">
				<p
					class="border-l border-zinc-300 pl-6 text-xl leading-relaxed font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
				>
					Tech Invoice Forge delivers enterprise-grade tooling directly to your browser. Choose
					complete privacy entirely for free, or power up with cloud sync.
				</p>
			</div>
		</header>

		<!-- Pricing Cards Container -->
		<div class="pricing-cards-container grid grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- Local Edition Box -->
			<div
				class="glass-card relative flex flex-col justify-between overflow-hidden rounded-4xl border border-zinc-200/50 bg-white/60 p-10 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_40px_rgba(0,0,0,0.8)]"
			>
				<!-- Absolute Highlight Ring -->
				<div
					class="pointer-events-none absolute inset-0 rounded-4xl ring-1 ring-indigo-500/20 ring-inset dark:ring-indigo-400/20"
				></div>

				<div class="relative flex flex-1 flex-col">
					<div class="mb-4 flex items-center justify-between">
						<h2 class="text-3xl font-bold tracking-tight">Local Edition</h2>
						<Badge
							class="bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
						>
							Recommended
						</Badge>
					</div>
					<p class="mb-8 text-zinc-600 dark:text-zinc-400">
						Complete privacy. Perfect for solo freelancers and local contractors.
					</p>

					<div class="mb-8 flex items-baseline gap-2">
						<span class="text-7xl font-bold tracking-tighter" {@attach animateLocalPrice}>$100</span
						>
						<span class="text-lg font-medium tracking-wide text-zinc-500">/ forever</span>
					</div>

					<div class="mb-8 h-px w-full bg-zinc-200 dark:bg-white/10"></div>

					<ul class="mb-12 flex flex-1 flex-col gap-5">
						{#each localFeatures as feature (feature)}
							<li class="flex items-start gap-4">
								<div
									class="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50"
								>
									<Check class="h-3 w-3 text-indigo-700 dark:text-indigo-400" strokeWidth={3} />
								</div>
								<span class="font-medium text-zinc-700 dark:text-zinc-300">{feature}</span>
							</li>
						{/each}
					</ul>

					<Button
						size="lg"
						class="group mt-auto h-16 w-full rounded-2xl bg-zinc-900 text-lg font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-300"
						href="/app"
					>
						Launch Editor
						<ChevronRight class="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
					</Button>
				</div>
			</div>

			<!-- Cloud Edition Box -->
			<div
				class="glass-card flex flex-col justify-between overflow-hidden rounded-4xl border border-zinc-200/50 bg-white/30 p-10 backdrop-blur-xl dark:border-white/5 dark:bg-white/2"
			>
				<div class="relative flex flex-1 flex-col">
					<div class="mb-4 flex items-center justify-between">
						<h2 class="text-3xl font-medium tracking-tight text-zinc-500 dark:text-zinc-400">
							Cloud Sync
						</h2>
						<Badge
							variant="outline"
							class="flex items-center border border-zinc-300 text-zinc-500 dark:border-white/10 dark:text-zinc-400"
						>
							Waitlist
						</Badge>
					</div>
					<p class="mb-8 text-zinc-500 dark:text-zinc-500">
						For distributed teams and multi-device automated workflows.
					</p>

					<div class="mb-8 flex items-baseline gap-2">
						<span class="text-7xl font-bold tracking-tighter" {@attach animateCloudPrice}>$0</span>
						<span class="text-lg font-medium tracking-wide text-zinc-500">/ month</span>
					</div>

					<div class="mb-8 h-px w-full bg-zinc-200 opacity-50 dark:bg-white/10"></div>

					<ul class="mb-12 flex flex-1 flex-col gap-5 opacity-60">
						{#each cloudFeatures as feature (feature)}
							<li class="flex items-start gap-4">
								<div
									class="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800"
								>
									<Check class="h-3 w-3 text-zinc-500 dark:text-zinc-400" strokeWidth={3} />
								</div>
								<span class="font-medium text-zinc-600 dark:text-zinc-400">{feature}</span>
							</li>
						{/each}
					</ul>

					<div class="mt-auto border-t border-zinc-200/50 pt-6 dark:border-white/5">
						<div class="mb-4 flex items-center gap-2">
							<div
								class="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30"
							>
								<Sparkles class="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
							</div>
							<span
								class="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400"
								>Join Priority Access</span
							>
						</div>
						<div class="w-full">
							<WaitlistForm />
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer Note Area / Privacy assurance -->
		<div
			class="swiss-reveal mt-20 flex flex-col items-center justify-center gap-6 text-center lg:flex-row lg:text-left"
		>
			<div
				class="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-200 bg-indigo-50 shadow-sm dark:border-indigo-900/50 dark:bg-indigo-900/20"
			>
				<Shield class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
			</div>
			<div>
				<h4 class="text-lg font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
					100% Client-Side Assured
				</h4>
				<p class="font-medium text-zinc-500 dark:text-zinc-400">
					Open source on GitHub. MIT Licensed. Zero tracking.
				</p>
			</div>
		</div>
	</div>
</div>
