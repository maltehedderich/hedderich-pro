<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import ArrowRight from '~icons/lucide/arrow-right';
	import ArrowUpRight from '~icons/lucide/arrow-up-right';
	import Mail from '~icons/lucide/mail';
	import Github from '~icons/bxl/github';
	import Linkedin from '~icons/bxl/linkedin';
	import TwitterX from '~icons/bxl/twitter-x';
	import Clock3 from '~icons/lucide/clock-3';
	import ExternalLink from '~icons/lucide/external-link';

	import { Button, Card, EditorialList, EmailObfuscator } from '$lib';
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

<main
	class="brand-page px-5 pt-8 pb-28 sm:px-8 sm:pt-10 lg:px-12 lg:pb-40"
	id="main-content"
	tabindex="-1"
>
	<div class="mx-auto max-w-304 space-y-24 sm:space-y-28 lg:space-y-36">
		<section
			aria-describedby="hero-support"
			aria-labelledby="hero-name"
			class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center lg:gap-12 xl:grid-cols-[minmax(0,1fr)_19rem] xl:gap-14"
		>
			<figure class="portrait-shell order-first self-start lg:order-last lg:justify-self-end">
				<div aria-hidden="true" class="portrait-halo"></div>
				<div class="portrait-frame">
					<enhanced:img
						alt="Portrait of Malte Hedderich"
						class="portrait-image"
						decoding="async"
						fetchpriority="high"
						loading="eager"
						sizes="(min-width: 1280px) 248px, (min-width: 1024px) 232px, (min-width: 640px) 128px, 96px"
						src="../lib/assets/malte-hedderich.png?w=496;248;192;128;96"
					/>
				</div>
			</figure>

			<div class="space-y-8 lg:max-w-176 xl:max-w-184">
				<div class="space-y-5">
					<h1 class="hero-name" id="hero-name">Malte Hedderich</h1>
					<p class="hero-thesis">
						I build SaaS products that use LLMs and write about what holds up in production.
					</p>
					<p class="hero-support" id="hero-support">
						Right now I'm building Genhone, which pressure-tests SaaS ideas before you burn months
						on the wrong one. By day I lead teams shipping LLM applications. I write about
						evaluation, agent design, and the choices you regret at scale.
					</p>
				</div>

				<nav aria-label="Section navigation">
					<ul class="hero-nav">
						{#each navigation as item, index (item.id)}
							<li>
								<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
								<a href={item.href}>{item.label}</a>

								{#if index < navigation.length - 1}
									<span aria-hidden="true">·</span>
								{/if}
							</li>
						{/each}
					</ul>
				</nav>

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
			</div>
		</section>

		<section aria-labelledby="projects-title" class="ds-section scroll-mt-24" id="projects">
			<div class="ds-section__rail space-y-4 lg:pt-3">
				<h2 class="ds-section__heading" id="projects-title">Projects</h2>
				<p class="ds-section__copy">Three products built after hours. All are live.</p>
			</div>

			<ul class="project-grid grid gap-6 xl:grid-cols-3" role="list">
				{#each projects as project (project.id)}
					<li class="min-h-full">
						<Card
							class="project-card h-full min-h-64 sm:min-h-72 xl:min-h-80"
							href={project.url}
							title={project.title}
						>
							{#snippet footer()}
								<span class="project-url min-w-0 leading-6 break-all">{project.url}</span>
								<ArrowUpRight aria-hidden="true" class="size-4 shrink-0 text-(--color-accent)" />
							{/snippet}

							<p>{project.description}</p>

							<div class="space-y-2 pt-2">
								<span class="ds-chip">{project.status}</span>
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
			<div class="ds-section__rail space-y-4 lg:pt-3">
				<h2 class="ds-section__heading" id="writing-title">Writing</h2>
				<p class="ds-section__copy">
					Essays published here and elsewhere, with the latest pieces visible first.
				</p>
			</div>

			<div class="space-y-5">
				<div id="writing-post-list">
					<EditorialList items={visiblePosts}>
						{#snippet row(post)}
							{#snippet writingLinkContent()}
								<div class="space-y-5">
									<div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
										<div class="min-w-0 flex-1 space-y-4">
											<div class="flex flex-wrap items-center gap-3">
												<span class="ds-chip">{post.tag}</span>
												{#if post.sourceLabel}
													<span class="ds-chip" data-tone="quiet">{post.sourceLabel}</span>
												{/if}
												<span class="ds-chip" data-tone="quiet">
													<Clock3 aria-hidden="true" class="size-3 shrink-0" />
													{post.readTime}
												</span>
											</div>

											<div class="writing-link__header">
												<h3 class="writing-title">{post.title}</h3>
												<span aria-hidden="true" class="writing-link__arrow">
													{#if post.isExternal}
														<ExternalLink class="size-4" />
													{:else}
														<ArrowUpRight class="size-4" />
													{/if}
												</span>
											</div>
										</div>
									</div>

									<p
										class="max-w-(--measure-prose) text-(length:--text-body) leading-[1.65] text-(--color-muted)"
									>
										{post.summary}
									</p>
								</div>
							{/snippet}

							{#if post.isExternal}
								<a
									aria-label={`Read ${post.title} on ${post.sourceLabel ?? 'external site'}`}
									class="writing-link"
									href={post.href}
									rel="external noreferrer noopener"
									target="_blank"
								>
									{@render writingLinkContent()}
								</a>
							{:else}
								<a
									aria-label={`Read ${post.title}`}
									class="writing-link"
									href={resolve(post.href as Pathname)}
								>
									{@render writingLinkContent()}
								</a>
							{/if}
						{/snippet}
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
			<div class="ds-section__rail space-y-4 lg:pt-3">
				<h2 class="ds-section__heading" id="experience-title">Background</h2>
			</div>

			<article class="background-panel">
				<p class="background-copy">
					ML Engineering Associate Manager at Accenture, leading teams that build production LLM
					applications. Before that, two years at Serviceware, where I shipped intent recognition,
					semantic search, and a production LLM app in 2023. I studied Business Informatics at TU
					Darmstadt, wrote my thesis on open-source MLOps, and spent a year at Tongji University in
					Shanghai studying Software Engineering.
				</p>
			</article>
		</section>

		<section aria-labelledby="contact-title" class="ds-section scroll-mt-24" id="contact">
			<div class="ds-section__rail space-y-4 lg:pt-3">
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
	.brand-page {
		overflow-x: clip;
	}

	.hero-name {
		font-size: var(--text-hero);
		font-weight: 600;
		letter-spacing: -0.08em;
		line-height: 0.9;
		max-width: 10.5ch;
	}

	.hero-thesis {
		color: var(--color-ink);
		font-size: var(--text-hero-thesis);
		font-weight: 500;
		letter-spacing: -0.055em;
		line-height: 1.04;
		max-width: 16ch;
	}

	.hero-support {
		color: color-mix(in srgb, var(--color-ink) 70%, white 30%);
		font-size: var(--text-body);
		line-height: 1.8;
		max-width: 37rem;
	}

	.hero-nav {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs) var(--space-sm);
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.hero-nav li {
		align-items: center;
		color: var(--color-muted);
		display: inline-flex;
		/* On the li, not the a — the "·" separators are siblings of the link, so sizing the
		   link alone left them inheriting the root 16px next to 14px labels. */
		font-size: var(--text-meta);
		gap: var(--space-sm);
	}

	.hero-nav a {
		align-items: center;
		color: inherit;
		display: inline-flex;
		font-weight: 500;
		letter-spacing: -0.01em;
		min-height: 1.5rem;
		text-decoration: none;
		transition: color var(--motion-fast) var(--motion-ease);
	}

	.hero-nav a:hover {
		color: var(--color-ink);
	}

	.hero-nav a:active {
		color: var(--color-primary-active);
	}

	.hero-nav a:focus-visible {
		outline: var(--focus-ring-width) solid var(--outline-focus);
		outline-offset: var(--focus-ring-offset);
	}

	.hero-actions {
		display: grid;
		gap: var(--space-xs);
		max-width: 24rem;
	}

	.hero-actions .ds-button {
		gap: var(--space-xs);
		justify-content: center;
		min-width: 11.75rem;
		width: 100%;
	}

	.portrait-shell {
		position: relative;
		width: clamp(5.75rem, 26vw, 8rem);
	}

	.portrait-halo {
		aspect-ratio: 1;
		background: radial-gradient(circle, rgba(216, 175, 79, 0.12) 0%, rgba(216, 175, 79, 0) 72%);
		border-radius: var(--radius-full);
		filter: blur(10px);
		inset: auto -4% -4% -4%;
		position: absolute;
	}

	.portrait-frame {
		background: linear-gradient(
			145deg,
			color-mix(in srgb, var(--surface-container-low) 82%, white 18%) 0%,
			var(--surface-container-lowest) 100%
		);
		border-radius: var(--radius-full);
		box-shadow: var(--shadow-floating);
		padding: var(--space-2xs);
		position: relative;
	}

	.portrait-frame :global(picture) {
		display: block;
	}

	.portrait-image {
		aspect-ratio: 1;
		border-radius: var(--radius-full);
		display: block;
		object-fit: cover;
		object-position: center 20%;
		position: relative;
		width: 100%;
	}

	:global(.project-card h3) {
		max-width: 14ch;
	}

	.project-grid {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.project-url {
		font-size: var(--text-meta);
	}

	.writing-link {
		display: block;
		text-decoration: none;
	}

	/* Ring is drawn by .ds-editorial-list-item:has(a:focus-visible) so it traces the card. */
	.writing-link:focus-visible {
		outline: none;
	}

	.writing-link__header {
		align-items: start;
		display: flex;
		gap: var(--space-sm);
		justify-content: space-between;
	}

	.writing-link__arrow {
		color: var(--color-accent);
		flex: 0 0 auto;
		transition: transform var(--motion-base) var(--motion-ease);
	}

	.writing-link:hover .writing-title {
		color: var(--color-primary);
	}

	.writing-link:hover .writing-link__arrow {
		transform: translate(0.14rem, -0.14rem);
	}

	.writing-link:active .writing-title {
		color: var(--color-primary-active);
	}

	.writing-link:active .writing-link__arrow {
		transform: none;
	}

	.writing-title {
		color: var(--color-ink);
		font-size: var(--text-title);
		font-weight: 600;
		letter-spacing: -0.045em;
		line-height: 0.98;
		max-width: var(--measure-prose);
	}

	.writing-controls {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		justify-content: space-between;
	}

	.writing-count {
		color: var(--color-muted);
		font-size: var(--text-meta);
		line-height: 1.6;
	}

	:global(.writing-toggle) {
		min-width: 12rem;
	}

	.background-panel {
		background: linear-gradient(
			145deg,
			var(--surface-container-low) 0%,
			color-mix(in srgb, var(--surface-container-low) 78%, white 22%) 100%
		);
		border-radius: var(--radius-2xl);
		box-shadow: var(--shadow-floating);
		/* Fluid, but both endpoints land on the spacing scale — 2.75rem was the last
		   fractional-rem value left in the app. */
		padding: clamp(var(--space-md), 4vw, var(--space-xl));
	}

	.background-copy {
		color: color-mix(in srgb, var(--color-ink) 82%, white 18%);
		font-size: var(--text-title-sm);
		letter-spacing: -0.03em;
		line-height: 1.55;
		max-width: 54rem;
	}

	.contact-links {
		display: grid;
		gap: var(--space-sm);
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.contact-link {
		align-items: center;
		background: color-mix(in srgb, var(--surface-container-lowest) 84%, white 16%);
		border-radius: var(--radius-lg);
		display: grid;
		gap: var(--space-sm);
		grid-template-columns: auto minmax(0, 1fr) auto;
		min-height: 4.5rem;
		padding: var(--space-sm);
		text-decoration: none;
		transition:
			background-color var(--motion-base) var(--motion-ease),
			transform var(--motion-base) var(--motion-ease);
	}

	.contact-link:hover {
		background: color-mix(in srgb, var(--surface-container-low) 86%, white 14%);
		transform: translateY(-0.08rem);
	}

	.contact-link:active {
		background: var(--surface-container-low);
		transform: none;
	}

	.contact-link:focus-visible {
		outline: var(--focus-ring-width) solid var(--outline-focus);
		outline-offset: var(--focus-ring-offset);
	}

	.contact-link__icon {
		align-items: center;
		color: var(--color-ink);
		display: inline-flex;
		justify-content: center;
		line-height: 1;
		width: 2rem;
	}

	:global(.contact-link__glyph) {
		height: 1.75rem;
		width: 1.75rem;
	}

	.contact-link[data-channel='email'] :global(.contact-link__glyph) {
		height: 1.85rem;
		width: 1.85rem;
	}

	.contact-link[data-channel='x'] :global(.contact-link__glyph) {
		height: 1.7rem;
		width: 1.7rem;
	}

	.contact-link__body {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-3xs);
		min-width: 0;
	}

	.contact-link__label {
		color: var(--color-muted);
		font-size: var(--text-micro);
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.contact-link__value {
		color: var(--color-ink);
		font-size: var(--text-body);
		font-weight: 500;
		line-height: 1.45;
		overflow-wrap: anywhere;
	}

	.contact-link__arrow {
		color: var(--color-accent);
		flex: 0 0 auto;
		transition: transform var(--motion-base) var(--motion-ease);
	}

	.contact-link:hover .contact-link__arrow {
		transform: translate(0.14rem, -0.14rem);
	}

	.contact-link:active .contact-link__arrow {
		transform: none;
	}

	@media (min-width: 640px) {
		.hero-actions {
			align-items: center;
			display: flex;
			flex-wrap: wrap;
			gap: var(--space-sm);
			max-width: none;
		}

		.hero-actions .ds-button {
			width: auto;
		}

		.portrait-frame {
			padding: var(--space-xs);
		}
	}

	@media (min-width: 768px) {
		.contact-links {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1024px) {
		.portrait-shell {
			width: 14.5rem;
		}

		.portrait-frame {
			padding: var(--space-sm);
		}

		.contact-links {
			gap: var(--space-md);
		}
	}

	@media (min-width: 1280px) {
		.portrait-shell {
			width: 15.5rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-nav a,
		.writing-link__arrow,
		.contact-link,
		.contact-link__arrow {
			transition-duration: 0.01ms;
		}

		.contact-link:hover,
		.contact-link:active {
			transform: none;
		}

		.writing-link:hover .writing-link__arrow,
		.writing-link:active .writing-link__arrow,
		.contact-link:hover .contact-link__arrow,
		.contact-link:active .contact-link__arrow {
			transform: none;
		}
	}
</style>
