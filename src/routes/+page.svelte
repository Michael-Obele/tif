<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Accordion from '$lib/components/ui/accordion';
	import FeatureCard from '$lib/components/blocks/FeatureCard.svelte';
	import {
		Zap,
		ShieldCheck,
		Shield,
		ArrowRight,
		Check,
		User,
		Eye,
		History,
		Layers,
		Plus,
		Minus,
		LayoutTemplate,
		FileText,
		Database,
		Cpu
	} from '@lucide/svelte';
	import { animate, scroll, inView, stagger } from 'motion';
	import type { Attachment } from 'svelte/attachments';

	const saasDrawbacks = [
		'Watermarks on free plan',
		'Requires user account',
		'Sells your client data',
		'Slow server processing'
	];

	const tifBenefits = [
		'Pristine Vector PDFs',
		'Offline By Default',
		'Absolute Ledger Privacy',
		'Instant Client-Side Generation'
	];

	const faqs = [
		{
			question: 'Is my financial data secure?',
			answer:
				'Absolutely. We utilize IndexedDB to store your clients, profiles, and sent invoices exclusively on your local device. No data is ever transmitted to a remote server.'
		},
		{
			question: 'How much does it cost?',
			answer:
				"TIF is $0 forever. We rejected the traditional SaaS model. You shouldn't have to pay a monthly subscription just to extract money you rightfully earned."
		},
		{
			question: 'Can I generate PDFs offline?',
			answer:
				'Yes. The underlying vector engine (pdfmake) is bundled directly into the client application. Once loaded, you can generate pixel-perfect PDFs even inside a concrete bunker.'
		},
		{
			question: 'Does it work seamlessly on mobile?',
			answer:
				'The entire interface is built mobile-first. You can tap out a complete invoice, preview the document, and download the PDF while waiting in line for coffee.'
		}
	];

	const coreCapabilities = [
		{
			title: 'Infinite Local Ledger',
			description:
				'We integrated a fully operational IndexedDB instance right into your browser. Drafts, sent invoices, and client lists are auto-saved in a persistent local vault. You maintain absolute ledger sovereignty without external dependencies.',
			icon: History,
			iconColor: 'text-primary',
			blurColor: 'bg-primary/5'
		},
		{
			title: 'Memory Synced',
			description:
				'Configure your personal and banking details once. The engine automatically injects your preferred profile into every new draft indefinitely.',
			icon: User,
			iconColor: 'text-indigo-500',
			blurColor: 'bg-indigo-500/5'
		},
		{
			title: 'Mathematical Vectors',
			description:
				'Compiled natively. Pdfmake transforms your data points into mathematically perfect vector documents directly inside the client execution environment, zero latency included.',
			icon: Layers,
			iconColor: 'text-emerald-500',
			blurColor: 'bg-emerald-500/5'
		},
		{
			title: 'Optical Sync',
			description:
				'An architectural dual-pane viewport provides real-time optical feedback. Change a digit on the left workspace; watch the vector rebuild on the right instantaneously.',
			icon: Eye,
			iconColor: 'text-amber-500',
			blurColor: 'bg-amber-500/5'
		}
	];

	const features = [
		{
			title: 'Local Vault',
			description: 'IndexedDB storage for complete data sovereignty.',
			icon: Database
		},
		{
			title: 'Vector Engine',
			description: 'Client-side PDF generation via pdfmake.',
			icon: Cpu
		},
		{
			title: 'Smart Templates',
			description: 'Professional layouts (Modern, Bold, Tech).',
			icon: LayoutTemplate
		},
		{
			title: 'Markdown Notes',
			description: 'Rich text formatting for invoice terms.',
			icon: FileText
		},
		{
			title: 'Profile Sync',
			description: 'Auto-fill banking & business details.',
			icon: Zap
		},
		{
			title: 'Offline First',
			description: 'Zero latency, works without internet.',
			icon: ShieldCheck
		}
	];

	const audiences = [
		{ label: 'Freelancers', color: 'bg-primary/60' },
		{ label: 'Agencies', color: 'bg-emerald-500/60' },
		{ label: 'Solo Devs', color: 'bg-indigo-500/60' },
		{ label: 'Creators', color: 'bg-amber-500/60' }
	];

	const animateHero: Attachment<HTMLElement> = (node) => {
		// Fluid Staggered Entrance
		const heroEntrance = animate(
			'.hero-element',
			{ y: [50, 0], opacity: [0, 1] },
			{ duration: 1.2, delay: stagger(0.1), ease: [0.33, 1, 0.68, 1] }
		);

		// Abstract UI Mockup Bloom
		const heroMockup = animate(
			'.hero-mockup',
			{ y: [80, 0], opacity: [0, 1], scale: [0.95, 1] },
			{ duration: 1.4, ease: [0.33, 1, 0.68, 1], delay: 0.3 }
		);

		// Floating Magnetic Cards
		const mockupFloat = animate(
			'.mockup-float',
			{ y: [30, 0], opacity: [0, 1] },
			{
				duration: 1.2,
				delay: stagger(0.2, { startDelay: 1 }),
				ease: [0.34, 1.56, 0.64, 1]
			}
		);

		// Unified Scroll Triggered Glass Panels
		const stopInViewPanels = inView(
			'.glass-panel',
			(element) => {
				animate(
					element,
					{ y: [60, 0], opacity: [0, 1] },
					{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }
				);
			},
			{ margin: '0px 0px -15% 0px' }
		);

		// Protocol Steps Stagger
		const stopInViewSteps = inView(
			'.steps-section',
			() => {
				animate(
					'.step-item',
					{ y: [50, 0], opacity: [0, 1] },
					{ duration: 1.2, delay: stagger(0.2), ease: [0.33, 1, 0.68, 1] }
				);
			},
			{ margin: '0px 0px -20% 0px' }
		);

		// Parallax Ambient Light
		const stopScroll = scroll(animate('.ambient-light', { y: [0, '30vh'] }, { ease: 'linear' }), {
			target: node,
			offset: ['start start', 'end start']
		});

		return () => {
			heroEntrance.stop();
			heroMockup.stop();
			mockupFloat.stop();
			stopInViewPanels();
			stopInViewSteps();
			stopScroll();
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
				const controls = animate(0, 35, {
					duration: 2,
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
	<title>Tech Invoice Forge | The Anti-SaaS Invoicing Engine</title>
</svelte:head>

<!-- Global Noise Texture -->
<svg class="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.02] mix-blend-overlay">
	<filter id="noise">
		<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
	</filter>
	<rect width="100%" height="100%" filter="url(#noise)" />
</svg>

<div
	class="flex min-h-screen flex-col overflow-clip bg-background text-foreground selection:bg-zinc-200 selection:text-black"
>
	<!-- Hero Section -->
	<section {@attach animateHero} class="hero-section relative pt-32 pb-24 md:pt-48 md:pb-32">
		<!-- Minimal Ambient Light -->
		<div class="ambient-light pointer-events-none absolute inset-0 overflow-hidden">
			<div
				class="absolute -top-[20%] -left-[10%] h-[70vw] w-[70vw] rounded-full bg-zinc-200/40 opacity-40 blur-[120px] dark:bg-zinc-800/20"
			></div>
			<div
				class="absolute top-[20%] right-[10%] h-[50vw] w-[50vw] rounded-full bg-slate-200/30 opacity-40 blur-[100px] dark:bg-slate-800/10"
			></div>
		</div>

		<div class="relative container mx-auto px-6 lg:px-12">
			<div class="mx-auto flex max-w-5xl flex-col items-center space-y-10 text-center">
				<!-- Headline -->
				<h1
					class="hero-element font-sans text-5xl leading-[1.05] font-extrabold tracking-tight text-primary md:text-7xl lg:text-[5.5rem]"
				>
					Sovereign Invoicing,<br class="hidden md:block" />
					<span class="font-serif font-light text-muted-foreground italic">zero friction.</span>
				</h1>

				<p class="hero-element max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
					Stop paying $20/month just to send a PDF. A precision financial instrument built for the
					modern edge. Featuring <strong class="text-foreground">persistent history</strong>,
					<strong class="text-foreground">automated profile syncing</strong>, and mathematics
					compiled locally on your device.
				</p>

				<!-- Magnetic CTA -->
				<div class="hero-element flex w-full flex-col justify-center gap-4 pt-6 sm:flex-row">
					<Button
						size="lg"
						href="/invoice/new"
						class="group h-14 rounded-full bg-foreground px-8 text-base font-medium text-background shadow-sm transition-all duration-200 hover:bg-foreground/90 hover:ring-4 hover:ring-foreground/10"
					>
						Access Generator
						<ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Button>
				</div>

				<!-- Built For Marquee / Badges -->
				<div
					class="hero-element pt-12 font-mono text-sm tracking-widest text-muted-foreground uppercase"
				>
					<p class="mb-4 text-[10px] opacity-60">Engineered Specifically For</p>
					<div class="flex flex-wrap justify-center gap-6 opacity-80">
						{#each audiences as audience}
							<span class="flex items-center gap-2">
								<div class="h-1.5 w-1.5 rounded-full {audience.color}"></div>
								{audience.label}
							</span>
						{/each}
					</div>
				</div>
			</div>

			<!-- Abstract Organic UI Mockup -->
			<div class="hero-mockup relative mx-auto mt-24 max-w-5xl">
				<!-- Outer Glass Lens -->
				<div
					class="rounded-[3rem] border border-border/20 bg-card/10 p-2 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.2)] ring-1 ring-white/10 backdrop-blur-3xl dark:shadow-[0_30px_100px_-20px_rgba(0,0,0,0.6)] dark:ring-white/5"
				>
					<!-- Inner Rig -->
					<div
						class="relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-background/95 shadow-inner backdrop-blur-xl"
					>
						<!-- Control Bar -->
						<div
							class="flex h-14 items-center justify-between border-b border-border/20 bg-muted/10 px-6 backdrop-blur-md"
						>
							<div class="flex gap-2">
								<div class="h-3 w-3 rounded-full bg-border/60"></div>
								<div class="h-3 w-3 rounded-full bg-border/60"></div>
								<div class="h-3 w-3 rounded-full bg-border/60"></div>
							</div>
							<div
								class="flex items-center gap-2 rounded-full border border-border/20 bg-muted/20 px-4 py-1.5 font-mono text-[10px] text-muted-foreground"
							>
								<Shield class="h-3 w-3 text-emerald-500" />
								<span>SECURE OFFLINE CONTEXT</span>
							</div>
						</div>
						<!-- Editor Core -->
						<div class="flex min-h-100 flex-col overflow-hidden">
							<div class="grid flex-1 grid-cols-1 md:grid-cols-[1fr_300px]">
								<!-- Main Editor Payload -->
								<div class="p-8 md:p-12">
									<div class="mb-10 flex items-center justify-between">
										<div class="space-y-4">
											<div
												class="h-10 w-48 rounded-2xl border border-primary/20 bg-primary/10"
											></div>
											<div class="h-4 w-64 rounded-full bg-muted/60"></div>
										</div>
										<div
											class="flex h-16 w-16 items-center justify-center rounded-3xl border border-border/30 bg-muted/10 shadow-sm backdrop-blur-sm"
										>
											<User class="h-8 w-8 text-muted-foreground/30" />
										</div>
									</div>
									<div class="space-y-6">
										<div class="h-4 w-full max-w-md rounded-full bg-muted/30"></div>
										<div class="h-4 w-full max-w-sm rounded-full bg-muted/20"></div>
										<div class="grid grid-cols-2 gap-6 pt-4">
											<div class="h-14 rounded-2xl border border-border/30 bg-muted/5"></div>
											<div class="h-14 rounded-2xl border border-border/30 bg-muted/5"></div>
										</div>
									</div>
								</div>
								<!-- Side Review Panel -->
								<div class="hidden border-l border-border/20 bg-muted/5 p-6 md:block">
									<div class="mb-6 h-6 w-24 rounded-full bg-muted/30"></div>
									<div
										class="flex aspect-[1/1.4] w-full flex-col gap-4 rounded-2xl border border-border/20 bg-background/50 p-4 shadow-sm backdrop-blur-sm"
									>
										<div class="h-4 w-full rounded-full bg-muted/20"></div>
										<div class="h-2 w-1/2 rounded-full bg-muted/10"></div>
										<div class="mt-auto h-10 w-full rounded-xl bg-primary/10"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Floating Widget 1: Persistent Profile -->
				<div
					class="mockup-float absolute -top-8 -right-8 hidden rounded-4xl border border-border/30 bg-background/70 p-5 shadow-2xl ring-1 ring-white/10 backdrop-blur-2xl md:block dark:ring-white/5"
				>
					<div class="flex items-center gap-4">
						<div
							class="flex h-14 w-14 items-center justify-center rounded-[1.2rem] border border-primary/20 bg-primary/10"
						>
							<User class="h-6 w-6 text-primary" />
						</div>
						<div>
							<div class="text-sm font-semibold">Profile Locked</div>
							<div class="mt-1 font-mono text-xs text-muted-foreground">SENDER SYNCED</div>
						</div>
					</div>
				</div>

				<!-- Floating Widget 2: IndexedDB History -->
				<div
					class="mockup-float absolute bottom-24 -left-10 hidden rounded-4xl border border-border/30 bg-background/70 p-5 shadow-2xl ring-1 ring-white/10 backdrop-blur-2xl md:block dark:ring-white/5"
				>
					<div class="flex items-center gap-4">
						<div
							class="flex h-14 w-14 items-center justify-center rounded-[1.2rem] border border-emerald-500/20 bg-emerald-500/10"
						>
							<History class="h-6 w-6 text-emerald-500" />
						</div>
						<div>
							<div class="text-sm font-semibold">Auto-Saved to Vault</div>
							<div class="mt-1 font-mono text-[10px] text-emerald-500/80">INDEXED DB</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Capabilities Stack -->
	<section class="relative bg-muted/5 py-24 md:py-32" id="features">
		<div class="container mx-auto px-6 lg:px-12">
			<div class="glass-panel mx-auto mb-20 max-w-3xl space-y-6 md:text-center">
				<h2 class="font-sans text-4xl font-extrabold tracking-tight md:text-5xl">
					Engineered for autonomy.
				</h2>
				<p class="text-xl leading-relaxed text-muted-foreground">
					TIF has evolved beyond simple generation into a comprehensive invoice management system
					confined entirely to your local device.
				</p>
			</div>

			<div class="mx-auto flex max-w-4xl flex-col gap-[35vh] pb-[30vh]">
				{#each coreCapabilities as capability (capability.title)}
					<FeatureCard
						icon={capability.icon}
						title={capability.title}
						description={capability.description}
						iconColor={capability.iconColor}
						blurColor={capability.blurColor}
					/>
				{/each}
			</div>
		</div>
	</section>

	<!-- Pricing Comparison -->
	<section class="relative py-24 md:py-32">
		<div class="container mx-auto px-6 lg:px-12">
			<div class="mb-16 text-center">
				<h2 class="font-sans text-4xl font-extrabold tracking-tight md:text-5xl">
					The Cost of Renting.
				</h2>
				<p class="mt-4 text-xl text-muted-foreground">
					Why pay a monthly premium to access your own financial data?
				</p>
			</div>

			<div
				class="glass-panel mx-auto flex max-w-5xl flex-col overflow-hidden rounded-[3rem] border border-border/30 bg-background/50 shadow-2xl ring-1 ring-white/10 backdrop-blur-3xl md:flex-row dark:ring-white/5"
			>
				<!-- Typical SaaS -->
				<div class="flex-1 border-b border-border/20 bg-muted/20 p-10 md:border-r md:border-b-0">
					<div class="mb-6 flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10 text-destructive"
						>
							<Minus class="h-5 w-5" />
						</div>
						<h3 class="font-mono text-sm tracking-wider text-muted-foreground uppercase">
							Typical SaaS
						</h3>
					</div>
					<p class="mb-6 text-sm leading-relaxed text-muted-foreground">
						Cloud-dependent subscriptions that hold your financial data hostage behind recurring
						paywalls and arbitrary limits.
					</p>
					<div class="mb-8 flex items-baseline gap-2">
						<span
							class="text-5xl font-extrabold tracking-tight text-foreground/80"
							{@attach animateCloudPrice}>$0</span
						>
						<span
							class="font-mono text-xs font-medium tracking-widest text-muted-foreground uppercase"
							>/ month</span
						>
					</div>
					<div class="mb-6 h-px w-full bg-border/40"></div>
					<ul class="space-y-4 text-sm text-muted-foreground">
						{#each saasDrawbacks as drawback}
							<li class="flex items-center gap-3">
								<Minus class="h-4 w-4 shrink-0 opacity-50" />
								<span>{drawback}</span>
							</li>
						{/each}
					</ul>
					<div
						class="mt-10 inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/50 px-3 py-1.5 font-mono text-[10px] tracking-widest text-muted-foreground uppercase"
					>
						<Database class="h-3 w-3" /> Remote Server
					</div>
				</div>

				<!-- TIF Alternative -->
				<div class="relative flex-1 overflow-hidden bg-card/60 p-10">
					<div
						class="absolute top-0 right-0 h-full w-1/2 bg-linear-to-l from-primary/5 to-transparent"
					></div>
					<div class="relative">
						<div class="mb-6 flex items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary"
							>
								<Plus class="h-5 w-5" />
							</div>
							<h3 class="font-mono text-sm font-bold tracking-wider text-primary uppercase">
								Tech Invoice Forge
							</h3>
						</div>
						<p class="mb-6 text-sm leading-relaxed text-foreground/80">
							A local-first, zero-latency engine. Your data never leaves your device, and you never
							pay a cent for access.
						</p>
						<div class="mb-8 flex items-baseline gap-2">
							<span
								class="text-5xl font-extrabold tracking-tight text-foreground"
								{@attach animateLocalPrice}>$100</span
							>
							<span class="font-mono text-xs font-medium tracking-widest text-primary uppercase"
								>/ forever</span
							>
						</div>
						<div class="mb-6 h-px w-full bg-primary/10"></div>
						<ul class="space-y-4 text-sm text-foreground/90">
							{#each tifBenefits as benefit}
								<li class="flex items-center gap-3">
									<Check class="h-4 w-4 shrink-0 text-primary" />
									<span class="font-medium">{benefit}</span>
								</li>
							{/each}
						</ul>
						<div
							class="mt-10 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 font-mono text-[10px] tracking-widest text-primary uppercase"
						>
							<Cpu class="h-3 w-3" /> Local Execution
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- System Capabilities -->
	<section class="steps-section border-t border-border/40 bg-muted/5 py-24 md:py-32">
		<div class="container mx-auto px-6 lg:px-12">
			<div class="max-w-8xl mx-auto">
				<div class="mb-20 text-center">
					<h2 class="font-sans text-4xl font-extrabold tracking-tight md:text-5xl">
						System Capabilities.
					</h2>
					<p class="mt-4 text-xl leading-relaxed text-muted-foreground">
						A complete suite of financial tools running locally in your browser.
					</p>
				</div>

				<div class="flex flex-col border-t border-border/40">
					{#each features as feature, i}
						<div
							class="step-item group flex flex-col items-start justify-between border-b border-border/40 py-12 transition-all duration-500 hover:bg-muted/20 hover:px-6 md:flex-row md:items-center"
						>
							<div class="flex items-center gap-8 md:w-1/2">
								<span
									class="font-mono text-2xl text-muted-foreground/30 transition-colors duration-500 group-hover:text-primary"
									>0{i + 1}</span
								>
								<h3
									class="font-serif text-4xl font-light tracking-tight transition-transform duration-500 group-hover:translate-x-4 md:text-5xl"
								>
									{feature.title}
								</h3>
							</div>
							<div class="mt-6 flex items-center gap-6 md:mt-0 md:w-1/3">
								<div
									class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted text-foreground shadow-sm ring-1 ring-border/50 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:ring-primary/50"
								>
									<feature.icon class="h-6 w-6" />
								</div>
								<p
									class="text-lg leading-relaxed text-muted-foreground transition-colors duration-500 group-hover:text-foreground"
								>
									{feature.description}
								</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- FAQ -->
	<section class="relative border-t border-border/40 bg-background py-24 md:py-32">
		<div class="container mx-auto px-6 lg:px-12">
			<div class="mx-auto max-w-4xl">
				<div class="mb-16 text-center">
					<h2 class="font-sans text-4xl font-extrabold tracking-tight md:text-5xl">
						Engine Specifications.
					</h2>
					<p class="mt-4 text-xl text-muted-foreground">
						Answers to frequent inquiries regarding the architecture.
					</p>
				</div>

				<Accordion.Root type="single" class="w-full space-y-4">
					{#each faqs as faq, i}
						<Accordion.Item
							value="item-{i}"
							class="rounded-2xl border border-border/40 bg-muted/10 px-6 py-2 shadow-sm transition-all duration-300 hover:bg-muted/30 hover:shadow-md data-[state=open]:bg-muted/20"
						>
							<Accordion.Trigger
								class="text-left text-lg font-medium transition-colors hover:no-underline data-[state=open]:text-primary"
							>
								{faq.question}
							</Accordion.Trigger>
							<Accordion.Content class="pb-4 text-base leading-relaxed text-muted-foreground">
								{faq.answer}
							</Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>
			</div>
		</div>
	</section>

	<!-- Final CTA -->
	<section
		class="relative overflow-hidden border-t border-border/40 bg-zinc-950 py-36 text-zinc-50 dark:border-border/40 dark:bg-zinc-950"
	>
		<!-- Subtle cool ambient overlays -->
		<div
			class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--tw-gradient-stops))] from-zinc-900 via-transparent to-transparent opacity-40"
		></div>

		<div class="relative container mx-auto px-6 text-center">
			<div class="mx-auto max-w-4xl space-y-10">
				<h2
					class="font-serif text-6xl leading-none font-light tracking-tight text-white italic md:text-[6.5rem]"
				>
					Ready for extraction?
				</h2>
				<p class="font-mono text-xl tracking-widest text-zinc-400 uppercase">
					NO DATABASES. NO ACCOUNTS. JUST TOOLS.
				</p>
				<div class="flex flex-col justify-center gap-4 pt-10 sm:flex-row">
					<div class="group relative">
						<div
							class="absolute -inset-1 rounded-full bg-white/20 blur-lg transition-all duration-500 group-hover:bg-white/40 group-hover:blur-xl"
						></div>
						<Button
							size="lg"
							href="/invoice/new"
							class="relative h-16 w-full rounded-full bg-white px-20 text-lg font-bold text-black shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-zinc-200 sm:h-20 sm:w-auto sm:px-16 sm:text-xl"
						>
							Access Generator
							<ArrowRight class="ml-4 h-6 w-6 transition-transform group-hover:translate-x-3" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>
