<script lang="ts" generics="Item extends { id: string }">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	interface Props<Item> {
		class?: ClassValue;
		getKey?: (item: Item) => string;
		intro?: string;
		items: Item[];
		row: Snippet<[Item]>;
		title?: string;
	}

	let {
		class: className,
		getKey = (item: Item) => item.id,
		intro,
		items,
		row,
		title
	}: Props<Item> = $props();
</script>

{#if title || intro}
	<section class={['space-y-10', className]}>
		<header class="max-w-2xl space-y-4">
			{#if title}
				<h2 class="text-(length:--text-title) font-semibold tracking-[-0.05em] text-(--color-ink)">
					{title}
				</h2>
			{/if}

			{#if intro}
				<p
					class="max-w-(--measure-prose) text-(length:--text-lead) leading-[1.75] text-(--color-muted)"
				>
					{intro}
				</p>
			{/if}
		</header>

		<div class="space-y-5 sm:space-y-6">
			{#each items as item (getKey(item))}
				<article class="ds-editorial-list-item">
					{@render row(item)}
				</article>
			{/each}
		</div>
	</section>
{:else}
	<div class={['space-y-10', className]}>
		<div class="space-y-5 sm:space-y-6">
			{#each items as item (getKey(item))}
				<article class="ds-editorial-list-item">
					{@render row(item)}
				</article>
			{/each}
		</div>
	</div>
{/if}
