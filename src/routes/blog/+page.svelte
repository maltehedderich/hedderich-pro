<script lang="ts">
	import ArrowLeft from '~icons/lucide/arrow-left';
	import ArrowRight from '~icons/lucide/arrow-right';
	import CalendarDays from '~icons/lucide/calendar-days';
	import Clock3 from '~icons/lucide/clock-3';

	import { EditorialList } from '$lib';
	import type { PageProps } from './$types';

	const siteUrl = 'https://hedderich.pro';
	const pageUrl = `${siteUrl}/blog/`;
	const pageTitle = 'Blog | Malte Hedderich';
	const pageDescription =
		'Essays by Malte Hedderich on LLM applications, AI agents, evaluation, prompt optimization, and machine learning engineering.';

	let { data }: PageProps = $props();

	let structuredData = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Blog',
			description: pageDescription,
			name: 'Malte Hedderich Blog',
			url: pageUrl,
			blogPost: data.posts.map((post) => ({
				'@type': 'BlogPosting',
				datePublished: post.publishedAt,
				description: post.summary,
				headline: post.title,
				url: new URL(post.href, siteUrl).toString()
			}))
		})
	);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta name="author" content="Malte Hedderich" />
	<meta name="robots" content="index,follow,max-image-preview:large" />
	<link rel="canonical" href={pageUrl} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Malte Hedderich" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={pageUrl} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@hedderichpro" />
	<meta name="twitter:creator" content="@hedderichpro" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
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

		<section aria-labelledby="archive-title" class="section-shell">
			<div class="section-rail space-y-4 lg:pt-3">
				<h2 class="section-heading" id="archive-title">Archive</h2>
				<p class="section-copy">{data.posts.length} essays, newest first.</p>
			</div>

			<EditorialList items={data.posts}>
				{#snippet row(post)}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a aria-label={`Read ${post.title}`} class="blog-index-link" href={post.href}>
						<div class="space-y-5">
							<div class="flex flex-wrap items-center gap-2.5">
								<span class="meta-pill">{post.tag}</span>
								<span class="meta-pill meta-pill--quiet">
									<CalendarDays aria-hidden="true" class="size-3.5 shrink-0" />
									<time datetime={post.publishedAt}>{post.dateLabel}</time>
								</span>
								<span class="meta-pill meta-pill--quiet">
									<Clock3 aria-hidden="true" class="size-3.5 shrink-0" />
									{post.readTime}
								</span>
							</div>

							<div class="blog-index-link__header">
								<h3 class="blog-index-link__title">{post.title}</h3>
								<span aria-hidden="true" class="blog-index-link__arrow">
									<ArrowRight class="size-4" />
								</span>
							</div>

							<p class="blog-index-link__summary">{post.summary}</p>
						</div>
					</a>
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
		gap: 3rem;
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
		gap: 1.35rem;
		max-width: 48rem;
	}

	.blog-index-title {
		font-size: 3.25rem;
		font-weight: 600;
		letter-spacing: -0.08em;
		line-height: 0.9;
	}

	.blog-index-intro {
		color: color-mix(in srgb, var(--color-ink) 70%, white 30%);
		font-size: 1.08rem;
		line-height: 1.75;
		max-width: 42rem;
	}

	.section-shell {
		display: grid;
		gap: 2.5rem;
	}

	.section-rail {
		max-width: 16rem;
	}

	.section-heading {
		color: var(--color-ink);
		font-size: 1rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.section-copy {
		color: var(--color-muted);
		font-size: 0.95rem;
		line-height: 1.7;
	}

	.meta-pill {
		align-items: center;
		background: var(--surface-container-high);
		border-radius: 9999px;
		color: var(--color-muted);
		display: inline-flex;
		font-size: 0.68rem;
		font-weight: 700;
		gap: 0.4rem;
		letter-spacing: 0.14em;
		line-height: 1.1;
		padding: 0.46rem 0.68rem;
		text-transform: uppercase;
	}

	.meta-pill--quiet {
		background: color-mix(
			in srgb,
			var(--surface-container-lowest) 82%,
			var(--surface-container-low) 18%
		);
		color: color-mix(in srgb, var(--color-ink) 58%, white 42%);
	}

	.blog-index-link {
		color: inherit;
		display: block;
		text-decoration: none;
	}

	.blog-index-link:focus-visible {
		outline: 2px solid var(--outline-focus);
		outline-offset: 6px;
	}

	.blog-index-link__header {
		align-items: flex-start;
		display: flex;
		gap: 1rem;
		justify-content: space-between;
	}

	.blog-index-link__title {
		color: var(--color-ink);
		font-size: 1.45rem;
		font-weight: 600;
		letter-spacing: -0.055em;
		line-height: 1.05;
		max-width: 19ch;
	}

	.blog-index-link__arrow {
		align-items: center;
		background: var(--surface-container-low);
		border-radius: 9999px;
		color: var(--color-primary);
		display: inline-flex;
		flex: 0 0 auto;
		height: 2.25rem;
		justify-content: center;
		transition:
			background 180ms ease,
			transform 180ms ease;
		width: 2.25rem;
	}

	.blog-index-link:hover .blog-index-link__arrow {
		background: color-mix(in srgb, var(--surface-container-high) 82%, white 18%);
		transform: translateX(0.16rem);
	}

	.blog-index-link__summary {
		color: var(--color-muted);
		font-size: 1rem;
		line-height: 1.75;
		max-width: 43rem;
	}

	@media (min-width: 1024px) {
		.blog-index-hero {
			grid-template-columns: minmax(9rem, 0.3fr) minmax(0, 1fr);
			padding-top: 1rem;
		}

		.blog-index-hero .ds-inline-link {
			align-self: start;
			margin-top: 0.9rem;
		}

		.section-shell {
			grid-template-columns: minmax(9rem, 0.3fr) minmax(0, 1fr);
		}
	}

	@media (min-width: 640px) {
		.blog-index-title {
			font-size: 5rem;
		}

		.blog-index-intro {
			font-size: 1.22rem;
		}

		.blog-index-link__title {
			font-size: 2rem;
		}
	}

	@media (min-width: 1280px) {
		.blog-index-title {
			font-size: 7rem;
		}

		.blog-index-link__title {
			font-size: 2.4rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.blog-index-link__arrow {
			transition-duration: 0.01ms;
		}
	}
</style>
