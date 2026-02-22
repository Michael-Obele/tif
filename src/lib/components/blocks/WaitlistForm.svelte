<script lang="ts">
	import { subscribeToWaitlist } from '$lib/remote';
	import { Mail, LoaderCircle, Check, Sparkles } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let loading = $state(false);
	let submitted = $state(false);

	function resetForm() {
		submitted = false;
	}
</script>

<div class="group/form relative mx-auto w-full">
	<!-- Glow effect behind -->
	<div
		class="absolute -inset-1 rounded-2xl bg-linear-to-r from-indigo-500/20 to-purple-500/20 opacity-0 blur-xl transition-opacity duration-500 group-hover/form:opacity-100 dark:from-indigo-400/10 dark:to-purple-400/10"
	></div>

	{#if submitted}
		<div
			class="relative z-10 overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-50/40 p-8 text-center backdrop-blur-xl transition-all duration-300 dark:border-emerald-500/20 dark:bg-emerald-500/5"
		>
			<div class="mb-4 flex justify-center">
				<div
					class="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30"
				>
					<div
						class="absolute inset-0 animate-ping rounded-full bg-emerald-400/20 opacity-75"
					></div>
					<Check
						class="relative h-7 w-7 text-emerald-600 dark:text-emerald-400"
						strokeWidth={2.5}
					/>
				</div>
			</div>

			<h3 class="mb-2 text-xl font-bold tracking-tight text-emerald-950 dark:text-emerald-50">
				Welcome aboard!
			</h3>
			<p class="mb-6 text-sm leading-relaxed text-emerald-800/80 dark:text-emerald-200/70">
				We've added you to the exclusive list. Watch your inbox for priority access.
			</p>

			<Button
				onclick={resetForm}
				variant="outline"
				class="h-10 w-full rounded-xl border-emerald-200/50 bg-white/40 text-emerald-700 hover:bg-emerald-100/50 hover:text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
			>
				Add another email
			</Button>
		</div>
	{:else}
		<form
			{...subscribeToWaitlist.enhance(async ({ form, submit }) => {
				loading = true;
				try {
					await submit();
					if (subscribeToWaitlist.result?.success) {
						submitted = true;
						form.reset();
						toast.success(subscribeToWaitlist.result.message || 'Successfully added to waitlist!');
					} else {
						toast.error(
							subscribeToWaitlist.result?.message || 'Failed to subscribe. Please try again.'
						);
					}
				} catch (error) {
					console.error('Waitlist subscription error:', error);
					toast.error('An unexpected error occurred. Please try again.');
				} finally {
					loading = false;
				}
			})}
			class="relative z-10"
		>
			<div class="relative flex items-center">
				<div
					class="pointer-events-none absolute left-3 z-20 flex items-center text-zinc-400 transition-colors duration-300 group-focus-within/form:text-indigo-500"
				>
					<Mail class="h-5 w-5" />
				</div>

				<Input
					{...subscribeToWaitlist.fields.email.as('email')}
					placeholder="name@work.com"
					required
					disabled={loading}
					class="h-14 w-full rounded-2xl border-zinc-200/60 bg-white/60 pr-32 pl-10 text-base shadow-sm ring-offset-transparent backdrop-blur-xl transition-all duration-300 placeholder:text-zinc-400 focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:focus-visible:border-indigo-400 dark:focus-visible:ring-indigo-400/10"
				/>

				<div class="absolute top-1 right-1 bottom-1 z-20">
					<Button
						type="submit"
						disabled={loading}
						size="sm"
						class="h-full rounded-xl bg-indigo-600 px-8 font-medium text-white shadow-md shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02] hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-70 dark:bg-indigo-500 dark:hover:bg-indigo-400"
					>
						{#if loading}
							<LoaderCircle class="h-4 w-4 animate-spin" />
						{:else}
							<span class="mr-2">Join</span>
							<Sparkles class="h-3.5 w-3.5 fill-white/20" />
						{/if}
					</Button>
				</div>
			</div>

			<p class="mt-3 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
				Join <span class="font-bold text-zinc-900 dark:text-zinc-200">2,000+</span> builders waiting for
				access.
			</p>
		</form>
	{/if}
</div>
