<script lang="ts">
	import { page } from '$app/state';
	import { Hammer, Github, ExternalLink, Heart } from '@lucide/svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { cn } from '$lib/utils'; // Assumed from context, otherwise will import or just use template switch

	const currentYear = new Date().getFullYear();

	// Helper to check active state
	function isActive(href: string) {
		if (href === '/') return page.url.pathname === '/';
		if (href.startsWith('http')) return false;
		return page.url.pathname.startsWith(href);
	}

	const productLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/pricing', label: 'Pricing' },
		{ href: '/invoice/new', label: 'New Invoice' }
	];

	const resourceLinks = [
		{ href: 'https://github.com/Michael-Obele/tif', label: 'GitHub Repository', external: true },
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

<footer
	class="mt-auto border-t border-border/40 bg-zinc-50/40 backdrop-blur-xl transition-all duration-300 dark:bg-zinc-950/40"
>
	<div class="container mx-auto max-w-screen-2xl px-6 py-16 lg:py-24">
		<div class="grid gap-12 lg:grid-cols-12 lg:gap-8">
			<!-- Brand & Statement: Left -->
			<div class="flex flex-col gap-6 lg:col-span-4">
				<a href="/" class="group inline-flex items-center gap-2.5">
					<div
						class="rounded-xl bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary/20"
					>
						<Hammer class="h-5 w-5" />
					</div>
					<span class="text-xl font-bold tracking-tight text-foreground">Tech Invoice Forge</span>
				</a>
				<p class="max-w-xs text-sm leading-relaxed text-muted-foreground/80">
					Create professional invoices in seconds. Free, fast, and designed for modern
					professionals.
				</p>

				<!-- Open Source Badge -->
				<div class="mt-2 flex items-center">
					<a
						href="https://github.com/Michael-Obele/tif"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/30 px-3.5 py-1.5 text-xs font-medium tracking-wide text-foreground transition-all hover:bg-muted/60 hover:shadow-md"
					>
						<Github class="h-3.5 w-3.5" />
						<span>Proudly Open Source</span>
					</a>
				</div>
			</div>

			<!-- Links: Right -->
			<div class="grid flex-1 gap-8 sm:grid-cols-3 lg:col-span-8 lg:ml-auto lg:gap-16">
				<!-- Product -->
				<div class="flex flex-col gap-5">
					<h4 class="text-xs font-semibold tracking-widest text-foreground uppercase opacity-80">
						Product
					</h4>
					<ul class="flex flex-col gap-3.5">
						{#each productLinks as link}
							<li>
								<a
									href={link.href}
									class={
										isActive(link.href)
											? 'text-foreground font-semibold flex items-center before:mr-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-indigo-600 before:content-[""] dark:before:bg-indigo-400'
											: 'text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
									}
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
				<!-- Resources -->
				<div class="flex flex-col gap-5">
					<h4 class="text-xs font-semibold tracking-widest text-foreground uppercase opacity-80">
						Resources
					</h4>
					<ul class="flex flex-col gap-3.5">
						{#each resourceLinks as link}
							<li>
								<a
									href={link.href}
									target={link.external ? '_blank' : undefined}
									rel={link.external ? 'noopener noreferrer' : undefined}
									class="group inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
								>
									{link.label}
									{#if link.external}
										<ExternalLink
											class="ml-1 h-3 w-3 opacity-50 transition-transform group-hover:translate-x-px group-hover:-translate-y-px"
										/>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</div>
				<!-- Connect -->
				<div class="flex flex-col gap-5">
					<h4 class="text-xs font-semibold tracking-widest text-foreground uppercase opacity-80">
						Connect
					</h4>
					<ul class="flex flex-col gap-3.5">
						{#each socialLinks as link}
							<li>
								<a
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									class="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
								>
									<svelte:component
										this={link.icon}
										class="h-4 w-4 transition-transform group-hover:scale-110"
									/>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>

		<Separator class="my-10 bg-border/40 lg:my-14" />

		<!-- Bottom Bar -->
		<div
			class="flex flex-col items-center justify-between gap-4 text-xs tracking-wide text-muted-foreground sm:flex-row"
		>
			<p>© {currentYear} Tech Invoice Forge.</p>
			<p class="flex items-center gap-1.5 font-medium">
				Designed with
				<Heart class="h-3 w-3 fill-current text-red-500/80 transition-transform hover:scale-125" />
				by
				<a
					href="https://github.com/Michael-Obele"
					target="_blank"
					rel="noopener noreferrer"
					class="text-foreground transition-colors hover:text-primary"
				>
					Michael-Obele
				</a>
			</p>
		</div>
	</div>
</footer>
