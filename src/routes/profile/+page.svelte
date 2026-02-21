<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import SenderForm from '$lib/components/profile/sender-form.svelte';
	import ClientList from '$lib/components/profile/client-list.svelte';
	import { profileStore } from '$lib/stores/profile.svelte';
</script>

<div class="container mx-auto max-w-5xl px-4 py-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold tracking-tight">Profile & Settings</h1>
		<p class="text-muted-foreground">Manage your business details and client list.</p>
	</div>

	<Tabs.Root value="profile" class="space-y-6">
		<Tabs.List>
			<Tabs.Trigger value="profile">My Profile</Tabs.Trigger>
			<Tabs.Trigger value="clients">Clients</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="profile" class="space-y-6 outline-none">
			<SenderForm bind:sender={profileStore.sender} />
		</Tabs.Content>

		<Tabs.Content value="clients" class="space-y-6 outline-none">
			<ClientList />
		</Tabs.Content>
	</Tabs.Root>
</div>
