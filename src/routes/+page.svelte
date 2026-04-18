<script lang="ts">
	import ArrowRight from '~icons/lucide/arrow-right';
	import ArrowUpRight from '~icons/lucide/arrow-up-right';
	import Mail from '~icons/lucide/mail';
	import Github from '~icons/bxl/github';
	import Linkedin from '~icons/bxl/linkedin';
	import TwitterX from '~icons/bxl/twitter-x';
	import Clock3 from '~icons/lucide/clock-3';

	import { Card, EditorialList } from '$lib';

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

	type WritingPost = {
		href: string;
		id: string;
		readTime: string;
		summary: string;
		tag: string;
		title: string;
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

	const navigation: NavItem[] = [
		{ id: 'projects', href: '#projects', label: 'Projects' },
		{ id: 'writing', href: '#writing', label: 'Writing' },
		{ id: 'now', href: '#now', label: 'Now' },
		{ id: 'background', href: '#background', label: 'Background' }
	];

	const projects: Project[] = [
		{
			description:
				'Pressure-tests SaaS ideas before you commit months to building them. Free trial. Signup and card on file.',
			id: 'genhone',
			proof: 'First commit January 11, 2026 · Launched April 21, 2026',
			status: 'Active',
			title: 'Genhone',
			url: 'https://genhone.com'
		},
		{
			description:
				'Matches your profile against a job ad and writes a cover letter that fits the role. Not a template with your name dropped in.',
			id: 'genwriter',
			proof: 'First commit November 16, 2023 · Launched August 14, 2024',
			status: 'Active',
			title: 'Genwriter',
			url: 'https://genwriter.com'
		}
	];

	const posts: WritingPost[] = [
		{
			href: 'https://blog.hedderich.pro/2026/02/09/programmatic-prompt-optimization-building-a-spam-filter-with-dspy-and-miprov2/',
			id: 'prompt-optimization',
			readTime: '10 min',
			summary: 'Treat prompts like model weights. Optimize them with data instead of intuition.',
			tag: 'Technical deep-dive',
			title: 'Programmatic Prompt Optimization: Building a Spam Filter with DSPy and MIPROv2'
		},
		{
			href: 'https://blog.hedderich.pro/2025/08/22/do-you-know-what-agents-are/',
			id: 'agents',
			readTime: '6 min',
			summary:
				'What actually counts as an agent, and why confusing one with a plain LLM call breaks things in production.',
			tag: 'Concepts',
			title: 'Do You Know What Agents Are?'
		},
		{
			href: 'https://blog.hedderich.pro/2024/06/30/running-state-enhancing-short-term-memory-in-ai-agents/',
			id: 'memory',
			readTime: '8 min',
			summary:
				'How agents carry context through complex tasks, and why memory design matters as much as the model choice.',
			tag: 'Systems',
			title: 'Running State: Enhancing Short-Term Memory in AI Agents'
		}
	];

	const nowItems: CurrentFocus[] = [
		{
			id: 'building',
			label: 'Building',
			value:
				'UX work on Genhone. Tightening the pressure-testing flow so you can act on the result faster.'
		},
		{
			id: 'investigating',
			label: 'Investigating',
			value:
				'Custom agent setups in coding CLIs like Claude Code and Codex. Whether structured workflows actually hold up in practice.'
		}
	];

	const channels: Channel[] = [
		{
			href: 'mailto:malte@hedderich.pro',
			icon: Mail,
			id: 'email',
			label: 'Email',
			value: 'malte@hedderich.pro'
		},
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
</script>

<svelte:head>
	<title>Malte Hedderich</title>
	<meta
		name="description"
		content="I build SaaS products on top of LLMs and write about what makes them work in production."
	/>
</svelte:head>

<main class="brand-page px-5 pt-8 pb-28 sm:px-8 sm:pt-10 lg:px-12 lg:pb-40">
	<div class="mx-auto max-w-304 space-y-24 sm:space-y-28 lg:space-y-36">
		<section
			aria-labelledby="hero-name"
			class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center lg:gap-12 xl:grid-cols-[minmax(0,1fr)_19rem] xl:gap-14"
		>
			<figure class="portrait-shell order-first self-start lg:order-last lg:justify-self-end">
				<div aria-hidden="true" class="portrait-halo"></div>
				<div class="portrait-frame">
					<img
						alt="Portrait of Malte Hedderich"
						class="portrait-image"
						decoding="async"
						fetchpriority="high"
						height="1250"
						loading="eager"
						src="/images/malte-hedderich.png"
						width="1250"
					/>
				</div>
			</figure>

			<div class="space-y-8 lg:max-w-176 xl:max-w-184">
				<div class="space-y-5">
					<h1 class="hero-name" id="hero-name">Malte Hedderich</h1>
					<p class="hero-thesis">
						I build SaaS products on top of LLMs and write about what makes them work in production.
					</p>
					<p class="hero-support">
						Genhone is the current project. It pressure-tests SaaS ideas before you commit months to
						building them. By day I build production AI systems and write about what tutorials skip:
						agent design, LLM evaluation, the calls you only learn by making them.
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
				<p class="section-copy">Two products built after hours. Both live.</p>
			</div>

			<div class="grid gap-6 xl:grid-cols-2">
				{#each projects as project (project.id)}
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
				{/each}
			</div>
		</section>

		<section aria-labelledby="writing-title" class="section-shell scroll-mt-24" id="writing">
			<div class="section-rail space-y-4 lg:pt-3">
				<h2 class="section-heading" id="writing-title">Writing</h2>
				<p class="section-copy">How I think about building AI systems, in public.</p>
			</div>

			<EditorialList items={posts}>
				{#snippet row(post)}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a class="writing-link" href={post.href}>
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
		</section>

		<section aria-labelledby="now-title" class="section-shell scroll-mt-24" id="now">
			<div class="section-rail space-y-4 lg:pt-3">
				<h2 class="section-heading" id="now-title">Now</h2>
				<p class="section-meta">Updated April 2026</p>
			</div>

			<div class="now-list">
				{#each nowItems as item (item.id)}
					<article class="now-item">
						<p class="now-label">{item.label}</p>
						<p class="now-copy">{item.value}</p>
					</article>
				{/each}
			</div>
		</section>

		<section aria-labelledby="background-title" class="section-shell scroll-mt-24" id="background">
			<div class="section-rail space-y-4 lg:pt-3">
				<h2 class="section-heading" id="background-title">Background</h2>
				<p class="section-copy">The engineering context behind the products and writing.</p>
			</div>

			<article class="background-panel">
				<p class="background-copy">
					ML Engineering Associate Manager at Accenture, leading teams of 6–12 building production
					LLM applications. Before that, I spent two years at Serviceware shipping intent
					recognition, search services, and an early production LLM app in 2023. I studied Business
					Informatics at TU Darmstadt, wrote my thesis on Open-Source MLOps, and spent a year
					studying Software Engineering at Tongji University in Shanghai.
				</p>
			</article>
		</section>

		<section aria-labelledby="contact-title" class="section-shell scroll-mt-24" id="contact">
			<div class="section-rail space-y-4 lg:pt-3">
				<h2 class="section-heading" id="contact-title">Reach me</h2>
				<p class="section-copy">Email first. The rest is here if a different channel is easier.</p>
			</div>

			<address class="not-italic">
				<div class="contact-links">
					{#each channels as channel (channel.id)}
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
						<a
							aria-label={`${channel.label}: ${channel.value}`}
							class="contact-link"
							data-channel={channel.id}
							href={channel.href}
							rel="external"
						>
							<span aria-hidden="true" class="contact-link__icon">
								<channel.icon class="contact-link__glyph" />
							</span>

							<span class="contact-link__body">
								<span class="contact-link__value">{channel.value}</span>
							</span>

							<span aria-hidden="true" class="contact-link__arrow">
								<ArrowUpRight class="size-4" />
							</span>
						</a>
					{/each}
				</div>
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

	.now-list {
		display: grid;
		gap: 1.5rem;
		max-width: 52rem;
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
		align-items: center;
		min-width: 0;
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
