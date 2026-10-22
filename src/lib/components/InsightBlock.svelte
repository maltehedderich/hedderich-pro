<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	interface Props {
		attribution?: string;
		children?: Snippet;
		class?: ClassValue;
		eyebrow?: string;
		eyebrowIcon?: Snippet;
		quote: string;
	}

	let {
		attribution,
		children,
		class: className,
		eyebrow = 'Insight Block',
		eyebrowIcon,
		quote
	}: Props = $props();
</script>

<aside class={['ds-insight-block', className]}>
	<div class="space-y-6 lg:col-span-7">
		<p class="ds-eyebrow">
			{#if eyebrowIcon}
				<span aria-hidden="true" class="ds-eyebrow__icon">
					{@render eyebrowIcon()}
				</span>
			{/if}

			{eyebrow}
		</p>

		<blockquote class="ds-heading max-w-[24ch] text-(length:--text-section) text-(--color-ink)">
			{quote}
		</blockquote>

		{#if attribution}
			<p
				class="text-(length:--text-micro) font-medium tracking-[0.14em] text-(--color-ink) uppercase"
			>
				{attribution}
			</p>
		{/if}
	</div>

	{#if children}
		<div
			class="max-w-xl text-(length:--text-body) leading-7 text-(--color-ink) lg:col-span-5 lg:pt-10"
		>
			{@render children()}
		</div>
	{/if}
</aside>
