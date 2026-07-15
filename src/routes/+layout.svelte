<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if page.route.id === '/designs/[slug]/preview'}
	{@render children()}
{:else}
	<div class="factory-shell">
		<a class="skip-link" href="#main-content">Skip to content</a>
		<header class="factory-header">
			<div class="factory-header__inner">
				<a class="factory-brand" href={resolve('/')}>UI Factory</a>
			</div>
		</header>

		{@render children()}
	</div>
{/if}
