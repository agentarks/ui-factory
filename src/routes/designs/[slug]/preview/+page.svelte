<script lang="ts">
	import { resolve } from '$app/paths';
	import { getPublished } from '$lib/catalog/registry';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const entry = $derived(getPublished(data.slug));
</script>

<svelte:head>
	<title>{data.title} preview</title>
</svelte:head>

{#if entry}
	{#await entry.loadPreview()}
		<p>Loading preview…</p>
	{:then { default: Preview }}
		<Preview />
	{:catch}
		<main>
			<p>The preview could not be loaded.</p>
			<a href={resolve(`/designs/${data.slug}/preview`)} data-sveltekit-reload>Reload preview</a>
		</main>
	{/await}
{/if}
