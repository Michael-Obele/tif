<script lang="ts">
	import EditorForm from '$lib/components/editor/EditorForm.svelte';
	import PdfPreviewPanel from '$lib/components/editor/PdfPreviewPanel.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Download, Eye } from '@lucide/svelte';
	import * as Sheet from '$lib/components/ui/sheet';
</script>

<div class="relative flex h-[calc(100vh-3.5rem)] flex-col bg-background md:flex-row">
	<!-- Left Panel: Editor -->
	<div class="w-full overflow-y-auto border-r bg-background pb-20 md:w-1/2 md:pb-0 lg:w-5/12">
		<EditorForm />
	</div>

	<!-- Right Panel: Preview (Desktop) -->
	<div class="hidden flex-col bg-muted/10 md:flex md:w-1/2 lg:w-7/12">
		<div class="flex items-center justify-between border-b bg-background px-6 py-2">
			<span class="text-sm font-medium">Preview</span>
			<div class="flex items-center gap-2">
				<Button variant="outline" size="sm">
					<Download class="mr-2 h-4 w-4" />
					Download PDF
				</Button>
			</div>
		</div>
		<div class="flex flex-1 justify-center overflow-y-auto bg-slate-100 p-8 dark:bg-slate-900/50">
			<div class="w-full max-w-[210mm]">
				<PdfPreviewPanel />
			</div>
		</div>
	</div>

	<!-- Mobile Sticky Footer -->
	<div class="fixed right-0 bottom-0 left-0 z-10 flex gap-4 border-t bg-background p-4 md:hidden">
		<Sheet.Root>
			<Sheet.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" class="flex-1" {...props}>
						<Eye class="mr-2 h-4 w-4" /> Preview
					</Button>
				{/snippet}
			</Sheet.Trigger>
			<Sheet.Content side="bottom" class="h-[90vh] sm:h-[90vh]">
				<Sheet.Header>
					<Sheet.Title>Invoice Preview</Sheet.Title>
				</Sheet.Header>
				<div class="h-full overflow-y-auto py-4">
					<PdfPreviewPanel />
				</div>
			</Sheet.Content>
		</Sheet.Root>

		<Button class="flex-1">
			<Download class="mr-2 h-4 w-4" /> Download
		</Button>
	</div>
</div>
