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
	<section class={['space-y-8', className]}>
		<header class="max-w-2xl space-y-4">
			{#if title}
				<h2 class="ds-heading text-(length:--text-section) text-inherit">
					{title}
				</h2>
			{/if}

			{#if intro}
				<p class="ds-muted max-w-(--measure-prose) text-(length:--text-lead) leading-[1.75]">
					{intro}
				</p>
			{/if}
		</header>

		{@render list()}
	</section>
{:else}
	<div class={['space-y-10', className]}>
		{@render list()}
	</div>
{/if}

{#snippet list()}
	<ul class="editorial-list" role="list">
		{#each items as item (getKey(item))}
			<li class="ds-editorial-list-item">{@render row(item)}</li>
		{/each}
	</ul>
{/snippet}

<style>
	.editorial-list {
		display: grid;
		gap: var(--space-md);
		list-style: none;
		margin: 0;
		padding: 0;
	}
</style>
