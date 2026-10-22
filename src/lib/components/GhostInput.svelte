<script lang="ts">
	import type { ClassValue, HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'children' | 'class' | 'value'> {
		class?: ClassValue;
		hint?: string;
		label: string;
		value?: HTMLInputAttributes['value'];
	}

	const uid = $props.id();

	let {
		class: className,
		hint,
		id = `${uid}-input`,
		label,
		value = $bindable(''),
		...rest
	}: Props = $props();

	let hintId = $derived(`${id}-hint`);
</script>

<div class={['block space-y-3', className]}>
	<label class="block text-(length:--text-meta) font-semibold text-inherit" for={id}>
		{label}
	</label>

	<span class="ds-ghost-input-shell">
		<input
			{...rest}
			{id}
			aria-describedby={hint ? hintId : undefined}
			bind:value
			class="ds-ghost-input"
		/>
		<span aria-hidden="true" class="ds-ghost-input-accent"></span>
	</span>

	{#if hint}
		<span id={hintId} class="ds-muted block text-(length:--text-meta) leading-6">
			{hint}
		</span>
	{/if}
</div>
