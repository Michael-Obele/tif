<script lang="ts">
	import { page } from '$app/state';
	import {
		Hammer,
		Menu,
		ArrowRight,
		ExternalLink,
		Github,
		Zap,
		FilePlus,
		Clock
	} from '@lucide/svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { invoiceStore } from '$lib/stores/invoice.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sheet from '$lib/components/ui/sheet';
	import ModeToggle from './mode-toggle.svelte';

	let isOpen = $state(false);
	let scrolled = $state(false);

	// Use MediaQuery to detect mobile breakpoint (md breakpoint is 768px)
	const isMobileQuery = new MediaQuery('max-width: 767px');
	let isMobile = $derived(isMobileQuery.current);

	// Show sheet content only when open and on mobile
	let show = $derived(isOpen && isMobile);

	// Track scroll for enhanced navbar styling
	$effect(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 10;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	// Close sheet when transitioning to desktop
	$effect(() => {
		if (!isMobile) {
			isOpen = false;
		}
	});

	const links: Array<{
		href: string;
		label: string;
		external?: boolean;
		badge?: string;
		icon?: typeof Github;
	}> = [
		{ href: '/', label: 'Home' },
		{ href: '/pricing', label: 'Pricing', badge: 'Free' },
		{ href: 'https://github.com/Michael-Obele/tif', label: 'GitHub', external: true, icon: Github }
	];

	function closeMenu() {
		isOpen = false;
	}

	function isActive(href: string): boolean {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}
</script>

<nav
	class="navbar-glass sticky top-0 z-50 w-full border-b transition-all duration-300 {scrolled
		? 'border-border/60 shadow-lg shadow-primary/5'
		: 'border-border/40'}"
>
	<div class="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
		<!-- Logo Section -->
		<a
			href="/"
			class="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
			aria-label="Tech Invoice Forge Home"
		>
			<div class="icon-spin-hover relative">
				<Hammer class="h-6 w-6 text-primary" />
				<div
					class="absolute -inset-1 -z-10 rounded-full bg-primary/10 opacity-0 blur transition-opacity group-hover:opacity-100"
				></div>
			</div>
			<span class="hidden text-lg font-semibold tracking-tight sm:inline-block">
				Tech Invoice Forge
			</span>
		</a>

		<!-- Desktop Navigation -->
		<div class="hidden items-center gap-1 md:flex">
			<Separator orientation="vertical" class="mx-4 h-6" />

			<nav class="flex items-center gap-1" aria-label="Main navigation">
				{#each links as link}
					<a
						href={link.href}
						class="link-underline flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors {isActive(
							link.href
						)
							? 'link-active text-foreground'
							: 'text-muted-foreground hover:text-foreground'}"
						target={link.external ? '_blank' : undefined}
						rel={link.external ? 'noopener noreferrer' : undefined}
					>
						{#if link.icon}
							<link.icon class="h-4 w-4" />
						{/if}
						{link.label}
						{#if link.badge}
							<Badge variant="secondary" class="ml-1 px-1.5 py-0 text-[10px]">
								{link.badge}
							</Badge>
						{/if}
						{#if link.external}
							<ExternalLink class="h-3 w-3 opacity-50" />
						{/if}
					</a>
				{/each}
			</nav>
		</div>

		<!-- Actions Section -->
		<div class="flex items-center gap-3">
			<ModeToggle />

			<!-- Desktop CTA -->
			{#if isActive('/app')}
				<div class="hidden items-center gap-2 md:flex">
					<Button variant="ghost" size="sm" href="/app/history" aria-label="View Invoice History">
						<Clock class="mr-1 h-4 w-4" />
						History
					</Button>

					<Button
						variant="ghost"
						size="sm"
						href="https://github.com/Michael-Obele/tif"
						target="_blank"
						aria-label="GitHub Repository"
					>
						<Github class="h-4 w-4" />
					</Button>

					<Button
						variant="secondary"
						size="sm"
						class="gap-2"
						onclick={() => invoiceStore.saveInvoiceAndCreateNew()}
					>
						<FilePlus class="h-4 w-4" />
						<span>Save & New</span>
					</Button>
				</div>
			{:else}
				<Button href="/app" class="group hidden gap-2 md:inline-flex">
					<Zap class="h-4 w-4" />
					<span>Launch App</span>
					<ArrowRight class="btn-arrow h-4 w-4" />
				</Button>
			{/if}

			<!-- Mobile Menu Trigger -->
			<div class="md:hidden">
				<Sheet.Root bind:open={isOpen}>
					<Sheet.Trigger>
						{#snippet child({ props })}
							<Button variant="ghost" size="icon" {...props} aria-label="Open navigation menu">
								<Menu class="h-5 w-5" />
							</Button>
						{/snippet}
					</Sheet.Trigger>
					{#if show}
						<Sheet.Content side="right" class="w-70 sm:w-[320px]">
							<Sheet.Header class="text-left">
								<Sheet.Title class="flex items-center gap-2">
									<Hammer class="h-5 w-5 text-primary" />
									<span>Tech Invoice Forge</span>
								</Sheet.Title>
								<Sheet.Description class="sr-only">Main navigation menu</Sheet.Description>
							</Sheet.Header>

							<div class="mt-6 flex flex-col gap-1">
								{#each links as link}
									<a
										href={link.href}
										class="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors {isActive(
											link.href
										)
											? 'bg-primary/10 text-primary'
											: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
										target={link.external ? '_blank' : undefined}
										rel={link.external ? 'noopener noreferrer' : undefined}
										onclick={closeMenu}
									>
										<span class="flex items-center gap-2">
											{#if link.icon}
												<link.icon class="h-4 w-4" />
											{/if}
											{link.label}
											{#if link.badge}
												<Badge variant="secondary" class="px-1.5 py-0 text-[10px]">
													{link.badge}
												</Badge>
											{/if}
										</span>
										{#if link.external}
											<ExternalLink class="h-3.5 w-3.5 opacity-50" />
										{/if}
									</a>
								{/each}

								<Separator class="my-4" />

								{#if isActive('/app')}
									<a
										href="/app/history"
										class="flex items-center rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
										onclick={closeMenu}
									>
										<Clock class="mr-2 h-4 w-4" />
										History
									</a>

									<Button
										variant="secondary"
										class="mb-2 w-full justify-start gap-2"
										onclick={() => {
											invoiceStore.saveInvoiceAndCreateNew();
											closeMenu();
										}}
									>
										<FilePlus class="h-4 w-4" />
										<span>Save & New</span>
									</Button>

									<a
										href="/"
										class="flex items-center rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
										onclick={closeMenu}
									>
										<ArrowRight class="mr-2 h-4 w-4 rotate-180" />
										Exit App
									</a>
								{:else}
									<Button href="/app" class="group w-full gap-2" onclick={closeMenu}>
										<Zap class="h-4 w-4" />
										<span>Launch App</span>
										<ArrowRight class="btn-arrow h-4 w-4" />
									</Button>
								{/if}
							</div>
						</Sheet.Content>
					{/if}
				</Sheet.Root>
			</div>
		</div>
	</div>
</nav>
