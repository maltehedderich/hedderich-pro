<script lang="ts">
	import '../../static/error-page.css';
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

<main class="error-page" id="main-content" tabindex="-1">
	<section class="error-layout" aria-labelledby="error-title">
		<p class="error-status">{status}</p>
		<div class="error-body">
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
		</div>
	</section>
</main>
