<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue, SvelteHTMLElements } from 'svelte/elements';

	interface Props extends Omit<SvelteHTMLElements['span'], 'children' | 'class'> {
		children?: Snippet;
		class?: ClassValue;
		icon?: Snippet;
	}

	let { children, class: className, icon, ...rest }: Props = $props();
</script>

<span {...rest} class={['ds-chip', className]}>
	{#if icon}
		<span aria-hidden="true" class="ds-chip__icon">
			{@render icon()}
		</span>
	{/if}

	{@render children?.()}
</span>
