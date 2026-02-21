<script lang="ts">
	import { Hammer, Github, ExternalLink, Heart, Mail, Zap } from '@lucide/svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';

	const currentYear = new Date().getFullYear();

	const productLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/pricing', label: 'Pricing' },
		{ href: '/app', label: 'Launch App' }
	];

	const resourceLinks = [
		{ href: 'https://github.com/Michael-Obele/tif', label: 'GitHub', external: true },
		{ href: 'https://github.com/Michael-Obele/tif/issues', label: 'Report Issue', external: true },
		{
			href: 'https://github.com/Michael-Obele/tif/blob/main/LICENSE',
			label: 'License',
			external: true
		}
	];

	const socialLinks = [
		{
			href: 'https://github.com/Michael-Obele',
			label: 'GitHub',
			icon: Github
		}
	];
</script>

<footer class="footer-border-gradient mt-auto border-t bg-muted/30">
	<div class="container mx-auto max-w-screen-2xl px-4 py-12 md:py-16">
		<!-- Main Footer Grid -->
		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
			<!-- Brand Column -->
			<div class="sm:col-span-2 lg:col-span-1">
				<a href="/" class="group mb-4 inline-flex items-center gap-2">
					<div class="icon-spin-hover">
						<Hammer class="h-6 w-6 text-primary" />
					</div>
					<span class="text-lg font-semibold tracking-tight">Tech Invoice Forge</span>
				</a>
				<p class="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
					Create professional invoices in seconds. Free, fast, and designed for developers and
					freelancers.
				</p>
				<Button href="/app" variant="outline" size="sm" class="group gap-2">
					<Zap class="h-4 w-4" />
					<span>Get Started</span>
				</Button>
			</div>

			<!-- Product Links -->
			<div>
				<h3 class="mb-4 text-sm font-semibold tracking-wider text-foreground uppercase">Product</h3>
				<ul class="space-y-3">
					{#each productLinks as link}
						<li>
							<a
								href={link.href}
								class="link-underline inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Resources Links -->
			<div>
				<h3 class="mb-4 text-sm font-semibold tracking-wider text-foreground uppercase">
					Resources
				</h3>
				<ul class="space-y-3">
					{#each resourceLinks as link}
						<li>
							<a
								href={link.href}
								class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
								target={link.external ? '_blank' : undefined}
								rel={link.external ? 'noopener noreferrer' : undefined}
							>
								{link.label}
								{#if link.external}
									<ExternalLink class="h-3 w-3 opacity-50" />
								{/if}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Connect Column -->
			<div>
				<h3 class="mb-4 text-sm font-semibold tracking-wider text-foreground uppercase">Connect</h3>
				<div class="flex gap-2">
					{#each socialLinks as link}
						<a
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							class="scale-hover inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
							aria-label={link.label}
						>
							<svelte:component this={link.icon} class="h-5 w-5" />
						</a>
					{/each}
				</div>
				<p class="mt-4 text-xs text-muted-foreground">Open source and free to use</p>
			</div>
		</div>

		<Separator class="my-8" />

		<!-- Bottom Bar -->
		<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
			<p class="text-center text-xs text-muted-foreground sm:text-left">
				© {currentYear} Tech Invoice Forge. All rights reserved.
			</p>
			<p class="flex items-center gap-1.5 text-xs text-muted-foreground">
				Made with
				<Heart class="h-3.5 w-3.5 fill-current text-red-500" />
				by
				<a
					href="https://github.com/Michael-Obele"
					target="_blank"
					rel="noopener noreferrer"
					class="font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
				>
					Michael-Obele
				</a>
			</p>
		</div>
	</div>
</footer>
