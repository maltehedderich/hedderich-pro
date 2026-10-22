<script lang="ts">
	import type { BlogPostItem } from '$lib/content/blog';
	import Chip from './Chip.svelte';

	interface Props {
		post: Pick<BlogPostItem, 'tag' | 'publishedAt' | 'dateLabel' | 'readTime'> & {
			sourceLabel?: string;
		};
		showDate?: boolean;
	}

	let { post, showDate = true }: Props = $props();
</script>

<div class="ds-metadata">
	<Chip>{post.tag}</Chip>
	{#if showDate}<time datetime={post.publishedAt}>{post.dateLabel}</time>{/if}
	<span>{post.readTime} read</span>
	{#if post.sourceLabel}<span>{post.sourceLabel}</span>{/if}
</div>
