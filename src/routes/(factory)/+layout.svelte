<script lang="ts">
	import { resolve } from '$app/paths';
	import '../../app.css';

	let { children } = $props();
</script>

<div class="factory-shell">
	<a class="skip-link" href="#main-content">Skip to content</a>
	<header class="factory-header">
		<div class="factory-header__inner">
			<a class="factory-brand" href={resolve('/')}>UI Factory</a>
		</div>
	</header>

	{@render children()}
</div>
