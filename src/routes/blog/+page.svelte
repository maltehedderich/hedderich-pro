<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import ArrowLeft from '~icons/lucide/arrow-left';
	import ArrowRight from '~icons/lucide/arrow-right';
	import CalendarDays from '~icons/lucide/calendar-days';
	import Clock3 from '~icons/lucide/clock-3';
	import ExternalLink from '~icons/lucide/external-link';

	import { EditorialList } from '$lib';
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

<main
	class="blog-index-page px-5 pt-8 pb-28 sm:px-8 sm:pt-10 lg:px-12 lg:pb-40"
	id="main-content"
	tabindex="-1"
>
	<div class="mx-auto max-w-304 space-y-20 sm:space-y-24 lg:space-y-32">
		<header class="blog-index-hero">
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a class="ds-inline-link" href="/">
				<span aria-hidden="true" class="blog-index-hero__back-icon">
					<ArrowLeft class="size-4" />
				</span>
				Back home
			</a>

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
			<div class="ds-section__rail space-y-4 lg:pt-3">
				<h2 class="ds-section__heading" id="archive-title">Archive</h2>
				<p class="ds-section__copy">{data.posts.length} pieces, newest first.</p>
			</div>

			<EditorialList items={data.posts}>
				{#snippet row(post)}
					{#snippet blogIndexLinkContent()}
						<div class="space-y-5">
							<div class="flex flex-wrap items-center gap-3">
								<span class="ds-chip">{post.tag}</span>
								{#if post.sourceLabel}
									<span class="ds-chip" data-tone="quiet">{post.sourceLabel}</span>
								{/if}
								<span class="ds-chip" data-tone="quiet">
									<CalendarDays aria-hidden="true" class="size-3 shrink-0" />
									<time datetime={post.publishedAt}>{post.dateLabel}</time>
								</span>
								<span class="ds-chip" data-tone="quiet">
									<Clock3 aria-hidden="true" class="size-3 shrink-0" />
									{post.readTime}
								</span>
							</div>

							<div class="blog-index-link__header">
								<h3 class="blog-index-link__title">{post.title}</h3>
								<span aria-hidden="true" class="blog-index-link__arrow">
									{#if post.isExternal}
										<ExternalLink class="size-4" />
									{:else}
										<ArrowRight class="size-4" />
									{/if}
								</span>
							</div>

							<p class="blog-index-link__summary">{post.summary}</p>
						</div>
					{/snippet}

					{#if post.isExternal}
						<a
							aria-label={`Read ${post.title} on ${post.sourceLabel ?? 'external site'}`}
							class="blog-index-link"
							href={post.href}
							rel="external noreferrer noopener"
							target="_blank"
						>
							{@render blogIndexLinkContent()}
						</a>
					{:else}
						<a
							aria-label={`Read ${post.title}`}
							class="blog-index-link"
							href={resolve(post.href as Pathname)}
						>
							{@render blogIndexLinkContent()}
						</a>
					{/if}
				{/snippet}
			</EditorialList>
		</section>
	</div>
</main>

<style>
	.blog-index-page {
		overflow-x: clip;
	}

	.blog-index-hero {
		display: grid;
		gap: var(--space-xl);
	}

	.blog-index-hero__back-icon {
		align-items: center;
		color: var(--color-accent);
		display: inline-flex;
		flex: 0 0 auto;
		justify-content: center;
	}

	.blog-index-hero__body {
		display: grid;
		gap: var(--space-md);
		max-width: 48rem;
	}

	.blog-index-title {
		font-size: var(--text-display);
		font-weight: 600;
		letter-spacing: -0.08em;
		line-height: 0.9;
	}

	.blog-index-intro {
		color: color-mix(in srgb, var(--color-ink) 70%, white 30%);
		font-size: var(--text-lead);
		line-height: 1.75;
		max-width: var(--measure-prose);
	}

	.blog-index-link {
		color: inherit;
		display: block;
		text-decoration: none;
	}

	/* Ring is drawn by .ds-editorial-list-item:has(a:focus-visible) so it traces the card. */
	.blog-index-link:focus-visible {
		outline: none;
	}

	.blog-index-link__header {
		align-items: flex-start;
		display: flex;
		gap: var(--space-sm);
		justify-content: space-between;
	}

	.blog-index-link__title {
		color: var(--color-ink);
		font-size: var(--text-title);
		font-weight: 600;
		letter-spacing: -0.055em;
		line-height: 1.05;
		/* Shares the summary's edge. At 24ch this headline was set 40% narrower than its
		   own body copy and wrapped to three lines against a half-empty card. */
		max-width: var(--measure-prose);
	}

	.blog-index-link__arrow {
		align-items: center;
		background: var(--surface-container-low);
		border-radius: var(--radius-full);
		color: var(--color-primary);
		display: inline-flex;
		flex: 0 0 auto;
		height: 2.25rem;
		justify-content: center;
		transition:
			background var(--motion-base) var(--motion-ease),
			transform var(--motion-base) var(--motion-ease);
		width: 2.25rem;
	}

	.blog-index-link:hover .blog-index-link__arrow {
		background: color-mix(in srgb, var(--surface-container-high) 82%, white 18%);
		transform: translateX(var(--space-3xs));
	}

	.blog-index-link:active .blog-index-link__arrow {
		background: var(--surface-container-high);
		transform: none;
	}

	.blog-index-link__summary {
		color: var(--color-muted);
		font-size: var(--text-body);
		line-height: 1.65;
		max-width: var(--measure-prose);
	}

	@media (min-width: 1024px) {
		.blog-index-hero {
			grid-template-columns: 15rem minmax(0, 1fr);
			padding-top: var(--space-sm);
		}

		.blog-index-hero .ds-inline-link {
			align-self: start;
			margin-top: var(--space-sm);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.blog-index-link__arrow {
			transition-duration: 0.01ms;
		}

		.blog-index-link:hover .blog-index-link__arrow,
		.blog-index-link:active .blog-index-link__arrow {
			transform: none;
		}
	}
</style>
