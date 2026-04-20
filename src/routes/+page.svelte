<script lang="ts">
	import ArrowRight from '~icons/lucide/arrow-right';
	import ArrowUpRight from '~icons/lucide/arrow-up-right';
	import Mail from '~icons/lucide/mail';
	import Github from '~icons/bxl/github';
	import Linkedin from '~icons/bxl/linkedin';
	import TwitterX from '~icons/bxl/twitter-x';
	import Clock3 from '~icons/lucide/clock-3';

	import { Button, Card, EditorialList, EmailObfuscator } from '$lib';
	import profileImageAsset from '$lib/assets/malte-hedderich.png';
	import type { EncryptedEmailData } from '$lib/email-obfuscation';
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

	type CurrentFocus = {
		id: string;
		label: string;
		value: string;
	};

	type Channel = {
		href: string;
		icon: typeof Mail;
		id: string;
		label: string;
		value: string;
	};

	const siteUrl = 'https://hedderich.pro';
	const pageUrl = `${siteUrl}/`;
	const pageTitle = 'Malte Hedderich | AI Engineer & Architect';
	const pageDescription =
		'Malte Hedderich builds SaaS products that use LLMs, leads teams shipping production AI systems, and writes about evaluation, agent design, and reliable product execution.';
	const pageImage = new URL(profileImageAsset, siteUrl).toString();
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
		`${visiblePosts.length} of ${data.posts.length} post${data.posts.length === 1 ? '' : 's'}`
	);

	const togglePostVisibility = () => {
		showAllPosts = !showAllPosts;
	};

	const navigation: NavItem[] = [
		{ id: 'projects', href: '#projects', label: 'Projects' },
		{ id: 'writing', href: '#writing', label: 'Writing' },
		{ id: 'now', href: '#now', label: 'Now' },
		{ id: 'experience', href: '#experience', label: 'Experience' },
		{ id: 'contact', href: '#contact', label: 'Contact' }
	];

	const projects: Project[] = [
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

	const nowItems: CurrentFocus[] = [
		{
			id: 'building',
			label: 'Building',
			value:
				"Working on Genhone's UX and building new features to improve ideas based on the evaluation."
		},
		{
			id: 'investigating',
			label: 'Investigating',
			value:
				"Custom agent setups in coding CLIs like Claude Code and Codex. I'm trying where these really work well and how to orchestrate workflows with multiple agents."
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
				name: 'Malte Hedderich',
				url: pageUrl,
				image: pageImage,
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
				name: 'Malte Hedderich',
				description: pageDescription,
				publisher: {
					'@id': `${pageUrl}#person`
				}
			},
			{
				'@id': `${pageUrl}#webpage`,
				'@type': 'WebPage',
				url: pageUrl,
				name: pageTitle,
				description: pageDescription,
				about: {
					'@id': `${pageUrl}#person`
				},
				isPartOf: {
					'@id': `${pageUrl}#website`
				}
			}
		]
	});
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
	<meta property="og:image" content={pageImage} />
	<meta property="og:image:width" content="1250" />
	<meta property="og:image:height" content="1250" />
	<meta property="og:image:alt" content="Portrait of Malte Hedderich" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@hedderichpro" />
	<meta name="twitter:creator" content="@hedderichpro" />
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
					<a class="ds-button" data-variant="primary" href="https://blog.hedderich.pro">
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

		<section aria-labelledby="projects-title" class="section-shell scroll-mt-24" id="projects">
			<div class="section-rail space-y-4 lg:pt-3">
				<h2 class="section-heading" id="projects-title">Projects</h2>
				<p class="section-copy">Two products built after hours. Both are live.</p>
			</div>

			<ul class="project-grid grid gap-6 xl:grid-cols-2" role="list">
				{#each projects as project (project.id)}
					<li class="min-h-full">
						<Card
							class="project-card min-h-64 sm:min-h-72 xl:min-h-80"
							href={project.url}
							title={project.title}
						>
							{#snippet footer()}
								<span class="project-url min-w-0 leading-6 break-all">{project.url}</span>
								<ArrowUpRight aria-hidden="true" class="size-4 shrink-0 text-(--color-accent)" />
							{/snippet}

							<p>{project.description}</p>

							<div class="space-y-2 pt-2">
								<span class="project-status">{project.status}</span>
								<p class="text-sm leading-6 text-(--color-muted)">{project.proof}</p>
							</div>
						</Card>
					</li>
				{/each}
			</ul>
		</section>

		<section aria-labelledby="writing-title" class="section-shell scroll-mt-24" id="writing">
			<div class="section-rail space-y-4 lg:pt-3">
				<h2 class="section-heading" id="writing-title">Writing</h2>
				<p class="section-copy">
					The full archive from blog.hedderich.pro, with the latest essays visible first.
				</p>
			</div>

			<div class="space-y-5">
				<div id="writing-post-list">
					<EditorialList items={visiblePosts}>
						{#snippet row(post)}
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
							<a aria-label={`Read ${post.title}`} class="writing-link" href={post.href}>
								<div class="space-y-5">
									<div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
										<div class="min-w-0 flex-1 space-y-4">
											<div class="flex flex-wrap items-center gap-2.5">
												<span class="meta-pill">{post.tag}</span>
												<span class="meta-pill meta-pill--quiet">
													<Clock3 aria-hidden="true" class="size-3.5 shrink-0" />
													{post.readTime}
												</span>
											</div>

											<div class="writing-link__header">
												<h3 class="writing-title">{post.title}</h3>
												<span aria-hidden="true" class="writing-link__arrow">
													<ArrowUpRight class="size-4" />
												</span>
											</div>
										</div>
									</div>

									<p class="text-base leading-7 text-(--color-muted) sm:text-lg">
										{post.summary}
									</p>
								</div>
							</a>
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
								? 'Show fewer posts'
								: `Show ${hiddenPostCount} more post${hiddenPostCount === 1 ? '' : 's'}`}
						</Button>
					</div>
				{/if}
			</div>
		</section>

		<section aria-labelledby="now-title" class="section-shell scroll-mt-24" id="now">
			<div class="section-rail space-y-4 lg:pt-3">
				<h2 class="section-heading" id="now-title">Now</h2>
				<p class="section-meta"><time datetime="2026-04">Updated April 2026</time></p>
			</div>

			<ul class="now-list" role="list">
				{#each nowItems as item (item.id)}
					<li class="now-item">
						<p class="now-label">{item.label}</p>
						<p class="now-copy">{item.value}</p>
					</li>
				{/each}
			</ul>
		</section>

		<section aria-labelledby="experience-title" class="section-shell scroll-mt-24" id="experience">
			<div class="section-rail space-y-4 lg:pt-3">
				<h2 class="section-heading" id="experience-title">Background</h2>
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

		<section aria-labelledby="contact-title" class="section-shell scroll-mt-24" id="contact">
			<div class="section-rail space-y-4 lg:pt-3">
				<h2 class="section-heading" id="contact-title">Reach me</h2>
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
		font-size: clamp(3rem, 11vw, 6.75rem);
		font-weight: 600;
		letter-spacing: -0.08em;
		line-height: 0.9;
		max-width: 10.5ch;
	}

	.hero-thesis {
		color: var(--color-ink);
		font-size: clamp(1.45rem, 5vw, 3rem);
		font-weight: 500;
		letter-spacing: -0.055em;
		line-height: 1.04;
		max-width: 16ch;
	}

	.hero-support {
		color: color-mix(in srgb, var(--color-ink) 70%, white 30%);
		font-size: clamp(1rem, 1.25vw, 1.12rem);
		line-height: 1.8;
		max-width: 37rem;
	}

	.hero-nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem 1.1rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.hero-nav li {
		align-items: center;
		color: var(--color-muted);
		display: inline-flex;
		gap: 1rem;
	}

	.hero-nav a {
		color: inherit;
		font-size: 0.96rem;
		font-weight: 500;
		letter-spacing: -0.01em;
		text-decoration: none;
		transition: color 180ms ease;
	}

	.hero-nav a:hover {
		color: var(--color-ink);
	}

	.hero-nav a:focus-visible {
		outline: 2px solid var(--outline-focus);
		outline-offset: 4px;
	}

	.hero-actions {
		display: grid;
		gap: 0.8rem;
		max-width: 24rem;
	}

	.hero-actions .ds-button {
		gap: 0.7rem;
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
		border-radius: 9999px;
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
		border-radius: 9999px;
		box-shadow: var(--shadow-floating);
		padding: 0.45rem;
		position: relative;
	}

	.portrait-frame :global(picture) {
		display: block;
	}

	.portrait-image {
		aspect-ratio: 1;
		border-radius: 9999px;
		display: block;
		object-fit: cover;
		object-position: center 20%;
		position: relative;
		width: 100%;
	}

	.section-shell {
		display: grid;
		gap: 1.35rem;
	}

	.section-rail {
		max-width: 15rem;
	}

	.section-heading {
		color: var(--color-ink);
		font-size: clamp(1.7rem, 3vw, 2.35rem);
		font-weight: 600;
		letter-spacing: -0.06em;
		line-height: 0.94;
	}

	.section-copy,
	.section-meta {
		color: var(--color-muted);
		font-size: 1rem;
		line-height: 1.68;
		max-width: 18rem;
	}

	.meta-pill {
		align-items: center;
		background: color-mix(in srgb, var(--surface-container-high) 86%, white 14%);
		border-radius: 9999px;
		color: var(--color-ink);
		display: inline-flex;
		font-size: 0.83rem;
		font-weight: 500;
		gap: 0.45rem;
		line-height: 1;
		padding: 0.6rem 0.9rem;
	}

	.meta-pill--quiet {
		background: color-mix(in srgb, var(--surface-container-low) 76%, white 24%);
		color: color-mix(in srgb, var(--color-ink) 64%, white 36%);
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
		font-size: 0.93rem;
	}

	.project-status {
		align-items: center;
		background: color-mix(in srgb, var(--surface-container-high) 84%, white 16%);
		border-radius: 9999px;
		color: var(--color-ink);
		display: inline-flex;
		font-size: 0.82rem;
		font-weight: 600;
		line-height: 1;
		padding: 0.5rem 0.8rem;
	}

	.writing-link {
		display: block;
		text-decoration: none;
	}

	.writing-link:focus-visible {
		outline: 2px solid var(--outline-focus);
		outline-offset: 6px;
		border-radius: 1rem;
	}

	.writing-link__header {
		align-items: start;
		display: flex;
		gap: 0.9rem;
		justify-content: space-between;
	}

	.writing-link__arrow {
		color: var(--color-accent);
		flex: 0 0 auto;
		transition: transform 180ms ease;
	}

	.writing-link:hover .writing-title {
		color: var(--color-primary);
	}

	.writing-link:hover .writing-link__arrow {
		transform: translate(0.14rem, -0.14rem);
	}

	.writing-title {
		color: var(--color-ink);
		font-size: clamp(1.45rem, 3vw, 2.25rem);
		font-weight: 600;
		letter-spacing: -0.045em;
		line-height: 0.98;
	}

	.writing-controls {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		justify-content: space-between;
	}

	.writing-count {
		color: var(--color-muted);
		font-size: 0.95rem;
		line-height: 1.6;
	}

	:global(.writing-toggle) {
		min-width: 12rem;
	}

	.now-list {
		display: grid;
		gap: 1.5rem;
		list-style: none;
		margin: 0;
		max-width: 52rem;
		padding: 0;
	}

	.now-item {
		display: grid;
		gap: 0.45rem;
	}

	.now-label {
		color: var(--color-muted);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.now-copy {
		color: var(--color-ink);
		font-size: clamp(1rem, 1.7vw, 1.32rem);
		letter-spacing: -0.025em;
		line-height: 1.5;
		max-width: 42rem;
	}

	.background-panel {
		background: linear-gradient(
			145deg,
			var(--surface-container-low) 0%,
			color-mix(in srgb, var(--surface-container-low) 78%, white 22%) 100%
		);
		border-radius: 1.75rem;
		box-shadow: var(--shadow-floating);
		padding: clamp(1.5rem, 4vw, 2.75rem);
	}

	.background-copy {
		color: color-mix(in srgb, var(--color-ink) 82%, white 18%);
		font-size: clamp(1.12rem, 2.1vw, 1.55rem);
		letter-spacing: -0.03em;
		line-height: 1.55;
		max-width: 54rem;
	}

	.contact-links {
		display: grid;
		gap: 1rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.contact-link {
		align-items: center;
		background: color-mix(in srgb, var(--surface-container-lowest) 84%, white 16%);
		border-radius: 1.25rem;
		display: grid;
		gap: 0.95rem;
		grid-template-columns: auto minmax(0, 1fr) auto;
		min-height: 4.5rem;
		padding: 0.95rem 1rem;
		text-decoration: none;
		transition:
			background-color 180ms ease,
			transform 180ms ease;
	}

	.contact-link:hover {
		background: color-mix(in srgb, var(--surface-container-low) 86%, white 14%);
		transform: translateY(-0.08rem);
	}

	.contact-link:focus-visible {
		outline: 2px solid var(--outline-focus);
		outline-offset: 6px;
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
		gap: 0.18rem;
		min-width: 0;
	}

	.contact-link__label {
		color: var(--color-muted);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.contact-link__value {
		color: var(--color-ink);
		font-size: 1.06rem;
		font-weight: 500;
		line-height: 1.45;
		overflow-wrap: anywhere;
	}

	.contact-link__arrow {
		color: var(--color-accent);
		flex: 0 0 auto;
		transition: transform 180ms ease;
	}

	.contact-link:hover .contact-link__arrow {
		transform: translate(0.14rem, -0.14rem);
	}

	@media (min-width: 640px) {
		.hero-actions {
			align-items: center;
			display: flex;
			flex-wrap: wrap;
			gap: 0.85rem;
			max-width: none;
		}

		.hero-actions .ds-button {
			width: auto;
		}

		.portrait-frame {
			padding: 0.6rem;
		}
	}

	@media (min-width: 768px) {
		.contact-links {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1024px) {
		.section-shell {
			align-items: start;
			gap: 3.5rem;
			grid-template-columns: 14rem minmax(0, 1fr);
		}

		.now-item {
			align-items: start;
			column-gap: 1.5rem;
			grid-template-columns: 7.5rem minmax(0, 1fr);
		}

		.portrait-shell {
			width: 14.5rem;
		}

		.portrait-frame {
			padding: 0.85rem;
		}

		.contact-links {
			gap: 1.25rem;
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
	}
</style>
