<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>UI Factory</title>
	<meta
		name="description"
		content="Compare published interface directions and their implementation handoffs."
	/>
</svelte:head>

<main id="main-content" class="factory-main">
	<section class="catalog-intro" aria-labelledby="catalog-title">
		<p class="factory-kicker">Design catalog</p>
		<h1 id="catalog-title">UI Factory</h1>
		<p class="catalog-summary">
			Compare polished interface directions and inspect their implementation handoffs.
		</p>
	</section>

	{#if data.designs.length === 0}
		<section class="empty-catalog" aria-labelledby="empty-title">
			<h2 id="empty-title">No designs published</h2>
			<p>Published designs will appear here when they are ready.</p>
		</section>
	{:else}
		<ul class="catalog-list" aria-label="Published designs">
			{#each data.designs as design (design.slug)}
				<li>
					<a href={resolve(`/designs/${design.slug}`)}>{design.title}</a>
					<p>{design.summary}</p>
				</li>
			{/each}
		</ul>
	{/if}
</main>
