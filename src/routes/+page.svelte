<script lang="ts">
	import ArrowUpRight from '~icons/lucide/arrow-up-right';
	import Mail from '~icons/lucide/mail';
	import Github from '~icons/bxl/github';
	import Linkedin from '~icons/bxl/linkedin';
	import TwitterX from '~icons/bxl/twitter-x';

	import { Button, Card, EditorialList, EmailObfuscator, ThemeToggle, WritingLink } from '$lib';
	import profileImageAsset from '$lib/assets/malte-hedderich.png';
	import type { EncryptedEmailData } from '$lib/email-obfuscation';
	import {
		createAbsoluteUrl,
		createSocialImageUrl,
		SITE_AUTHOR,
		SITE_LANGUAGE,
		SITE_NAME,
		SITE_SOCIAL_HANDLE,
		SITE_URL,
		SOCIAL_IMAGE_HEIGHT,
		SOCIAL_IMAGE_WIDTH
	} from '$lib/site';
	import type { PageProps } from './$types';

	type NavItem = {
		id: string;
		href: string;
		label: string;
	};

	type Project = {
		description: string;
		firstCommit: string;
		id: string;
		launched?: string;
		title: string;
		url: string;
	};

	type Learning = {
		id: string;
		label: string;
		text: string;
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
	const pageTitle = 'Malte Hedderich | AI Engineer Building Products with AI';
	const pageDescription =
		'AI engineer Malte Hedderich builds, sells and runs his own products with AI, four launched since August 2024, and writes up what he learns, misses included.';
	const pageImage = new URL(profileImageAsset, SITE_URL).toString();
	const shareImage = createSocialImageUrl('home.jpg');
	const shareImageAlt = 'Malte Hedderich, AI engineer and product builder, beside his portrait';
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

	const projectDateFormat = new Intl.DateTimeFormat('en', {
		day: 'numeric',
		month: 'short',
		timeZone: 'UTC',
		year: 'numeric'
	});
	const formatProjectDate = (date: string) =>
		projectDateFormat.format(new Date(`${date}T00:00:00.000Z`));

	const navigation: NavItem[] = [
		{ id: 'projects', href: '#projects', label: 'Projects' },
		{ id: 'writing', href: '#writing', label: 'Writing' },
		{ id: 'experience', href: '#experience', label: 'Background' },
		{ id: 'contact', href: '#contact', label: 'Contact' }
	];

	const projects: Project[] = [
		{
			description:
				'Generates sets of badges that share one art direction, so they look like they belong together.',
			firstCommit: '2026-08-02',
			id: 'emblemry',
			launched: '2026-08-10',
			title: 'Emblemry',
			url: 'https://emblemry.com'
		},
		{
			description:
				'Turns the countries and cities you visit into illustrated stamps, travel goals, and a score to share. For\u00a0iPhone.',
			firstCommit: '2026-07-26',
			id: 'stampstat',
			launched: '2026-09-14',
			title: 'Stamp Stat',
			url: 'https://stampstat.com'
		},
		{
			description:
				'Pressure-tests a SaaS idea before you spend months building it. The free trial needs an account and a card.',
			firstCommit: '2026-01-11',
			id: 'genhone',
			launched: '2026-04-21',
			title: 'Genhone',
			url: 'https://genhone.com'
		},
		{
			description:
				'Matches your profile to a job ad, then writes a cover letter that fits only that role.',
			firstCommit: '2023-11-16',
			id: 'genwriter',
			launched: '2024-08-14',
			title: 'Genwriter',
			url: 'https://genwriter.com'
		}
	];

	// Derived from the project list, so the hero never needs a hand-written status update.
	const latestLaunch = projects
		.filter((project): project is Project & { launched: string } => Boolean(project.launched))
		.toSorted((a, b) => b.launched.localeCompare(a.launched))
		.at(0);

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

	// One learning per theme, in the order of the thesis. The words come from profile.md in the
	// social-media repo; a miss goes last, so it reads as one of the learnings.
	const learnings: Learning[] = [
		{
			id: 'building',
			label: 'Building',
			text: 'A ChatGPT plugin is mostly an MCP server with OAuth in front of it.'
		},
		{
			id: 'selling',
			label: 'Selling',
			text: 'A Shorts ad impression counts when the video starts. Mine got 49,251 in a week, and the average play lasted 1 second.'
		},
		{
			id: 'running',
			label: 'Running',
			text: 'Emblemry’s sign-in returned a 404 for 20 days, 10 of them with Google Ads running. My monitoring missed it.'
		}
	];

	// The hero asks for follows on the two channels where new writing is posted. LinkedIn is
	// the primary channel, so it comes first and gets the primary button.
	const followChannelIds = ['linkedin', 'x'];
	const followChannels = followChannelIds
		.map((id) => channels.find((channel) => channel.id === id))
		.filter((channel): channel is Channel => Boolean(channel));

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
	<meta property="og:image" content={shareImage} />
	<meta property="og:image:secure_url" content={shareImage} />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:width" content={String(SOCIAL_IMAGE_WIDTH)} />
	<meta property="og:image:height" content={String(SOCIAL_IMAGE_HEIGHT)} />
	<meta property="og:image:alt" content={shareImageAlt} />
	<meta property="profile:first_name" content="Malte" />
	<meta property="profile:last_name" content="Hedderich" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={SITE_SOCIAL_HANDLE} />
	<meta name="twitter:creator" content={SITE_SOCIAL_HANDLE} />
	<meta name="twitter:url" content={pageUrl} />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={shareImage} />
	<meta name="twitter:image:alt" content={shareImageAlt} />
	<svelte:element this={'script'} type="application/ld+json">{structuredData}</svelte:element>
</svelte:head>

<main class="ds-page" id="main-content" tabindex="-1">
	<div class="ds-page-frame ds-page-stack">
		<header class="home-masthead">
			<p class="ds-eyebrow home-masthead__eyebrow">AI engineer &amp; product builder</p>
			<nav aria-label="Section navigation" class="home-masthead__nav">
				<ul class="hero-nav">
					{#each navigation as item (item.id)}
						<li>
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
							<a href={item.href}>{item.label}</a>
						</li>
					{/each}
				</ul>
			</nav>
			<ThemeToggle class="home-masthead__theme" />
		</header>

		<section aria-describedby="hero-support" aria-labelledby="hero-name" class="home-hero">
			<div class="portrait-shell">
				<figure class="portrait-frame">
					<enhanced:img
						alt="Portrait of Malte Hedderich"
						class="portrait-image"
						decoding="async"
						fetchpriority="high"
						loading="eager"
						sizes="(min-width: 1280px) 320px, (min-width: 1024px) 272px, 128px"
						src="../lib/assets/malte-hedderich.png?w=640;320;272;256;128"
					/>
				</figure>

				{#if latestLaunch}
					<dl class="hero-latest">
						<dt>Latest launch</dt>
						<dd>
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
							<a href={latestLaunch.url}>{latestLaunch.title}</a>
							<time datetime={latestLaunch.launched}
								>{formatProjectDate(latestLaunch.launched)}</time
							>
						</dd>
					</dl>
				{/if}
			</div>

			<div class="hero-copy">
				<div class="space-y-5">
					<h1 class="hero-name" id="hero-name">Malte Hedderich</h1>
					<p class="hero-thesis">
						AI engineer. What I learn building, selling and running my own products with AI.
					</p>
				</div>

				<div class="hero-support" id="hero-support">
					<p>
						I build and ship my own products with AI, four since August 2024, and share what I learn
						from them, misses included.
					</p>
					<dl class="hero-learnings">
						{#each learnings as learning (learning.id)}
							<div>
								<dt>{learning.label}</dt>
								<dd>{learning.text}</dd>
							</div>
						{/each}
					</dl>
				</div>

				<div class="hero-follow">
					<p class="hero-follow__prompt">Follow if you want to build and own a product with AI.</p>
					<ul class="hero-actions" role="list">
						{#each followChannels as channel, index (channel.id)}
							<li>
								<!-- eslint-disable svelte/no-navigation-without-resolve -->
								<a
									aria-label={`Follow on ${channel.label}: ${channel.value}`}
									class="ds-button"
									data-variant={index === 0 ? 'primary' : 'secondary'}
									href={channel.href}
									rel="me"
								>
									<span class="ds-button__label hero-actions__label">
										<channel.icon aria-hidden="true" class="size-5 shrink-0" />
										Follow on {channel.label}
									</span>
									<span aria-hidden="true" class="ds-button__icon">
										<ArrowUpRight class="size-4" />
									</span>
								</a>
								<!-- eslint-enable svelte/no-navigation-without-resolve -->
							</li>
						{/each}
					</ul>
				</div>
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
						<Card class="project-card" href={project.url} title={project.title}>
							{#snippet footer()}
								<span class="project-url">{project.url.replace('https://', '')}</span>
								<ArrowUpRight aria-hidden="true" class="size-4 shrink-0" />
							{/snippet}

							<p>{project.description}</p>

							<dl class="project-dates">
								<div>
									<dt>First commit</dt>
									<dd>
										<time datetime={project.firstCommit}>
											{formatProjectDate(project.firstCommit)}
										</time>
									</dd>
								</div>
								{#if project.launched}
									<div>
										<dt>Launched</dt>
										<dd>
											<time datetime={project.launched}>{formatProjectDate(project.launched)}</time>
										</dd>
									</div>
								{/if}
							</dl>
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
				<div class="background-intro">
					<h3 class="ds-heading background-title">
						ML Engineering Associate Manager at Accenture.
					</h3>
					<p class="background-lead">Leading teams that build production LLM applications.</p>
				</div>

				<dl class="background-facts">
					<div>
						<dt>Before</dt>
						<dd>
							Two years at Serviceware, where I shipped intent recognition, semantic search, and a
							production LLM app in 2023.
						</dd>
					</div>
					<div>
						<dt>Studied</dt>
						<dd>
							Business Informatics at TU Darmstadt, with a thesis on open-source MLOps, and a year
							of Software Engineering at Tongji University in Shanghai.
						</dd>
					</div>
				</dl>
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

									<span class="contact-link__label">{emailChannel.label}</span>
									<span aria-live="polite" class="contact-link__value">{state.text}</span>

									<span aria-hidden="true" class="contact-link__arrow">
										<ArrowUpRight />
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

								<span class="contact-link__label">{channel.label}</span>
								<span class="contact-link__value">{channel.value}</span>

								<span aria-hidden="true" class="contact-link__arrow">
									<ArrowUpRight />
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
		display: grid;
		grid-template-areas:
			'eyebrow theme'
			'nav nav';
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--space-2xs) var(--space-md);
	}
	.home-masthead__eyebrow {
		grid-area: eyebrow;
	}
	.home-masthead__nav {
		grid-area: nav;
	}
	:global(.home-masthead__theme) {
		grid-area: theme;
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
		display: grid;
		gap: var(--space-md);
		font-size: var(--text-body);
		line-height: 1.7;
		max-width: var(--measure-prose);
	}
	.hero-learnings {
		display: grid;
		gap: var(--space-sm);
		margin: 0;
	}
	.hero-learnings div {
		display: grid;
		gap: var(--space-3xs);
	}
	.hero-learnings dt {
		color: var(--color-muted);
	}
	.hero-learnings dd {
		line-height: 1.6;
		margin: 0;
		text-wrap: pretty;
	}
	.hero-follow {
		display: grid;
		gap: var(--space-sm);
	}
	.hero-follow__prompt {
		font-size: var(--text-body);
		font-weight: var(--weight-label);
		line-height: 1.5;
		max-width: var(--measure-prose);
	}
	.hero-actions {
		display: grid;
		gap: var(--space-xs);
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.hero-actions .ds-button {
		justify-content: space-between;
		width: 100%;
	}
	.hero-actions__label {
		gap: var(--space-xs);
	}
	/* Narrow: a small framed photo with the latest launch beside it. Desktop: one signal card
	   with the launch as its caption. */
	.portrait-shell {
		align-items: end;
		display: grid;
		gap: var(--space-sm);
		grid-template-columns: 9rem minmax(0, 1fr);
	}
	.portrait-frame {
		background: var(--color-signal);
		margin: 0;
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
	.hero-latest {
		color: var(--color-muted);
		display: grid;
		gap: var(--space-3xs);
		margin: 0;
	}
	.hero-latest dd {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--space-sm);
	}
	.hero-latest a {
		text-decoration-line: underline;
		text-decoration-thickness: 0.08em;
		text-underline-offset: 0.24em;
	}
	.hero-latest a:focus-visible {
		outline: var(--focus-ring-width) solid var(--outline-focus);
		outline-offset: var(--focus-ring-offset);
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
	/* Pin the dates to the foot of the body, on fixed columns, so they line up across a row
	   however long each description runs. */
	:global(.project-card .ds-card__body) {
		display: flex;
		flex-direction: column;
	}
	.project-dates {
		display: grid;
		gap: var(--space-xs) var(--space-md);
		grid-template-columns: repeat(2, 8rem);
		margin-top: auto;
		padding-top: var(--space-md);
	}
	.project-dates dt,
	.hero-learnings dt,
	.hero-latest dt {
		font-size: var(--text-micro);
		font-weight: var(--weight-label);
		letter-spacing: 0.08em;
		line-height: 1.5;
		text-transform: uppercase;
	}
	.project-dates dd,
	.hero-latest dd {
		color: var(--color-on-surface);
		font-size: var(--text-meta);
		font-variant-numeric: tabular-nums;
		font-weight: var(--weight-label);
		line-height: 1.5;
		margin: 0;
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
		gap: var(--space-xl);
		padding: clamp(var(--space-md), 4vw, var(--space-xl));
	}
	.background-intro {
		display: grid;
		gap: var(--space-sm);
	}
	.background-title {
		font-size: var(--text-title);
		max-width: 28ch;
	}
	.background-lead {
		font-size: var(--text-lead);
		line-height: 1.5;
		max-width: var(--measure-prose);
	}
	.background-facts {
		display: grid;
		gap: var(--space-lg) var(--space-xl);
		margin: 0;
	}
	.background-facts dt {
		color: var(--panel-emphasis);
		font-size: var(--text-micro);
		font-weight: var(--weight-label);
		letter-spacing: 0.08em;
		line-height: 1.5;
		text-transform: uppercase;
	}
	.background-facts dd {
		font-size: var(--text-body);
		line-height: 1.7;
		margin: var(--space-2xs) 0 0;
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
		/* Hang the link padding outside the column so the icons align with the heading. */
		margin: 0 calc(-1 * var(--space-sm));
		padding: 0;
	}
	/* Icon and arrow share the label's row, so both centre on the label line; the handle
	   sits beneath the label. */
	.contact-link {
		align-content: center;
		align-items: center;
		column-gap: var(--space-sm);
		display: grid;
		grid-template-areas:
			'icon label arrow'
			'. value .';
		grid-template-columns: var(--space-md) minmax(0, 1fr) auto;
		min-height: 6rem;
		padding: var(--space-sm);
		row-gap: var(--space-3xs);
		text-decoration: none;
		transition: background-color var(--motion-fast) var(--motion-ease);
	}
	.contact-link:hover {
		background: var(--color-paper);
	}
	.contact-link:active {
		background: var(--color-signal-active);
	}
	/* Barlow Condensed capitals sit 0.045em below the centre of the 1.08 line box, so the
	   icon and arrow shift by that much to centre on the label's capitals. */
	.contact-link__icon,
	.contact-link__arrow {
		translate: 0 calc(var(--text-title-sm) * 0.045);
	}
	.contact-link__icon {
		display: inline-flex;
		grid-area: icon;
	}
	:global(.contact-link__glyph) {
		width: var(--space-md);
		height: var(--space-md);
	}
	.contact-link__label {
		grid-area: label;
		font-family: var(--font-display);
		font-size: var(--text-title-sm);
		font-weight: var(--weight-display);
		line-height: var(--leading-heading);
	}
	.contact-link__value {
		grid-area: value;
		font-size: var(--text-meta);
		line-height: 1.5;
		overflow-wrap: anywhere;
	}
	.contact-link__arrow {
		display: inline-flex;
		grid-area: arrow;
	}
	.contact-link__arrow :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}
	@media (min-width: 640px) {
		.hero-actions {
			display: flex;
			flex-wrap: wrap;
			gap: var(--space-sm);
		}
		.hero-actions .ds-button {
			min-width: 14rem;
		}
		.hero-learnings div {
			align-items: baseline;
			gap: var(--space-md);
			grid-template-columns: 5rem minmax(0, 1fr);
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
		.home-masthead {
			grid-template-areas: 'eyebrow nav theme';
			grid-template-columns: minmax(0, 1fr) auto auto;
			column-gap: var(--space-xl);
		}
		.background-facts {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.home-hero {
			grid-template-columns: minmax(0, 1fr) 19rem;
			align-items: start;
			gap: var(--space-xl);
		}
		/* The card is a signal surface in both themes, so its text and focus ring pin to ink. */
		.portrait-shell {
			background: var(--color-signal);
			gap: var(--space-sm);
			grid-template-columns: minmax(0, 1fr);
			/* Drop the card to the cap height of the name beside it. */
			margin-top: calc(var(--text-hero) * 0.165);
			order: 2;
			padding: var(--space-sm);
		}
		.portrait-frame {
			padding: 0;
		}
		.hero-latest,
		.hero-latest dd {
			color: var(--color-ink);
		}
		.hero-latest a:focus-visible {
			outline-color: var(--color-ink);
		}
	}
	@media (min-width: 1280px) {
		.home-hero {
			grid-template-columns: minmax(0, 1fr) 23rem;
			gap: var(--space-2xl);
		}
		.portrait-shell {
			gap: var(--space-md);
			padding: var(--space-md);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.contact-link {
			transition-duration: 0.01ms;
		}
	}
</style>
