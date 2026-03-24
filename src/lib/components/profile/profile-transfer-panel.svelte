<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { profileStore } from '$lib/stores/profile.svelte';
	import type { ProfileImportPreview } from '$lib/utils/profile-transfer';
	import { toast } from 'svelte-sonner';
	import { cn } from '$lib/utils';
	import { Download, Eye, FileText, RefreshCcw, ShieldCheck, Upload, X } from '@lucide/svelte';

	let fileInput = $state<HTMLInputElement | null>(null);
	let isPreparingPreview = $state(false);
	let isApplyingImport = $state(false);
	let isExporting = $state(false);
	let isPreviewOpen = $state(false);
	let importSummary = $state('');
	let pendingImportText = $state('');
	let importPreview = $state<ProfileImportPreview | null>(null);

	const backupFileName = `tech-invoice-forge-profile-${new Date().toISOString().slice(0, 10)}.txt`;
	const previewLimit = 6;

	async function exportProfile() {
		isExporting = true;

		try {
			const payload = profileStore.exportProfileText();
			const blob = new Blob([payload], { type: 'text/plain;charset=utf-8' });
			const url = URL.createObjectURL(blob);
			const anchor = document.createElement('a');

			anchor.href = url;
			anchor.download = backupFileName;
			document.body.append(anchor);
			anchor.click();
			anchor.remove();
			URL.revokeObjectURL(url);

			toast.success('Profile backup exported');
		} catch (error) {
			console.error('Error exporting profile backup:', error);
			toast.error('Unable to export profile backup');
		} finally {
			isExporting = false;
		}
	}

	function openFilePicker() {
		fileInput?.click();
	}

	function resetPreviewState() {
		pendingImportText = '';
		importPreview = null;
		isPreviewOpen = false;
	}

	async function prepareImportPreview(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;

		isPreparingPreview = true;

		try {
			const rawText = await file.text();
			importPreview = profileStore.previewProfileImportText(rawText);
			pendingImportText = rawText;
			isPreviewOpen = true;
		} catch (error) {
			console.error('Error importing profile backup:', error);
			resetPreviewState();
			toast.error(error instanceof Error ? error.message : 'Unable to preview profile backup');
		} finally {
			input.value = '';
			isPreparingPreview = false;
		}
	}

	async function applyImport() {
		if (!pendingImportText || !importPreview) return;

		isApplyingImport = true;

		try {
			const result = await profileStore.importProfileText(pendingImportText);

			importSummary = `Sender updated. ${result.updatedClients} client${result.updatedClients === 1 ? '' : 's'} merged and ${result.createdClients} added.`;
			resetPreviewState();
			toast.success('Profile backup imported');
		} catch (error) {
			console.error('Error applying profile backup import:', error);
			toast.error(error instanceof Error ? error.message : 'Unable to import profile backup');
		} finally {
			isApplyingImport = false;
		}
	}
</script>

