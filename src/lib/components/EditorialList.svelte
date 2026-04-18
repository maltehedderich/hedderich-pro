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
				<h2 class="text-3xl font-semibold tracking-[-0.05em] text-(--color-ink) sm:text-4xl">
					{title}
				</h2>
			{/if}

			{#if intro}
				<p class="max-w-xl text-base leading-7 text-(--color-muted) sm:text-lg">
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
