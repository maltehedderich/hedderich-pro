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

{#if href}
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a class={['ds-card', className]} data-linked="true" {href}>
		{#if eyebrow}
			<p class="ds-eyebrow">
				{#if eyebrowIcon}
					<span aria-hidden="true" class="ds-eyebrow__icon">
						{@render eyebrowIcon()}
					</span>
				{/if}

				{eyebrow}
			</p>
		{/if}

		{#if title}
			<h3
				class="mt-4 max-w-[18ch] text-2xl leading-tight font-semibold tracking-[-0.04em] text-(--color-ink)"
			>
				{title}
			</h3>
		{/if}

		<div class="mt-4 flex-1 space-y-4 text-base leading-7 text-(--color-muted)">
			{@render children?.()}
		</div>

		{#if footer}
			<div
				class="mt-8 flex items-center justify-between gap-3 text-sm font-medium text-(--color-ink)"
			>
				{@render footer()}
			</div>
		{/if}
	</a>
{:else}
	<article class={['ds-card', className]}>
		{#if eyebrow}
			<p class="ds-eyebrow">
				{#if eyebrowIcon}
					<span aria-hidden="true" class="ds-eyebrow__icon">
						{@render eyebrowIcon()}
					</span>
				{/if}

				{eyebrow}
			</p>
		{/if}

		{#if title}
			<h3
				class="mt-4 max-w-[18ch] text-2xl leading-tight font-semibold tracking-[-0.04em] text-(--color-ink)"
			>
				{title}
			</h3>
		{/if}

		<div class="mt-4 flex-1 space-y-4 text-base leading-7 text-(--color-muted)">
			{@render children?.()}
		</div>

		{#if footer}
			<div
				class="mt-8 flex items-center justify-between gap-3 text-sm font-medium text-(--color-ink)"
			>
				{@render footer()}
			</div>
		{/if}
	</article>
{/if}
