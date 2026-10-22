<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	interface Props {
		children?: Snippet;
		class?: ClassValue;
		eyebrow?: string;
		eyebrowIcon?: Snippet;
		footer?: Snippet;
		href?: string;
		title?: string;
	}

	let { children, class: className, eyebrow, eyebrowIcon, footer, href, title }: Props = $props();
</script>

{#snippet content()}
	{#if eyebrow}
		<p class="ds-eyebrow tracking-normal normal-case">
			{#if eyebrowIcon}
				<span aria-hidden="true" class="ds-eyebrow__icon">{@render eyebrowIcon()}</span>
			{/if}
			{eyebrow}
		</p>
	{/if}
	{#if title}<h3 class="ds-heading ds-card__title">{title}</h3>{/if}
	<div class="ds-card__body">{@render children?.()}</div>
	{#if footer}<div class="ds-card__footer">{@render footer()}</div>{/if}
{/snippet}

{#if href}
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a class={['ds-card', className]} data-linked="true" {href}>{@render content()}</a>
{:else}
	<article class={['ds-card', className]}>{@render content()}</article>
{/if}
