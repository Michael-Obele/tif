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
		Clock,
		Sparkles,
		Shield,
		Smartphone,
		FileText
	} from '@lucide/svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { invoiceStore } from '$lib/stores/invoice.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import ModeToggle from './mode-toggle.svelte';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	let isOpen = $state(false);
	let scrolled = $state(false);

	// Use MediaQuery to detect mobile breakpoint
	const isMobileQuery = new MediaQuery('max-width: 767px');
	let isMobile = $derived(isMobileQuery.current);
	let show = $derived(isOpen && isMobile);

	// Track scroll
	$effect(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 10;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	// Close sheet on desktop transition
	$effect(() => {
		if (!isMobile) isOpen = false;
	});

	function closeMenu() {
		isOpen = false;
	}

	function isActive(href: string): boolean {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}

	// ListItem component for Navigation Menu
	import { type Snippet } from 'svelte';

	interface ListItemProps {
		class?: string;
		title?: string;
		href?: string;
		children?: Snippet;
		[key: string]: any;
	}

	// We can't define component inside component easily in Svelte 5 with snippets yet without extraction
	// But we can just inline the markup in the menu for simplicity or use a render snippet.
</script>

{#snippet listItem({ className, title, href, children, ...props }: ListItemProps)}
	<li>
		<NavigationMenu.Link
			{href}
			class={cn(
				'block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
				className
			)}
			{...props}
		>
			<div class="text-sm leading-none font-medium">{title}</div>
			<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
				{@render children?.()}
			</p>
		</NavigationMenu.Link>
	</li>
{/snippet}

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

		<!-- Desktop Navigation Menu -->
		<div class="hidden flex-1 justify-center md:flex">
			<NavigationMenu.Root>
				<NavigationMenu.List>
					<NavigationMenu.Item>
						<NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
						<NavigationMenu.Content>
							<ul class="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
								<li class="row-span-3">
									<NavigationMenu.Link
										href="/"
										class="flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b from-muted/50 to-muted p-6 no-underline outline-none select-none focus:shadow-md"
									>
										<Hammer class="mb-2 h-6 w-6 text-primary" />
										<div class="mt-4 mb-2 text-lg font-medium">Tech Invoice Forge</div>
										<p class="text-sm leading-tight text-muted-foreground">
											Offline-first invoice generator for modern developers.
										</p>
									</NavigationMenu.Link>
								</li>
								{@render listItem({ href: '/#features', title: 'Features', children: featureDesc })}
								{@render listItem({ href: '/pricing', title: 'Pricing', children: pricingDesc })}
								{@render listItem({ href: '/invoice/new', title: 'Live Demo', children: demoDesc })}
							</ul>
						</NavigationMenu.Content>
					</NavigationMenu.Item>

					<NavigationMenu.Item>
						<NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
						<NavigationMenu.Content>
							<ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
								{@render listItem({
									href: 'https://github.com/Michael-Obele/tif',
									title: 'GitHub',
									children: githubDesc,
									target: '_blank'
								})}
								{@render listItem({
									href: 'https://github.com/Michael-Obele/tif/blob/main/README.md',
									title: 'Documentation',
									children: docsDesc,
									target: '_blank'
								})}
								{@render listItem({
									href: 'https://github.com/Michael-Obele/tif/issues',
									title: 'Report Issue',
									children: itemsDesc,
									target: '_blank'
								})}
								{@render listItem({
									href: '/privacy',
									title: 'Privacy Policy',
									children: privacyDesc
								})}
							</ul>
						</NavigationMenu.Content>
					</NavigationMenu.Item>

					<NavigationMenu.Item>
						<NavigationMenu.Link
							href="/invoice/new"
							class={cn(
								navigationMenuTriggerStyle(),
								isActive('/invoice/new') && 'bg-accent text-accent-foreground'
							)}
						>
							App
						</NavigationMenu.Link>
					</NavigationMenu.Item>

					<NavigationMenu.Item>
						<NavigationMenu.Link
							href="/invoices"
							class={cn(
								navigationMenuTriggerStyle(),
								isActive('/invoices') && 'bg-accent text-accent-foreground'
							)}
						>
							History
						</NavigationMenu.Link>
					</NavigationMenu.Item>

					<NavigationMenu.Item>
						<NavigationMenu.Link href="/pricing" class={navigationMenuTriggerStyle()}>
							Pricing
						</NavigationMenu.Link>
					</NavigationMenu.Item>
				</NavigationMenu.List>
			</NavigationMenu.Root>
		</div>

		<!-- Actions Section -->
		<div class="flex items-center gap-3">
			<ModeToggle />

			<!-- Desktop CTA -->
			{#if isActive('/invoice/new') || isActive('/invoices')}
				<div class="hidden items-center gap-2 md:flex">
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
				<Button href="/invoice/new" class="group hidden gap-2 md:inline-flex">
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
								<a
									href="/"
									class="flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
									onclick={closeMenu}
								>
									Home
								</a>
								<a
									href="/pricing"
									class="flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
									onclick={closeMenu}
								>
									Pricing
								</a>
								<a
									href="https://github.com/Michael-Obele/tif"
									target="_blank"
									class="flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
									onclick={closeMenu}
								>
									GitHub
								</a>

								<a
									href="/invoice/new"
									class={cn(
										'flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted',
										isActive('/invoice/new') && 'bg-accent/50 text-accent-foreground'
									)}
									onclick={closeMenu}
								>
									App
								</a>

								<a
									href="/invoices"
									class={cn(
										'flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted',
										isActive('/invoices') && 'bg-accent/50 text-accent-foreground'
									)}
									onclick={closeMenu}
								>
									History
								</a>

								<Separator class="my-4" />

								{#if isActive('/invoice/new') || isActive('/invoices')}
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
									<Button href="/invoice/new" class="group w-full gap-2" onclick={closeMenu}>
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

{#snippet featureDesc()}
	Explore privacy-first, client-side PDF generation.
{/snippet}

{#snippet pricingDesc()}
	Free forever for freelancers. No hidden fees.
{/snippet}

{#snippet demoDesc()}
	Try the editor instantly. No signup required.
{/snippet}

{#snippet githubDesc()}
	View the source code, star the repo, and contribute.
{/snippet}

{#snippet docsDesc()}
	Read the full documentation and setup guide.
{/snippet}

{#snippet itemsDesc()}
	Found a bug? Let us know on GitHub.
{/snippet}

{#snippet privacyDesc()}
	Learn how we protect your data (by not collecting it).
{/snippet}
