<script lang="ts">
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<a class="skip-link" href="#main-content">Skip to content</a>
<header class="factory-header">
	<div class="factory-header__inner">
		<a class="factory-brand" href={resolve('/')}>UI Factory</a>
	</div>
</header>

{@render children()}
