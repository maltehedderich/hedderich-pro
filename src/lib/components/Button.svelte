<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue, HTMLButtonAttributes } from 'svelte/elements';

	type IconPlacement = 'start' | 'end';
	type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

	interface Props extends Omit<HTMLButtonAttributes, 'children' | 'class'> {
		children?: Snippet;
		class?: ClassValue;
		icon?: Snippet;
		iconPlacement?: IconPlacement;
		variant?: ButtonVariant;
		wide?: boolean;
	}

	let {
		children,
		class: className,
		icon,
		iconPlacement = 'end',
		type = 'button',
		variant = 'primary',
		wide = false,
		...rest
	}: Props = $props();
</script>

<button {...rest} data-variant={variant} data-wide={wide} {type} class={['ds-button', className]}>
	{#if icon && iconPlacement === 'start'}
		<span aria-hidden="true" class="ds-button__icon">
			{@render icon()}
		</span>
	{/if}

	<span class="ds-button__label">{@render children?.()}</span>

	{#if icon && iconPlacement === 'end'}
		<span aria-hidden="true" class="ds-button__icon">
			{@render icon()}
		</span>
	{/if}
</button>
