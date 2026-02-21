<script lang="ts">
	import type { Snippet } from 'svelte';
	import { type Icon as IconType } from '@lucide/svelte';

	interface Props {
		icon: typeof IconType;
		title: string;
		description: string;
		iconColor: string;
		blurColor: string;
		children?: Snippet;
	}

	let { icon: Icon, title, description, iconColor, blurColor }: Props = $props();
</script>

<div
	class="group sticky top-[15vh] w-full overflow-hidden rounded-[2.5rem] border border-border/30 bg-background p-1 shadow-2xl ring-1 ring-white/5 transition-all duration-500 hover:border-border/60"
>
	<div
		class="relative z-10 flex h-112.5 flex-col overflow-hidden rounded-[2.3rem] bg-card/95 p-10 md:p-14"
	>
		<div
			class="mb-8 flex h-20 w-20 items-center justify-center rounded-[1.8rem] border border-border/40 bg-primary/5 shadow-inner transition-transform duration-700 ease-out group-hover:scale-110"
		>
			<Icon class="h-10 w-10 {iconColor}" />
		</div>
		<h3 class="mb-4 font-sans text-3xl font-bold">{title}</h3>
		<p class="flex-1 text-xl leading-relaxed text-muted-foreground">
			{description}
		</p>
		<div
			class="absolute right-[-10%] bottom-[-50%] h-140 w-140 rounded-full {blurColor} blur-[120px] transition-colors duration-700 group-hover:bg-primary/10"
		></div>
	</div>
</div>
