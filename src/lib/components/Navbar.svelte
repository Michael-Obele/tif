<script lang="ts">
	import { page } from '$app/state';
	import { Hammer, Menu, X } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';

	let isOpen = $state(false);

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/pricing', label: 'Pricing' },
		{ href: 'https://github.com/Michael-Obele/tif', label: 'GitHub', external: true }
	];

	function closeMenu() {
		isOpen = false;
	}
</script>

<nav
	class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
>
	<div class="container mx-auto flex h-14 max-w-screen-2xl items-center px-4">
		<a href="/" class="mr-6 flex items-center space-x-2">
			<Hammer class="h-6 w-6" />
			<span class="hidden font-bold sm:inline-block">Tech Invoice Forge</span>
		</a>
		<div class="mr-4 hidden md:flex">
			<nav class="flex items-center gap-6 text-sm font-medium">
				{#each links as link}
					<a
						href={link.href}
						class={page.url.pathname === link.href
							? 'text-foreground'
							: 'text-foreground/60 transition-colors hover:text-foreground/80'}
						target={link.external ? '_blank' : undefined}
						rel={link.external ? 'noreferrer' : undefined}
					>
						{link.label}
					</a>
				{/each}
			</nav>
		</div>
		<div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
			<div class="w-full flex-1 md:w-auto md:flex-none">
				<!-- Add Search or other items here if needed -->
			</div>
			<div class="flex items-center gap-2">
				<Button variant="outline" href="/app" class="hidden md:inline-flex">Launch App</Button>

				<!-- Mobile Menu -->
				<div class="md:hidden">
					<Sheet.Root bind:open={isOpen}>
						<Sheet.Trigger>
							{#snippet child({ props })}
								<Button variant="ghost" size="icon" {...props} aria-label="Toggle Menu">
									<Menu class="h-5 w-5" />
								</Button>
							{/snippet}
						</Sheet.Trigger>
						<Sheet.Content side="right">
							<Sheet.Header>
								<Sheet.Title class="text-left font-bold">Tech Invoice Forge</Sheet.Title>
								<Sheet.Description class="sr-only">Main Navigation</Sheet.Description>
							</Sheet.Header>
							<div class="flex flex-col space-y-4 py-4">
								{#each links as link}
									<a
										href={link.href}
										class="text-sm font-medium text-foreground/70 hover:text-foreground"
										data-sveltekit-preload-data="hover"
										onclick={closeMenu}
									>
										{link.label}
									</a>
								{/each}
								<Button href="/app" class="w-full" onclick={closeMenu}>Launch App</Button>
							</div>
						</Sheet.Content>
					</Sheet.Root>
				</div>
			</div>
		</div>
	</div>
</nav>
