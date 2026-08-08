<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Pathname } from '$app/types';
	import ArrowRight from '~icons/lucide/arrow-right';
	import House from '~icons/lucide/house';

	const headings: Record<number, string> = {
		403: 'Not available',
		404: 'Page not found',
		500: 'Something broke'
	};

	const notFoundCopy =
		'This URL has either moved or disappeared. The canonical pages are still available from the home page and writing archive.';

	let status = $derived(page.status);
	let heading = $derived(headings[status] ?? 'Something went wrong');
	let detail = $derived(
		status === 404
			? notFoundCopy
			: (page.error?.message ??
					'This page could not be loaded. The canonical pages are still available from the home page and writing archive.')
	);
</script>

<svelte:head>
	<title>{heading} | Malte Hedderich</title>
	<meta name="robots" content="noindex,follow" />
</svelte:head>

<main class="error-page" id="main-content">
	<section aria-labelledby="error-title">
		<p class="ds-eyebrow error-kicker">{status}</p>

		<h1 class="error-title" id="error-title">{heading}</h1>

		<p class="error-copy">{detail}</p>

		<nav class="error-nav" aria-label="Useful links">
			<a class="ds-button" data-variant="primary" href={resolve('/' as Pathname)}>
				<span aria-hidden="true" class="ds-button__icon">
					<House />
				</span>

				<span class="ds-button__label">Home</span>
			</a>

			<a class="ds-button" data-variant="secondary" href={resolve('/blog/' as Pathname)}>
				<span class="ds-button__label">Blog</span>

				<span aria-hidden="true" class="ds-button__icon">
					<ArrowRight />
				</span>
			</a>
		</nav>
	</section>
</main>

<style>
	.error-page {
		box-sizing: border-box;
		display: grid;
		min-height: 100svh;
		padding: clamp(2rem, 6vw, 5rem);
		place-items: center;
	}

	section {
		margin-inline: auto;
		max-width: 58rem;
		padding-block-end: clamp(2rem, 10vh, 7rem);
		width: 100%;
	}

	.error-kicker {
		color: var(--color-primary);
		font-weight: 700;
		margin: 0 0 var(--space-sm);
	}

	.error-title {
		/* Matches .blog-index-title / .blog-post-title — 600 at -0.08em. The 700/0 this
		   was inherited from was part of the 404's drift from the system, not a variant. */
		font-size: var(--text-display);
		font-weight: 600;
		letter-spacing: -0.08em;
		line-height: 0.9;
		margin: 0;
		max-width: 8ch;
	}

	.error-copy {
		color: var(--color-muted);
		font-size: var(--text-lead);
		/* House values for --text-lead prose, same as .blog-index-intro / .blog-post-deck.
		   The 1.7 and 39rem this replaces were both a hair off the system. */
		line-height: 1.75;
		margin: var(--space-md) 0 0;
		max-width: var(--measure-prose);
	}

	.error-nav {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-top: var(--space-lg);
	}

	@media (min-width: 64rem) {
		section {
			padding-inline-end: 16rem;
		}
	}

	@media (max-width: 30rem) {
		.error-nav {
			align-items: stretch;
			flex-direction: column;
		}

		.error-nav :global(.ds-button) {
			justify-content: flex-start;
			width: 100%;
		}
	}
</style>
