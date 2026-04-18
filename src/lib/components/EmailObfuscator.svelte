<script lang="ts">
	import { PUBLIC_EMAIL_OBFUSCATION_KEY } from '$env/static/public';
	import { decryptEmail, type EncryptedEmailData } from '$lib/email-obfuscation';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	type EmailObfuscatorState = {
		ariaLabel: string;
		email: string | undefined;
		href: string | undefined;
		ready: boolean;
		text: string;
	};

	interface Props {
		children?: Snippet<[EmailObfuscatorState]>;
		encryptedData: EncryptedEmailData;
		fallbackHref?: string;
		label: string;
		loadingText: string;
	}

	let { children, encryptedData, fallbackHref, label, loadingText }: Props = $props();

	let decryptedEmail = $state<string>();

	const href = $derived(decryptedEmail ? `mailto:${decryptedEmail}` : fallbackHref);
	const ready = $derived(decryptedEmail !== undefined);
	const text = $derived(decryptedEmail ?? loadingText);
	const ariaLabel = $derived(decryptedEmail ? `${label}: ${decryptedEmail}` : label);

	onMount(() => {
		let cancelled = false;

		const loadEmail = async () => {
			if (!PUBLIC_EMAIL_OBFUSCATION_KEY) {
				console.warn(
					'Missing PUBLIC_EMAIL_OBFUSCATION_KEY. The obfuscated email cannot be restored.'
				);
				return;
			}

			try {
				const email = await decryptEmail(encryptedData, PUBLIC_EMAIL_OBFUSCATION_KEY);

				if (!cancelled) {
					decryptedEmail = email;
				}
			} catch (error) {
				console.error('Failed to decrypt the obfuscated email address.', error);
			}
		};

		void loadEmail();

		return () => {
			cancelled = true;
		};
	});
</script>

{#if children}
	{@render children({ ariaLabel, email: decryptedEmail, href, ready, text })}
{:else}
	{text}
{/if}
