<script lang="ts">
	import ArrowRight from '~icons/lucide/arrow-right';
	import ArrowUpRight from '~icons/lucide/arrow-up-right';
	import Mail from '~icons/lucide/mail';
	import Github from '~icons/bxl/github';
	import Linkedin from '~icons/bxl/linkedin';
	import TwitterX from '~icons/bxl/twitter-x';

	import { Button, Card, EditorialList, EmailObfuscator, WritingLink } from '$lib';
	import profileImageAsset from '$lib/assets/malte-hedderich.png';
	import type { EncryptedEmailData } from '$lib/email-obfuscation';
	import {
		createAbsoluteUrl,
		SITE_AUTHOR,
		SITE_LANGUAGE,
		SITE_NAME,
		SITE_SOCIAL_HANDLE,
		SITE_URL
	} from '$lib/site';
	import type { PageProps } from './$types';

	type NavItem = {
		id: string;
		href: string;
		label: string;
	};

	type Project = {
		description: string;
		id: string;
		proof: string;
		status: string;
		title: string;
		url: string;
	};

	type Channel = {
		href: string;
		icon: typeof Mail;
		id: string;
		label: string;
		value: string;
	};

	const pageUrl = createAbsoluteUrl('/');
	const blogUrl = createAbsoluteUrl('/blog/');
	const pageTitle = 'Malte Hedderich | AI Engineer for LLM Products';
	const pageDescription =
		'AI engineer Malte Hedderich builds LLM SaaS products, production AI systems, evaluation workflows, and practical AI agents.';
	const pageImage = new URL(profileImageAsset, SITE_URL).toString();
	const initialVisiblePosts = 3;

	const obfuscatedEmail: EncryptedEmailData = {
		ciphertext: 'NqoKSjF7vYp67Dcx9G7gBczblm9L5raq7OmKSw4tvfLO4OI=',
		iv: 'eFpvbsnoikxfY5DJ'
	};

	let { data }: PageProps = $props();
	let showAllPosts = $state(false);

	let visiblePosts = $derived(showAllPosts ? data.posts : data.posts.slice(0, initialVisiblePosts));
	let hiddenPostCount = $derived(Math.max(data.posts.length - initialVisiblePosts, 0));
	let visiblePostCountLabel = $derived(
		`${visiblePosts.length} of ${data.posts.length} piece${data.posts.length === 1 ? '' : 's'}`
	);

	const togglePostVisibility = () => {
		showAllPosts = !showAllPosts;
	};

	const navigation: NavItem[] = [
		{ id: 'projects', href: '#projects', label: 'Projects' },
		{ id: 'writing', href: '#writing', label: 'Writing' },
		{ id: 'experience', href: '#experience', label: 'Experience' },
		{ id: 'contact', href: '#contact', label: 'Contact' }
	];

	const projects: Project[] = [
		{
			description:
				'Describe a badge, choose an art direction, and get a transparent 1024 × 1024 PNG.',
			id: 'emblemry',
			proof: 'First commit August 2, 2026 · Launched August 10, 2026',
			status: 'Active',
			title: 'Emblemry',
			url: 'https://emblemry.com'
		},
		{
			description:
				'Turns the countries and cities you visit into illustrated stamps, travel goals, and a shareable travel score. Built for iPhone.',
			id: 'stampstat',
			proof: 'First commit July 26, 2026',
			status: 'Active',
			title: 'Stamp Stat',
			url: 'https://stampstat.com'
		},
		{
			description:
				'Pressure-tests SaaS ideas before you spend months on one. Free trial, with signup and card on file.',
			id: 'genhone',
			proof: 'First commit January 11, 2026 · Launched April 21, 2026',
			status: 'Active',
			title: 'Genhone',
			url: 'https://genhone.com'
		},
		{
			description:
				'Matches your profile to a job ad and writes a cover letter for that role. Not a template with your name pasted in.',
			id: 'genwriter',
			proof: 'First commit November 16, 2023 · Launched August 14, 2024',
			status: 'Active',
			title: 'Genwriter',
			url: 'https://genwriter.com'
		}
	];

	const emailChannel = {
		icon: Mail,
		id: 'email',
		label: 'Email',
		loadingText: 'Loading...'
	} as const;

	const channels: Channel[] = [
		{
			href: 'https://www.linkedin.com/in/hedderich/',
			icon: Linkedin,
			id: 'linkedin',
			label: 'LinkedIn',
			value: '/in/hedderich'
		},
		{
			href: 'https://github.com/maltehedderich',
			icon: Github,
			id: 'github',
			label: 'GitHub',
			value: 'maltehedderich'
		},
		{
			href: 'https://x.com/hedderichpro',
			icon: TwitterX,
			id: 'x',
			label: 'X',
			value: '@hedderichpro'
		}
	];

	const structuredData = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@id': `${pageUrl}#person`,
				'@type': 'Person',
				name: SITE_AUTHOR,
				givenName: 'Malte',
				familyName: 'Hedderich',
				url: pageUrl,
				image: {
					'@type': 'ImageObject',
					url: pageImage,
					width: 1250,
					height: 1250,
					caption: 'Portrait of Malte Hedderich'
				},
				description: pageDescription,
				jobTitle: 'ML Engineering Associate Manager',
				worksFor: {
					'@type': 'Organization',
					name: 'Accenture'
				},
				alumniOf: [
					{
						'@type': 'CollegeOrUniversity',
						name: 'Technical University of Darmstadt'
					},
					{
						'@type': 'CollegeOrUniversity',
						name: 'Tongji University'
					}
				],
				knowsAbout: [
					'LLM applications',
					'SaaS product development',
					'Evaluation systems',
					'Agent design',
					'ML engineering'
				],
				sameAs: channels.map((channel) => channel.href)
			},
			{
				'@id': `${pageUrl}#website`,
				'@type': 'WebSite',
				url: pageUrl,
				name: SITE_NAME,
				description: pageDescription,
				inLanguage: SITE_LANGUAGE,
				publisher: {
					'@id': `${pageUrl}#person`
				},
				hasPart: {
					'@id': `${blogUrl}#blog`,
					'@type': 'Blog',
					name: `${SITE_NAME} Blog`,
					url: blogUrl
				}
			},
			{
				'@id': `${pageUrl}#webpage`,
				'@type': 'ProfilePage',
				url: pageUrl,
				name: pageTitle,
				description: pageDescription,
				inLanguage: SITE_LANGUAGE,
				about: {
					'@id': `${pageUrl}#person`
				},
				mainEntity: {
					'@id': `${pageUrl}#person`
				},
				isPartOf: {
					'@id': `${pageUrl}#website`
				},
				primaryImageOfPage: {
					'@type': 'ImageObject',
					url: pageImage,
					width: 1250,
					height: 1250
				}
			}
		]
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta name="author" content={SITE_AUTHOR} />
	<meta name="robots" content="index,follow,max-image-preview:large" />
	<link rel="canonical" href={pageUrl} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="profile" />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:image" content={pageImage} />
	<meta property="og:image:secure_url" content={pageImage} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1250" />
	<meta property="og:image:height" content="1250" />
	<meta property="og:image:alt" content="Portrait of Malte Hedderich" />
	<meta property="profile:first_name" content="Malte" />
	<meta property="profile:last_name" content="Hedderich" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={SITE_SOCIAL_HANDLE} />
	<meta name="twitter:creator" content={SITE_SOCIAL_HANDLE} />
	<meta name="twitter:url" content={pageUrl} />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={pageImage} />
	<meta name="twitter:image:alt" content="Portrait of Malte Hedderich" />
	<svelte:element this={'script'} type="application/ld+json">{structuredData}</svelte:element>
