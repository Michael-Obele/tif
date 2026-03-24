<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { profileStore } from '$lib/stores/profile.svelte';
	import { toast } from 'svelte-sonner';
	import { Download, FileText, RefreshCcw, ShieldCheck, Upload } from '@lucide/svelte';

	let fileInput = $state<HTMLInputElement | null>(null);
	let isImporting = $state(false);
	let isExporting = $state(false);
	let importSummary = $state('');

	const backupFileName = `tech-invoice-forge-profile-${new Date().toISOString().slice(0, 10)}.txt`;

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

	async function importProfile(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;

		isImporting = true;

		try {
			const rawText = await file.text();
			const result = await profileStore.importProfileText(rawText);

			importSummary = `Sender updated. ${result.updatedClients} client${result.updatedClients === 1 ? '' : 's'} merged and ${result.createdClients} added.`;
			toast.success('Profile backup imported');
		} catch (error) {
			console.error('Error importing profile backup:', error);
			toast.error(error instanceof Error ? error.message : 'Unable to import profile backup');
		} finally {
			input.value = '';
			isImporting = false;
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
					onchange={importProfile}
				/>

				<Button
					variant="outline"
					class="mt-6 w-full gap-2 border-dashed"
					onclick={openFilePicker}
					disabled={isImporting}
				>
					{#if isImporting}
						<RefreshCcw class="h-4 w-4 animate-spin" />
						Importing backup...
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
