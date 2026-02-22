<script lang="ts">
	import { subscribeToWaitlist } from '$lib/remote';
	import { Mail, LoaderCircle, CircleCheck, CircleAlert } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let loading = $state(false);
	let submitted = $state(false);

	function resetForm() {
		submitted = false;
	}
</script>

<div class="w-full max-w-md">
	{#if submitted}
		<div class="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
			<div class="mb-3 flex justify-center">
				<CircleCheck class="h-12 w-12 text-green-600" />
			</div>
			<h3 class="mb-2 text-lg font-semibold text-green-900">Welcome to our waitlist!</h3>
			<p class="mb-4 text-sm text-green-800">
				We've sent a confirmation email. Check your inbox for updates.
			</p>
			<Button
				onclick={resetForm}
				class="bg-green-600 text-white hover:bg-green-700"
			>
				Subscribe another email
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
						toast.error(subscribeToWaitlist.result?.message || 'Failed to subscribe. Please try again.');
					}
				} catch (error) {
					console.error('Waitlist subscription error:', error);
					toast.error('An unexpected error occurred. Please try again.');
				} finally {
					loading = false;
				}
			})}
			class="space-y-3"
		>
			<div class="relative">
				<div class="absolute inset-y-0 left-0 flex items-center pl-3">
					<Mail class="h-5 w-5 text-slate-400" />
				</div>
				<Input
					{...subscribeToWaitlist.fields.email.as('email')}
					placeholder="Enter your email"
					required
					disabled={loading}
					class="pl-10"
				/>
			</div>

			<Button
				type="submit"
				disabled={loading}
				class="w-full"
			>
				{#if loading}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
					<span>Subscribing...</span>
				{:else}
					<span>Join the waitlist</span>
				{/if}
			</Button>

			<p class="text-center text-xs text-slate-600">
				We respect your privacy. No spam, unsubscribe anytime.
			</p>
		</form>
	{/if}
</div>
