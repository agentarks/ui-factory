<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.metadata.title} | UI Factory</title>
	<meta name="description" content={data.metadata.summary} />
</svelte:head>

<main id="main-content" class="factory-main design-detail">
	<a class="back-link" href={resolve('/')}>Back to catalog</a>

	<header class="design-heading">
		<p class="factory-kicker">Production-ready design</p>
		<h1>{data.metadata.title}</h1>
		<p>{data.metadata.summary}</p>
	</header>

	<section class="preview-region" aria-labelledby="preview-title">
		<h2 id="preview-title">Preview</h2>
		<iframe
			class="design-preview"
			title={`${data.metadata.title} preview`}
			src={resolve(`/designs/${data.metadata.slug}/preview`)}
			loading="lazy"
		></iframe>
	</section>
</main>
