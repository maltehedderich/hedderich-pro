<script lang="ts">
	import Moon from '~icons/lucide/moon';
	import Sun from '~icons/lucide/sun';
	import type { ClassValue } from 'svelte/elements';

	import { getActiveTheme, setTheme } from '$lib/theme';

	let { class: className }: { class?: ClassValue } = $props();

	const toggleTheme = () => {
		setTheme(getActiveTheme() === 'dark' ? 'light' : 'dark');
	};
</script>

<!-- The inline script in app.html sets [data-theme] before paint, so CSS shows the matching
     label from the first frame. Without JavaScript the button stays hidden and the OS decides. -->
<button class={['theme-toggle', className]} onclick={toggleTheme} type="button">
	<span class="theme-toggle__option" data-option="dark">
		<Moon aria-hidden="true" class="theme-toggle__icon" />
		<span><span class="sr-only">Switch to </span>Dark<span class="sr-only"> theme</span></span>
	</span>
	<span class="theme-toggle__option" data-option="light">
		<Sun aria-hidden="true" class="theme-toggle__icon" />
		<span><span class="sr-only">Switch to </span>Light<span class="sr-only"> theme</span></span>
	</span>
</button>

<style>
	.theme-toggle {
		align-items: center;
		background: transparent;
		border: 0;
		border-radius: var(--radius-square);
		color: var(--panel-ink, var(--color-on-surface));
		cursor: pointer;
		display: inline-flex;
		font-size: var(--text-meta);
		font-weight: var(--weight-label);
		min-height: 2.75rem;
		padding: 0;
		text-underline-offset: var(--space-3xs);
	}

	.theme-toggle:hover,
	.theme-toggle:active {
		text-decoration: underline;
	}

	.theme-toggle:focus-visible {
		outline: var(--focus-ring-width) solid var(--outline-focus);
		outline-offset: var(--focus-ring-offset);
	}

	.theme-toggle__option {
		align-items: center;
		display: inline-flex;
		gap: var(--space-2xs);
	}

	.theme-toggle :global(.theme-toggle__icon) {
		flex-shrink: 0;
		height: 1rem;
		width: 1rem;
	}

	.theme-toggle__option[data-option='light'],
	:global(:root[data-theme='dark']) .theme-toggle__option[data-option='dark'] {
		display: none;
	}

	:global(:root[data-theme='dark']) .theme-toggle__option[data-option='light'] {
		display: inline-flex;
	}

	:global(:root:not([data-theme])) .theme-toggle {
		display: none;
	}
</style>
