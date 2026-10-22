<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import ArrowUpRight from '~icons/lucide/arrow-up-right';
	import ArrowRight from '~icons/lucide/arrow-right';
	import type { WritingItem } from '$lib/content/blog';
	import PostMeta from './PostMeta.svelte';

	let { post, showDate = true }: { post: WritingItem; showDate?: boolean } = $props();
</script>

{#snippet content()}
	<div class="writing-link__content">
		<PostMeta {post} {showDate} />
		<h3 class="ds-heading writing-link__title">{post.title}</h3>
		<p class="writing-link__summary">{post.summary}</p>
	</div>
	<span aria-hidden="true" class="writing-link__arrow">
		{#if post.isExternal}<ArrowUpRight />{:else}<ArrowRight />{/if}
	</span>
{/snippet}

{#if post.isExternal}
	<a
		class="writing-link"
		aria-label={`Read ${post.title} on ${post.sourceLabel ?? 'external site'}`}
		href={post.href}
		rel="external noreferrer noopener"
		target="_blank"
	>
		{@render content()}
	</a>
{:else}
	<a class="writing-link" aria-label={`Read ${post.title}`} href={resolve(post.href as Pathname)}>
		{@render content()}
	</a>
{/if}

<style>
	.writing-link {
		color: var(--color-ink);
		position: relative;
		text-decoration: none;
	}

	.writing-link:focus-visible {
		outline: none;
	}
	.writing-link__content {
		display: grid;
		gap: var(--space-sm);
	}
	.writing-link__title {
		font-size: var(--text-title);
		max-width: var(--measure-prose);
		padding-right: var(--space-lg);
	}
	.writing-link__summary {
		color: var(--color-muted);
		font-size: var(--text-body);
		line-height: 1.65;
		max-width: var(--measure-prose);
	}
	.writing-link__arrow {
		align-items: center;
		display: flex;
		justify-content: center;
		position: absolute;
		right: var(--space-md);
		top: var(--space-md);
		width: var(--space-md);
		height: var(--space-lg);
	}
	.writing-link__arrow :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}
	.writing-link__content :global(.ds-metadata) {
		padding-right: var(--space-lg);
	}
	.writing-link:hover .writing-link__title {
		text-decoration: underline;
		text-decoration-thickness: 0.04em;
		text-underline-offset: 0.1em;
	}
	@media (min-width: 640px) {
		.writing-link {
			padding: var(--space-lg);
		}
		.writing-link__arrow {
			right: var(--space-lg);
			top: var(--space-lg);
		}
	}
</style>
