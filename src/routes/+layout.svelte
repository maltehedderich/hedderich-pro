<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/icon.svg" type="image/svg+xml" />
	<link rel="icon" href="/favicon.ico" type="image/x-icon" />
	<link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
	<link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
	<link rel="manifest" href="/site.webmanifest" />
	<meta name="application-name" content="Malte Hedderich" />
	<meta name="apple-mobile-web-app-title" content="Malte Hedderich" />
	<meta name="theme-color" content="#f6f4ee" />
	<meta name="msapplication-TileColor" content="#f6f4ee" />
</svelte:head>
{@render children()}
