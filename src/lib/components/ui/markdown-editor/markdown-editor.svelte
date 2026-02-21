<script lang="ts">
	import { Bold, Italic, List, ListOrdered, Image, Link, Code } from '@lucide/svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	let {
		value = $bindable(''),
		class: className,
		placeholder,
		rows = 4,
		ref = $bindable(null),
		...props
	}: {
		value?: string;
		class?: string;
		placeholder?: string;
		rows?: number;
		ref?: HTMLTextAreaElement | null;
	} & HTMLTextareaAttributes = $props();

	function insertFormatting(prefix: string, suffix: string = '') {
		if (!ref) return;

		const start = ref.selectionStart;
		const end = ref.selectionEnd;
		const text = ref.value;
		const selection = text.substring(start, end);

		const before = text.substring(0, start);
		const after = text.substring(end);

		const newValue = before + prefix + selection + suffix + after;

		value = newValue;

		// Restore focus and selection
		requestAnimationFrame(() => {
			if (ref) {
				ref.focus();
				const newCursorPos = start + prefix.length + selection.length + suffix.length;
				// If we wrapped text, select the wrapped text. If insertion, move cursor after.
				if (selection.length > 0) {
					ref.setSelectionRange(start + prefix.length, end + prefix.length);
				} else {
					ref.setSelectionRange(start + prefix.length, start + prefix.length);
				}
			}
		});
	}

	function insertList(prefix: string) {
		if (!ref) return;

		const start = ref.selectionStart;
		const text = ref.value;

		// Find start of current line
		const lineStart = text.lastIndexOf('\n', start - 1) + 1;

		const before = text.substring(0, lineStart);
		const after = text.substring(lineStart);

		const newValue = before + prefix + after;

		value = newValue;

		requestAnimationFrame(() => {
			if (ref) {
				ref.focus();
				ref.setSelectionRange(start + prefix.length, start + prefix.length);
			}
		});
	}
</script>

<div class={cn('flex flex-col gap-2', className)}>
	<div class="flex items-center gap-1 rounded-md border bg-muted/50 p-1">
		<Button
			variant="ghost"
			size="icon"
			class="h-8 w-8"
			onclick={() => insertFormatting('**', '**')}
			title="Bold"
		>
			<Bold class="h-4 w-4" />
			<span class="sr-only">Bold</span>
		</Button>
		<Button
			variant="ghost"
			size="icon"
			class="h-8 w-8"
			onclick={() => insertFormatting('*', '*')}
			title="Italic"
		>
			<Italic class="h-4 w-4" />
			<span class="sr-only">Italic</span>
		</Button>
		<div class="mx-1 h-4 w-px bg-border"></div>
		<Button
			variant="ghost"
			size="icon"
			class="h-8 w-8"
			onclick={() => insertList('- ')}
			title="Bullet List"
		>
			<List class="h-4 w-4" />
			<span class="sr-only">Bullet List</span>
		</Button>
		<Button
			variant="ghost"
			size="icon"
			class="h-8 w-8"
			onclick={() => insertList('1. ')}
			title="Numbered List"
		>
			<ListOrdered class="h-4 w-4" />
			<span class="sr-only">Numbered List</span>
		</Button>
	</div>
	<Textarea bind:ref bind:value {placeholder} {rows} class="font-mono text-sm" {...props} />
	<div class="text-right text-xs text-muted-foreground">
		Supports basic markdown (Bold, Italic, Lists)
	</div>
</div>
