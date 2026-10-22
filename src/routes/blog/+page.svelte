<script lang="ts">
	import ArrowLeft from '~icons/lucide/arrow-left';

	import { EditorialList, ThemeToggle, WritingLink } from '$lib';
	import profileImageAsset from '$lib/assets/malte-hedderich.png';
	import {
		createAbsoluteUrl,
		SITE_AUTHOR,
		SITE_LANGUAGE,
		SITE_NAME,
		SITE_SOCIAL_HANDLE,
		SITE_URL
	} from '$lib/site';
	import type { PageProps } from './$types';

	const pageUrl = createAbsoluteUrl('/blog/');
	const pageTitle = 'Blog | Malte Hedderich';
	const pageDescription =
		'Essays by Malte Hedderich on LLM applications, AI agents, evaluation, prompt optimization, and machine learning engineering.';
	const pageImage = new URL(profileImageAsset, SITE_URL).toString();
	const pageImageAlt = 'Portrait of Malte Hedderich';

	let { data }: PageProps = $props();

	let structuredData = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@id': `${pageUrl}#blog`,
			'@type': 'Blog',
			description: pageDescription,
			inLanguage: SITE_LANGUAGE,
			name: `${SITE_NAME} Blog`,
			publisher: {
				'@type': 'Person',
				name: SITE_AUTHOR,
				url: createAbsoluteUrl('/')
			},
			url: pageUrl,
			blogPost: data.posts.map((post) => ({
				'@type': 'BlogPosting',
				datePublished: post.publishedAt,
				description: post.summary,
				headline: post.title,
				url: createAbsoluteUrl(post.href)
			}))
		})
	);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta name="author" content={SITE_AUTHOR} />
	<meta name="robots" content="index,follow,max-image-preview:large" />
	<link rel="canonical" href={pageUrl} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:image" content={pageImage} />
	<meta property="og:image:secure_url" content={pageImage} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1250" />
	<meta property="og:image:height" content="1250" />
	<meta property="og:image:alt" content={pageImageAlt} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={SITE_SOCIAL_HANDLE} />
	<meta name="twitter:creator" content={SITE_SOCIAL_HANDLE} />
	<meta name="twitter:url" content={pageUrl} />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={pageImage} />
	<meta name="twitter:image:alt" content={pageImageAlt} />
	<svelte:element this={'script'} type="application/ld+json">{structuredData}</svelte:element>
</svelte:head>

<main class="ds-page" id="main-content" tabindex="-1">
	<div class="ds-page-frame ds-page-stack">
		<header class="blog-index-hero ds-surface" data-mode="signal">
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a class="ds-inline-link" href="/">
				<span aria-hidden="true" class="blog-index-hero__back-icon">
					<ArrowLeft class="size-4" />
				</span>
				Back home
			</a>
			<ThemeToggle class="blog-index-hero__theme" />

			<div class="blog-index-hero__body">
				<p class="ds-eyebrow">Writing Archive</p>
				<h1 class="blog-index-title">Blog</h1>
				<p class="blog-index-intro">
					Notes on production AI systems, agent design, prompt optimization, and the machine
					learning plumbing that decides whether ideas survive contact with real users.
				</p>
			</div>
		</header>

		<section aria-labelledby="archive-title" class="ds-section">
			<div class="ds-section__rail space-y-4">
				<h2 class="ds-section__heading" id="archive-title">Archive</h2>
				<p class="ds-section__copy">{data.posts.length} pieces, newest first.</p>
			</div>

			<EditorialList items={data.posts}>
				{#snippet row(post)}<WritingLink {post} />{/snippet}
			</EditorialList>
		</section>
	</div>
</main>

<style>
	.blog-index-hero {
		align-items: start;
		display: grid;
		gap: var(--space-lg) var(--space-md);
		grid-template-areas:
			'back theme'
			'body body';
		grid-template-columns: minmax(0, 1fr) auto;
		margin-inline: calc(-1 * var(--page-gutter));
		padding: var(--space-lg) var(--page-gutter) var(--space-xl);
	}
	.blog-index-hero .ds-inline-link {
		grid-area: back;
		justify-self: start;
	}
	:global(.blog-index-hero__theme) {
		grid-area: theme;
	}
	.blog-index-hero__back-icon {
		display: inline-flex;
	}
	.blog-index-hero__body {
		display: grid;
		gap: var(--space-md);
		grid-area: body;
	}
	.blog-index-title {
		font-size: var(--text-display);
		line-height: var(--leading-display);
	}
	.blog-index-intro {
		font-size: var(--text-lead);
		line-height: 1.75;
		max-width: var(--measure-prose);
	}
	@media (min-width: 1024px) {
		.blog-index-hero {
			column-gap: var(--layout-gap);
			grid-template-areas: 'back body theme';
			grid-template-columns: var(--layout-rail) minmax(0, 1fr) auto;
			padding-block: var(--space-xl);
		}
		/* Centre the eyebrow on the 44px back link and theme control. */
		.blog-index-hero__body {
			padding-top: var(--space-xs);
		}
	}
</style>
