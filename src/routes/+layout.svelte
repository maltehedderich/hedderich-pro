<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';

	import { initTheme } from '$lib/theme';

	let { children } = $props();

	onMount(initTheme);
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
	<meta name="color-scheme" content="light dark" />
	<meta name="theme-color" content="#f5f5ee" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="#101817" media="(prefers-color-scheme: dark)" />
	<meta name="msapplication-TileColor" content="#f5f5ee" />
</svelte:head>

<a class="skip-link" href="#main-content">Skip to content</a>

{@render children()}