<div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
	<Card.Root class="overflow-hidden border-muted-foreground/15 bg-card shadow-sm">
		<Card.Header class="border-b bg-muted/15 pb-5">
			<div class="flex items-start justify-between gap-4">
				<div class="space-y-2">
					<div class="flex items-center gap-2 text-sm font-medium text-primary">
						<FileText class="h-4 w-4" />
						Profile transfer
					</div>
					<Card.Title class="text-2xl tracking-tight">Import or export your profile data</Card.Title
					>
					<Card.Description class="max-w-2xl text-sm leading-relaxed">
						Create a plain-text backup of your sender profile and client list, or restore data from
						a previous backup without leaving the browser.
					</Card.Description>
				</div>
				<Tooltip.Root>
					<Tooltip.Trigger
						class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/8 text-primary transition-colors hover:bg-primary/12"
					>
						<ShieldCheck class="h-4 w-4" />
					</Tooltip.Trigger>
					<Tooltip.Content class="max-w-64 bg-foreground text-background">
						<p class="text-xs leading-relaxed">
							Imports run locally in the browser. Matching clients merge by email first, then exact
							name and company.
						</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</div>
		</Card.Header>

		<Card.Content class="grid gap-4 p-6 md:grid-cols-2">
			<section class="rounded-2xl border border-border/70 bg-muted/10 p-5">
				<div class="mb-6 flex items-start gap-3">
					<div class="rounded-xl border border-primary/20 bg-primary/8 p-2.5 text-primary">
						<Download class="h-5 w-5" />
					</div>
					<div>
						<h3 class="text-base font-semibold tracking-tight">Export backup</h3>
						<p class="mt-1 text-sm leading-relaxed text-muted-foreground">
							Download a `.txt` snapshot of the current sender profile and every saved client.
						</p>
					</div>
				</div>

				<div class="space-y-3 text-sm text-muted-foreground">
					<p>Includes sender details, default terms, bank accounts, and your client directory.</p>
					<p>Useful for device migration, local backups, and restoring profile data later.</p>
				</div>

				<Button class="mt-6 w-full gap-2" onclick={exportProfile} disabled={isExporting}>
					<Download class="h-4 w-4" />
					{isExporting ? 'Exporting backup...' : 'Export profile backup'}
				</Button>
			</section>

			<section class="rounded-2xl border border-border/70 bg-muted/10 p-5">
				<div class="mb-6 flex items-start gap-3">
					<div class="rounded-xl border border-primary/20 bg-primary/8 p-2.5 text-primary">
						<Upload class="h-5 w-5" />
					</div>
					<div>
						<h3 class="text-base font-semibold tracking-tight">Import backup</h3>
						<p class="mt-1 text-sm leading-relaxed text-muted-foreground">
							Upload a `.txt` backup to merge clients into the current workspace and replace the
							active sender profile.
						</p>
					</div>
				</div>

				<div class="space-y-3 text-sm text-muted-foreground">
					<p>Existing clients merge by email when available, then by exact name and company.</p>
					<p>New clients are added without deleting the rest of your local data.</p>
				</div>

				<input
					bind:this={fileInput}
					type="file"
					accept=".txt,text/plain"
					class="sr-only"
					onchange={prepareImportPreview}
				/>

				<Button
					variant="outline"
					class="mt-6 w-full gap-2 border-dashed"
					onclick={openFilePicker}
					disabled={isPreparingPreview || isApplyingImport}
				>
					{#if isPreparingPreview}
						<RefreshCcw class="h-4 w-4 animate-spin" />
						Analyzing backup...
					{:else}
						<Upload class="h-4 w-4" />
						Choose backup file
					{/if}
				</Button>
			</section>
		</Card.Content>
	</Card.Root>

	<Card.Root class="border-muted-foreground/15 bg-card shadow-sm">
		<Card.Header>
			<Card.Title class="text-lg tracking-tight">What happens during import</Card.Title>
			<Card.Description>
				The backup stays plain text for portability, but the payload is validated before any local
				data is written.
			</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4 pb-6 text-sm text-muted-foreground">
			<div class="rounded-xl border bg-muted/10 p-4">
				<p class="font-medium text-foreground">Sender profile</p>
				<p class="mt-1 leading-relaxed">
					The imported sender replaces the active business profile so your next invoices use the
					restored details immediately.
				</p>
			</div>
			<div class="rounded-xl border bg-muted/10 p-4">
				<p class="font-medium text-foreground">Client merge</p>
				<p class="mt-1 leading-relaxed">
					Matching clients update in place. Non-matching clients are added as new records and
					existing unmatched clients remain untouched.
				</p>
			</div>
			<div class="rounded-xl border bg-muted/10 p-4">
				<p class="font-medium text-foreground">Backup format</p>
				<p class="mt-1 leading-relaxed">
					The file uses a versioned Tech Invoice Forge text payload so it remains easy to store,
					inspect, and re-import later.
				</p>
			</div>

			{#if importSummary}
				<div class="rounded-xl border border-primary/20 bg-primary/8 p-4 text-primary">
					<p class="font-medium">Last import</p>
					<p class="mt-1 text-sm leading-relaxed">{importSummary}</p>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>

<DialogPrimitive.Root bind:open={isPreviewOpen}>
	<DialogPrimitive.Portal>
		<DialogPrimitive.Overlay
			class="fixed inset-0 z-50 bg-black/55 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
		/>
		<DialogPrimitive.Content
			class={cn(
				'fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 gap-5 rounded-2xl border bg-background p-6 shadow-2xl duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95'
			)}
		>
			<Button
				variant="ghost"
				size="icon"
				class="absolute top-4 right-4 text-muted-foreground"
				onclick={resetPreviewState}
			>
				<X class="h-4 w-4" />
			</Button>

			<div class="space-y-2 pr-10">
				<div class="flex items-center gap-2 text-sm font-medium text-primary">
					<Eye class="h-4 w-4" />
					Import preview
				</div>
				<DialogPrimitive.Title class="text-2xl font-semibold tracking-tight">
					Review backup changes before import
				</DialogPrimitive.Title>
				<DialogPrimitive.Description class="text-sm leading-relaxed text-muted-foreground">
					This preview is read-only. Your local profile will only change after you confirm the
					import.
				</DialogPrimitive.Description>
			</div>

			{#if importPreview}
				<div class="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
					<section class="space-y-4 rounded-2xl border bg-muted/10 p-4">
						<div>
							<p class="text-sm font-medium text-foreground">Sender profile</p>
							<p class="mt-1 text-sm text-muted-foreground">
								Backup from {importPreview.exportedAt.toLocaleString()}.
							</p>
						</div>
						<div class="rounded-xl border bg-background/80 p-4">
							<p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
								Current
							</p>
							<p class="mt-1 font-medium text-foreground">{importPreview.currentSenderName}</p>
						</div>
						<div class="rounded-xl border bg-background/80 p-4">
							<p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
								Importing
							</p>
							<p class="mt-1 font-medium text-foreground">{importPreview.importedSenderName}</p>
						</div>
						<div
							class={cn(
								'rounded-xl border p-4 text-sm',
								importPreview.senderWillChange
									? 'border-primary/20 bg-primary/8 text-primary'
									: 'border-border bg-background/80 text-muted-foreground'
							)}
						>
							{#if importPreview.senderWillChange}
								The active sender profile will be replaced by the imported profile.
							{:else}
								The imported sender matches the current profile. No sender changes detected.
							{/if}
						</div>
					</section>

					<section class="space-y-4 rounded-2xl border bg-muted/10 p-4">
						<div>
							<p class="text-sm font-medium text-foreground">Client merge summary</p>
							<p class="mt-1 text-sm text-muted-foreground">
								{importPreview.totalClients} client{importPreview.totalClients === 1 ? '' : 's'} found
								in the backup.
							</p>
						</div>
						<div class="grid grid-cols-3 gap-3">
							<div class="rounded-xl border bg-background/80 p-3">
								<p class="text-xs text-muted-foreground">Total</p>
								<p class="mt-1 text-xl font-semibold">{importPreview.totalClients}</p>
							</div>
							<div class="rounded-xl border bg-background/80 p-3">
								<p class="text-xs text-muted-foreground">Merge</p>
								<p class="mt-1 text-xl font-semibold">{importPreview.matchedClients}</p>
							</div>
							<div class="rounded-xl border bg-background/80 p-3">
								<p class="text-xs text-muted-foreground">New</p>
								<p class="mt-1 text-xl font-semibold">{importPreview.newClients}</p>
							</div>
						</div>

						<div class="rounded-xl border bg-background/80 p-4">
							<p class="text-sm font-medium text-foreground">Preview</p>
							<div class="mt-3 space-y-2">
								{#each importPreview.clientPreview.slice(0, previewLimit) as client}
									<div
										class="flex items-start justify-between gap-3 rounded-lg border bg-muted/10 px-3 py-2"
									>
										<div class="min-w-0">
											<p class="truncate text-sm font-medium text-foreground">{client.name}</p>
											<p class="truncate text-xs text-muted-foreground">
												{client.company || client.email || 'No company or email'}
											</p>
										</div>
										<span
											class={cn(
												'rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase',
												client.action === 'merge'
													? 'bg-primary/10 text-primary'
													: 'bg-muted text-muted-foreground'
											)}
										>
											{client.action}
										</span>
									</div>
								{/each}
							</div>
							{#if importPreview.clientPreview.length > previewLimit}
								<p class="mt-3 text-xs text-muted-foreground">
									Showing {previewLimit} of {importPreview.clientPreview.length} clients in this preview.
								</p>
							{/if}
						</div>
					</section>
				</div>
			{/if}

			<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
				<Button variant="outline" onclick={resetPreviewState} disabled={isApplyingImport}>
					Cancel
				</Button>
				<Button class="gap-2" onclick={applyImport} disabled={isApplyingImport || !importPreview}>
					{#if isApplyingImport}
						<RefreshCcw class="h-4 w-4 animate-spin" />
						Applying import...
					{:else}
						<Upload class="h-4 w-4" />
						Apply import
					{/if}
				</Button>
			</div>
		</DialogPrimitive.Content>
	</DialogPrimitive.Portal>
</DialogPrimitive.Root>
