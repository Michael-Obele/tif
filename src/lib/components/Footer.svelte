<script lang="ts">
	import { Hammer } from '@lucide/svelte';
</script>

<footer class="border-t py-6 md:px-8 md:py-0">
	<div
		class="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row"
	>
		<div class="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
			<Hammer class="h-6 w-6" />
			<p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
				Built by <a
					href="https://github.com/Michael-Obele"
					target="_blank"
					rel="noreferrer"
					class="font-medium underline underline-offset-4"
				>
					Michael-Obele
				</a>
				. The source code is available on
				<a
					href="https://github.com/Michael-Obele/tif"
					target="_blank"
					rel="noreferrer"
					class="font-medium underline underline-offset-4"
				>
					GitHub
				</a>
				.
			</p>
		</div>
		<p class="text-center text-sm text-muted-foreground md:text-right">
			© {new Date().getFullYear()} Tech Invoice Forge
		</p>
	</div>
</footer>