</svelte:head>

<main class="ds-page" id="main-content" tabindex="-1">
	<div class="ds-page-frame ds-page-stack">
		<header class="home-masthead">
			<p class="ds-eyebrow">AI engineer &amp; product builder</p>
			<nav aria-label="Section navigation">
				<ul class="hero-nav">
					{#each navigation as item (item.id)}
						<li>
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
							<a href={item.href}>{item.label}</a>
						</li>
					{/each}
				</ul>
			</nav>
		</header>

		<section aria-describedby="hero-support" aria-labelledby="hero-name" class="home-hero">
			<figure class="portrait-shell">
				<div class="portrait-frame">
					<enhanced:img
						alt="Portrait of Malte Hedderich"
						class="portrait-image"
						decoding="async"
						fetchpriority="high"
						loading="eager"
						sizes="(min-width: 1280px) 320px, (min-width: 1024px) 272px, 128px"
						src="../lib/assets/malte-hedderich.png?w=640;320;272;256;128"
					/>
				</div>
			</figure>

			<div class="hero-copy">
				<div class="space-y-5">
					<h1 class="hero-name" id="hero-name">Malte Hedderich</h1>
					<p class="hero-thesis">
						I build SaaS products that use LLMs and write about what holds up in production.
					</p>
				</div>

				<div class="hero-actions">
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a class="ds-button" data-variant="primary" href="/blog/">
						<span class="ds-button__label">Read the blog</span>
						<span aria-hidden="true" class="ds-button__icon">
							<ArrowUpRight class="size-4" />
						</span>
					</a>

					<a class="ds-button" data-variant="secondary" href="#projects">
						<span class="ds-button__label">See the projects</span>
						<span aria-hidden="true" class="ds-button__icon">
							<ArrowRight class="size-4" />
						</span>
					</a>
				</div>
				<p class="hero-support" id="hero-support">
					Right now I'm building Genhone, which pressure-tests SaaS ideas before you burn months on
					the wrong one. By day I lead teams shipping LLM applications. I write about evaluation,
					agent design, and the choices you regret at scale.
				</p>
			</div>
		</section>

		<section aria-labelledby="projects-title" class="ds-section scroll-mt-24" id="projects">
			<div class="ds-section__rail space-y-4">
				<h2 class="ds-section__heading" id="projects-title">Projects</h2>
				<p class="ds-section__copy">Four products built after hours. All are live.</p>
			</div>

			<ul class="project-grid" role="list">
				{#each projects as project (project.id)}
					<li>
						<Card
							class="project-card"
							eyebrow={project.status}
							href={project.url}
							title={project.title}
						>
							{#snippet footer()}
								<span class="project-url">{project.url.replace('https://', '')}</span>
								<ArrowUpRight aria-hidden="true" class="size-4 shrink-0 text-(--color-ink)" />
							{/snippet}

							<p>{project.description}</p>

							<div class="space-y-2 pt-2">
								<p class="text-(length:--text-meta) leading-6 text-(--color-muted)">
									{project.proof}
								</p>
							</div>
						</Card>
					</li>
				{/each}
			</ul>
		</section>

		<section aria-labelledby="writing-title" class="ds-section scroll-mt-24" id="writing">
			<div class="ds-section__rail space-y-4">
				<h2 class="ds-section__heading" id="writing-title">Writing</h2>
				<p class="ds-section__copy">
					Essays published here and elsewhere, with the latest pieces visible first.
				</p>
			</div>

			<div class="space-y-5">
				<div id="writing-post-list">
					<EditorialList items={visiblePosts}>
						{#snippet row(post)}<WritingLink {post} showDate={false} />{/snippet}
					</EditorialList>
				</div>

				{#if hiddenPostCount > 0}
					<div class="writing-controls">
						<p class="writing-count">Showing {visiblePostCountLabel}</p>

						<Button
							aria-controls="writing-post-list"
							aria-expanded={showAllPosts}
							class="writing-toggle"
							onclick={togglePostVisibility}
							variant="secondary"
						>
							{showAllPosts
								? 'Show fewer pieces'
								: `Show ${hiddenPostCount} more piece${hiddenPostCount === 1 ? '' : 's'}`}
						</Button>
					</div>
				{/if}
			</div>
		</section>

		<section aria-labelledby="experience-title" class="ds-section scroll-mt-24" id="experience">
			<div class="ds-section__rail space-y-4">
				<h2 class="ds-section__heading" id="experience-title">Background</h2>
			</div>

			<article class="background-panel ds-surface" data-mode="dark">
				<h3 class="ds-heading background-title">ML Engineering Associate Manager at Accenture.</h3>
				<p class="background-copy">
					Leading teams that build production LLM applications. Before that, two years at
					Serviceware, where I shipped intent recognition, semantic search, and a production LLM app
					in 2023. I studied Business Informatics at TU Darmstadt, wrote my thesis on open-source
					MLOps, and spent a year at Tongji University in Shanghai studying Software Engineering.
				</p>
			</article>
		</section>

		<section
			aria-labelledby="contact-title"
			class="ds-section contact-panel ds-surface"
			data-mode="signal"
			id="contact"
		>
			<div class="ds-section__rail space-y-4">
				<h2 class="ds-section__heading" id="contact-title">Reach me</h2>
			</div>

			<address class="not-italic">
				<ul class="contact-links" role="list">
					<li>
						<EmailObfuscator
							encryptedData={obfuscatedEmail}
							fallbackHref="#contact"
							label={emailChannel.label}
							loadingText={emailChannel.loadingText}
						>
							{#snippet children(state)}
								<!-- eslint-disable svelte/no-navigation-without-resolve -->
								<a
									aria-label={state.ariaLabel}
									aria-busy={!state.ready}
									class="contact-link"
									data-channel={emailChannel.id}
									href={state.href}
								>
									<span aria-hidden="true" class="contact-link__icon">
										<emailChannel.icon class="contact-link__glyph" />
									</span>

									<span class="contact-link__body">
										<span class="contact-link__label">{emailChannel.label}</span>
										<span aria-live="polite" class="contact-link__value">{state.text}</span>
									</span>

									<span aria-hidden="true" class="contact-link__arrow">
										<ArrowUpRight class="size-4" />
									</span>
								</a>
								<!-- eslint-enable svelte/no-navigation-without-resolve -->
							{/snippet}
						</EmailObfuscator>
					</li>

					{#each channels as channel (channel.id)}
						<li>
							<!-- eslint-disable svelte/no-navigation-without-resolve -->
							<a
								aria-label={`${channel.label}: ${channel.value}`}
								class="contact-link"
								data-channel={channel.id}
								href={channel.href}
								rel="me"
							>
								<span aria-hidden="true" class="contact-link__icon">
									<channel.icon class="contact-link__glyph" />
								</span>

								<span class="contact-link__body">
									<span class="contact-link__label">{channel.label}</span>
									<span class="contact-link__value">{channel.value}</span>
								</span>

								<span aria-hidden="true" class="contact-link__arrow">
									<ArrowUpRight class="size-4" />
								</span>
							</a>
							<!-- eslint-enable svelte/no-navigation-without-resolve -->
						</li>
					{/each}
				</ul>
			</address>
		</section>
	</div>
</main>

<style>
	.home-masthead {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-sm) var(--space-xl);
	}
	.home-masthead + .home-hero {
		margin-top: calc(var(--section-gap) * -0.5);
	}
	.hero-nav {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs) var(--space-md);
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.hero-nav a {
		align-items: center;
		display: inline-flex;
		min-height: 2.75rem;
		font-size: var(--text-meta);
		font-weight: var(--weight-label);
		text-decoration: none;
		text-underline-offset: var(--space-3xs);
	}
	.hero-nav a:hover,
	.hero-nav a:active {
		text-decoration: underline;
	}
	.hero-nav a:focus-visible,
	.contact-link:focus-visible {
		outline: var(--focus-ring-width) solid var(--outline-focus);
		outline-offset: var(--focus-ring-offset);
	}
	.home-hero {
		display: grid;
		gap: var(--space-lg);
	}
	.hero-copy {
		display: grid;
		gap: var(--space-lg);
		min-width: 0;
	}
	.hero-name {
		font-size: var(--text-hero);
		font-weight: var(--weight-display);
		letter-spacing: var(--tracking-display);
		line-height: var(--leading-display);
		text-transform: uppercase;
		max-width: 14ch;
	}
	.hero-thesis {
		font-size: var(--text-hero-thesis);
		line-height: 1.2;
		max-width: 30ch;
	}
	.hero-support {
		color: var(--color-muted);
		font-size: var(--text-body);
		line-height: 1.7;
		max-width: var(--measure-prose);
	}
	.hero-actions {
		display: grid;
		gap: var(--space-xs);
	}
	.hero-actions .ds-button {
		justify-content: space-between;
	}
	.portrait-shell {
		width: 9rem;
	}
	.portrait-frame {
		background: var(--color-signal);
		padding: var(--space-2xs);
	}
	.portrait-frame :global(picture) {
		display: block;
	}
	.portrait-image {
		display: block;
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		object-position: center 20%;
	}
	.project-grid {
		display: grid;
		gap: var(--space-md);
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.project-url {
		font-size: var(--text-meta);
		overflow-wrap: anywhere;
	}
	:global(.project-card) {
		height: 100%;
	}
	.writing-controls {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: var(--space-sm);
	}
	.writing-count {
		color: var(--color-muted);
		font-size: var(--text-meta);
		line-height: 1.5;
	}
	:global(.writing-toggle) {
		min-width: 12rem;
	}
	.background-panel {
		display: grid;
		gap: var(--space-md);
		padding: clamp(var(--space-md), 4vw, var(--space-xl));
	}
	.background-title {
		font-size: var(--text-title);
		max-width: 28ch;
	}
	.background-copy {
		font-size: var(--text-body);
		line-height: 1.75;
		max-width: var(--measure-prose);
	}
	.contact-panel {
		padding: var(--space-lg) var(--page-gutter);
		margin-inline: calc(-1 * var(--page-gutter));
	}
	.contact-links {
		display: grid;
		gap: var(--space-sm) var(--space-md);
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.contact-link {
		align-items: center;
		display: grid;
		gap: var(--space-sm);
		grid-template-columns: auto minmax(0, 1fr) auto;
		min-height: 6rem;
		padding: var(--space-sm);
		text-decoration: none;
		transition: background-color var(--motion-fast) var(--motion-ease);
	}
	.contact-link:hover {
		background: var(--color-paper);
	}
	.contact-link:active {
		background: var(--color-signal-active);
	}
	.contact-link__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--space-lg);
	}
	:global(.contact-link__glyph) {
		width: var(--space-md);
		height: var(--space-md);
	}
	.contact-link__body {
		display: grid;
		gap: var(--space-3xs);
		min-width: 0;
	}
	.contact-link__label {
		font-family: var(--font-display);
		font-size: var(--text-title-sm);
		font-weight: var(--weight-display);
		line-height: var(--leading-heading);
	}
	.contact-link__value {
		font-size: var(--text-meta);
		line-height: 1.5;
		overflow-wrap: anywhere;
	}
	.contact-link__arrow {
		display: inline-flex;
	}
	@media (min-width: 640px) {
		.hero-actions {
			display: flex;
			flex-wrap: wrap;
			gap: var(--space-sm);
		}
		.hero-actions .ds-button {
			min-width: 12rem;
		}
		.project-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.contact-links {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.contact-panel {
			padding-block: var(--space-xl);
		}
	}
	@media (min-width: 1024px) {
		.home-hero {
			grid-template-columns: minmax(0, 1fr) 19rem;
			align-items: center;
			gap: var(--space-xl);
		}
		.portrait-shell {
			order: 2;
			width: 100%;
		}
		.portrait-frame {
			padding: var(--space-sm) var(--space-sm) var(--space-xl);
		}
	}
	@media (min-width: 1280px) {
		.home-hero {
			grid-template-columns: minmax(0, 1fr) 23rem;
			gap: var(--space-2xl);
		}
		.portrait-frame {
			padding: var(--space-md) var(--space-md) var(--space-2xl);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.contact-link {
			transition-duration: 0.01ms;
		}
	}
</style>
