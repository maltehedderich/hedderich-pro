<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { mount, unmount } from 'svelte';

	import ArrowLeft from '~icons/lucide/arrow-left';
	import ArrowRight from '~icons/lucide/arrow-right';
	import CalendarDays from '~icons/lucide/calendar-days';
	import Clock3 from '~icons/lucide/clock-3';
	import CopyIcon from '~icons/lucide/copy';
	import House from '~icons/lucide/house';

	import type { Attachment } from 'svelte/attachments';

	import profileImageAsset from '$lib/assets/malte-hedderich.png';
	import { createAbsoluteUrl, SITE_NAME, SITE_SOCIAL_HANDLE, SITE_URL } from '$lib/site';
	import type { PageProps } from './$types';

	const copyFeedbackDuration = 1800;
	const authorUrl = createAbsoluteUrl('/');
	const pageImage = new URL(profileImageAsset, SITE_URL).toString();
	const pageImageAlt = 'Portrait of Malte Hedderich';

	let { data }: PageProps = $props();
	let post = $derived(data.post);
	let newerPost = $derived(data.newerPost);
	let olderPost = $derived(data.olderPost);

	const copyCode: Attachment<HTMLDivElement> = (node) => {
		const copyTimeouts = new WeakMap<HTMLButtonElement, number>();
		const activeTimeouts = new Set<number>();
		const icons = Array.from(node.querySelectorAll<HTMLElement>('[data-copy-icon]')).map((target) =>
			mount(CopyIcon, {
				props: {
					class: 'size-4'
				},
				target
			})
		);

		async function handleCopyClick(event: MouseEvent): Promise<void> {
			const target = event.target instanceof Element ? event.target : null;
			const button = target?.closest<HTMLButtonElement>('[data-copy-code]');

			if (!button || !node.contains(button)) {
				return;
			}

			const code = button
				.closest<HTMLElement>('.blog-content__code-frame')
				?.querySelector('code')
				?.textContent?.trimEnd();

			if (!code) {
				setCopyButtonState(button, 'Failed', 'failed', copyTimeouts, activeTimeouts);
				return;
			}

			try {
				await copyTextToClipboard(code);
				setCopyButtonState(button, 'Copied', 'copied', copyTimeouts, activeTimeouts);
			} catch {
				setCopyButtonState(button, 'Failed', 'failed', copyTimeouts, activeTimeouts);
			}
		}

		node.addEventListener('click', handleCopyClick);

		return () => {
			node.removeEventListener('click', handleCopyClick);
			activeTimeouts.forEach((timeout) => window.clearTimeout(timeout));
			icons.forEach((icon) => {
				void unmount(icon);
			});
		};
	};

	async function copyTextToClipboard(text: string): Promise<void> {
		if (navigator.clipboard && window.isSecureContext) {
			await navigator.clipboard.writeText(text);
			return;
		}

		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.setAttribute('readonly', '');
		textarea.style.opacity = '0';
		textarea.style.position = 'fixed';
		textarea.style.inset = '0 auto auto 0';

		document.body.append(textarea);

		try {
			textarea.select();

			if (!document.execCommand('copy')) {
				throw new Error('Copy command failed.');
			}
		} finally {
			textarea.remove();
		}
	}

	function setCopyButtonState(
		button: HTMLButtonElement,
		label: 'Copied' | 'Failed',
		state: 'copied' | 'failed',
		timeouts: WeakMap<HTMLButtonElement, number>,
		activeTimeouts: Set<number>
	): void {
		const existingTimeout = timeouts.get(button);

		if (existingTimeout) {
			window.clearTimeout(existingTimeout);
			activeTimeouts.delete(existingTimeout);
		}

		button.dataset.copyState = state;
		button.setAttribute('aria-label', `${label} code`);
		button.title = `${label} code`;

		const resetTimeout = window.setTimeout(() => {
			delete button.dataset.copyState;
			button.setAttribute('aria-label', 'Copy code');
			button.title = 'Copy code';
			activeTimeouts.delete(resetTimeout);
		}, copyFeedbackDuration);

		timeouts.set(button, resetTimeout);
		activeTimeouts.add(resetTimeout);
	}
</script>

<svelte:head>
	<title>{post.frontmatter.titleTag}</title>
	<meta name="description" content={post.frontmatter.metaDescription} />
	<meta name="author" content={post.frontmatter.author} />
	<meta name="robots" content="index,follow,max-image-preview:large" />
	<link rel="canonical" href={post.canonicalHref} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="article" />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:title" content={post.title} />
	<meta property="og:description" content={post.frontmatter.metaDescription} />
	<meta property="og:url" content={post.canonicalHref} />
	<meta property="og:image" content={pageImage} />
	<meta property="og:image:secure_url" content={pageImage} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1250" />
	<meta property="og:image:height" content="1250" />
	<meta property="og:image:alt" content={pageImageAlt} />
	<meta property="article:published_time" content={post.publishedAt} />
	<meta property="article:author" content={authorUrl} />
	{#each post.categories as category (category)}
		<meta property="article:section" content={category} />
	{/each}
	{#each post.tags as tag (tag)}
		<meta property="article:tag" content={tag} />
	{/each}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={SITE_SOCIAL_HANDLE} />
	<meta name="twitter:creator" content={SITE_SOCIAL_HANDLE} />
	<meta name="twitter:url" content={post.canonicalHref} />
	<meta name="twitter:title" content={post.title} />
	<meta name="twitter:description" content={post.frontmatter.metaDescription} />
	<meta name="twitter:image" content={pageImage} />
	<meta name="twitter:image:alt" content={pageImageAlt} />
	<svelte:element this={'script'} type="application/ld+json">{post.structuredData}</svelte:element>
</svelte:head>

<main
	class="blog-post-page px-5 pt-8 pb-28 sm:px-8 sm:pt-10 lg:px-12 lg:pb-40"
	id="main-content"
	tabindex="-1"
>
	<article class="mx-auto max-w-304 space-y-14 sm:space-y-22 lg:space-y-28">
		<header class="blog-post-hero">
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a class="ds-inline-link" href="/blog/">
				<span aria-hidden="true" class="blog-post-hero__back-icon">
					<ArrowLeft class="size-4" />
				</span>
				Back to archive
			</a>

			<div class="blog-post-hero__body">
				<div class="flex flex-wrap items-center gap-3">
					<span class="ds-chip">{post.tag}</span>
					<span class="ds-chip" data-tone="quiet">
						<CalendarDays aria-hidden="true" class="size-3 shrink-0" />
						<time datetime={post.publishedAt}>{post.dateLabel}</time>
					</span>
					<span class="ds-chip" data-tone="quiet">
						<Clock3 aria-hidden="true" class="size-3 shrink-0" />
						{post.readTime}
					</span>
				</div>

				<div class="space-y-6">
					<h1 class="blog-post-title">{post.title}</h1>
					<p class="blog-post-deck">{post.summary}</p>
				</div>
			</div>
		</header>

		<div class="blog-post-layout">
			<div class="blog-content" {@attach copyCode}>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html post.contentHtml}
			</div>

			<nav aria-label="Article navigation" class="blog-post-nav">
				<a class="blog-post-nav__home" href={resolve('/' as Pathname)}>
					<House aria-hidden="true" class="size-4" />
					<span>Home</span>
				</a>

				<div class="blog-post-nav__grid">
					{#if newerPost}
						<a
							aria-label={`Read newer article: ${newerPost.title}`}
							class="blog-post-nav__link"
							href={resolve(newerPost.href as Pathname)}
						>
							<span class="blog-post-nav__label">
								<ArrowLeft aria-hidden="true" class="size-4" />
								Newer
							</span>
							<span class="blog-post-nav__title">{newerPost.title}</span>
						</a>
					{/if}

					{#if olderPost}
						<a
							aria-label={`Read older article: ${olderPost.title}`}
							class="blog-post-nav__link"
							href={resolve(olderPost.href as Pathname)}
						>
							<span class="blog-post-nav__label">
								Older
								<ArrowRight aria-hidden="true" class="size-4" />
							</span>
							<span class="blog-post-nav__title">{olderPost.title}</span>
						</a>
					{/if}
				</div>
			</nav>
		</div>
	</article>
</main>

<style>
	.blog-post-page {
		overflow-x: clip;
	}

	.blog-post-hero {
		display: grid;
		gap: var(--space-xl);
	}

	.blog-post-hero__back-icon {
		align-items: center;
		color: var(--color-accent);
		display: inline-flex;
		flex: 0 0 auto;
		justify-content: center;
	}

	.blog-post-hero__body {
		display: grid;
		gap: var(--space-md);
		max-width: 52rem;
	}

	.blog-post-title {
		color: var(--color-ink);
		font-size: var(--text-display);
		font-weight: 600;
		letter-spacing: -0.075em;
		line-height: 0.94;
		max-width: 16ch;
	}

	.blog-post-deck {
		color: color-mix(in srgb, var(--color-ink) 70%, white 30%);
		font-size: var(--text-lead);
		line-height: 1.75;
		max-width: var(--measure-prose);
	}

	.blog-post-layout {
		display: grid;
		gap: var(--space-2xl);
	}

	.blog-content {
		color: color-mix(in srgb, var(--color-ink) 82%, white 18%);
		font-size: var(--text-body);
		line-height: 1.85;
		max-width: 52rem;
		min-width: 0;
	}

	.blog-content :global(> * + *) {
		margin-top: var(--space-md);
	}

	.blog-content :global(p),
	.blog-content :global(ul),
	.blog-content :global(ol) {
		max-width: var(--measure-prose);
	}

	.blog-content :global(h2),
	.blog-content :global(h3),
	.blog-content :global(h4) {
		color: var(--color-ink);
		font-weight: 600;
		letter-spacing: -0.045em;
		line-height: 1.08;
		scroll-margin-top: 6rem;
	}

	.blog-content :global(h2) {
		font-size: var(--text-title);
		margin-top: var(--space-2xl);
		max-width: 18ch;
	}

	.blog-content :global(h3) {
		font-size: var(--text-title-sm);
		margin-top: var(--space-xl);
		max-width: 24ch;
	}

	.blog-content :global(h4) {
		/* Body size at 700 rather than a fourth display step: --text-lead would tie h4 to
		   h3's floor at narrow widths. A run-in weight change is the clearer rank here. */
		font-size: var(--text-body);
		font-weight: 700;
		letter-spacing: -0.02em;
		margin-top: var(--space-lg);
	}

	.blog-content :global(a) {
		color: var(--color-primary);
		font-weight: 600;
		text-decoration-color: color-mix(in srgb, var(--color-accent) 60%, transparent);
		text-decoration-thickness: 0.08em;
		text-underline-offset: 0.24em;
	}

	.blog-content :global(a:hover),
	.blog-content :global(a:active) {
		color: var(--color-primary-active);
	}

	.blog-content :global(a:focus-visible) {
		outline: var(--focus-ring-width) solid var(--outline-focus);
		outline-offset: var(--focus-ring-offset);
	}

	.blog-content :global(strong) {
		color: var(--color-ink);
		font-weight: 700;
	}

	.blog-content :global(ul),
	.blog-content :global(ol) {
		display: grid;
		gap: var(--space-2xs);
		margin: var(--space-md) 0;
		padding-left: var(--space-md);
	}

	.blog-content :global(ul) {
		list-style: disc outside;
	}

	.blog-content :global(ol) {
		list-style: decimal outside;
	}

	.blog-content :global(li) {
		padding-left: var(--space-3xs);
	}

	.blog-content :global(li > p) {
		margin: 0;
	}

	.blog-content :global(li::marker) {
		color: var(--color-primary);
		font-weight: 700;
	}

	.blog-content :global(blockquote) {
		background: var(--surface-container-low);
		border-radius: var(--radius-xl);
		color: var(--color-ink);
		font-size: var(--text-lead);
		font-weight: 500;
		letter-spacing: -0.025em;
		line-height: 1.65;
		margin: var(--space-xl) 0;
		padding: var(--space-md) var(--space-md) var(--space-md) var(--space-lg);
		position: relative;
	}

	.blog-content :global(blockquote::before) {
		background: var(--color-accent);
		border-radius: var(--radius-full);
		bottom: var(--space-md);
		content: '';
		left: 0;
		position: absolute;
		top: var(--space-md);
		width: 0.18rem;
	}

	.blog-content :global(.blog-content__figure) {
		background: color-mix(in srgb, var(--surface-container-low) 76%, white 24%);
		border-radius: var(--radius-xl);
		margin: var(--space-xl) 0;
		padding: var(--space-xs);
	}

	.blog-content :global(.blog-content__figure img) {
		border-radius: var(--radius-md);
		display: block;
		height: auto;
		width: 100%;
	}

	.blog-content :global(.blog-content__code-frame) {
		--blog-code-surface: var(--color-ink);
		--blog-code-scroll-thumb: color-mix(in srgb, var(--color-accent) 70%, #f5efe2 10%);
		--outline-focus: var(--color-accent);

		background: var(--blog-code-surface);
		border-radius: var(--radius-lg);
		color: #f5efe2;
		font-size: var(--text-meta);
		line-height: 1.75;
		margin: var(--space-lg) 0;
		max-width: 100%;
		overflow: hidden;
		position: relative;
	}

	.blog-content :global(.blog-content__code-header) {
		align-items: center;
		display: flex;
		gap: var(--space-sm);
		justify-content: space-between;
		min-height: 3.15rem;
		padding: var(--space-xs) var(--space-xs) 0 var(--space-sm);
	}

	.blog-content :global(.blog-content__code-reference),
	.blog-content :global(.blog-content__code-reference-placeholder) {
		min-width: 0;
	}

	.blog-content :global(.blog-content__code-reference) {
		color: color-mix(in srgb, var(--color-accent) 84%, white 16%);
		display: inline-block;
		font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
		font-size: var(--text-meta);
		font-weight: 700;
		letter-spacing: 0;
		line-height: 1.5rem;
		overflow: hidden;
		text-decoration: none;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.blog-content :global(.blog-content__code-reference:hover) {
		color: #fff1b8;
		text-decoration: underline;
		text-decoration-thickness: 0.08em;
		text-underline-offset: 0.25em;
	}

	.blog-content :global(.blog-content__code-reference:focus-visible) {
		outline: var(--focus-ring-width) solid var(--outline-focus);
		outline-offset: var(--focus-ring-offset);
	}

	.blog-content :global(.blog-content__copy-button) {
		align-items: center;
		background: color-mix(in srgb, var(--surface-container-lowest) 14%, transparent);
		border: 0;
		border-radius: var(--radius-full);
		color: color-mix(in srgb, #f5efe2 88%, var(--color-accent) 12%);
		cursor: pointer;
		display: inline-flex;
		height: 2.35rem;
		justify-content: center;
		margin-left: auto;
		padding: 0;
		flex: 0 0 auto;
		transition:
			background var(--motion-fast) var(--motion-ease),
			color var(--motion-fast) var(--motion-ease),
			transform var(--motion-fast) var(--motion-ease);
		width: 2.35rem;
		z-index: 1;
	}

	.blog-content :global(.blog-content__copy-icon) {
		display: inline-flex;
	}

	.blog-content :global(.blog-content__copy-button:hover) {
		background: color-mix(in srgb, var(--surface-container-lowest) 22%, transparent);
		color: #fffaf0;
	}

	.blog-content :global(.blog-content__copy-button:active) {
		background: color-mix(in srgb, var(--surface-container-lowest) 30%, transparent);
		color: #fffaf0;
		transform: translateY(1px);
	}

	.blog-content :global(.blog-content__copy-button:focus-visible) {
		outline: var(--focus-ring-width) solid var(--outline-focus);
		outline-offset: var(--focus-ring-offset);
	}

	.blog-content :global(.blog-content__copy-button[data-copy-state='copied']) {
		background: color-mix(in srgb, var(--color-accent) 32%, transparent);
		color: #fffaf0;
	}

	.blog-content :global(.blog-content__copy-button[data-copy-state='failed']) {
		background: color-mix(in srgb, #ff9f80 28%, transparent);
		color: #fffaf0;
	}

	.blog-content :global(.blog-content__code-scroll) {
		overflow-x: auto;
		overflow-y: hidden;
		padding: var(--space-2xs) var(--space-sm) 0;
		-webkit-overflow-scrolling: touch;
		scrollbar-color: var(--blog-code-scroll-thumb) var(--blog-code-surface);
		scrollbar-width: thin;
	}

	.blog-content :global(.blog-content__code) {
		background: transparent;
		color: inherit;
		margin: 0;
		padding: 0 0 var(--space-sm);
	}

	.blog-content :global(.blog-content__code code) {
		display: block;
		font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
		min-width: max-content;
		white-space: pre;
	}

	.blog-content :global(.blog-content__code-scroll::-webkit-scrollbar) {
		background: var(--blog-code-surface);
		height: 0.7rem;
	}

	.blog-content :global(.blog-content__code-scroll::-webkit-scrollbar-thumb) {
		background: var(--blog-code-scroll-thumb);
		border-radius: 0;
	}

	.blog-content :global(.blog-content__code-scroll::-webkit-scrollbar-track) {
		background: var(--blog-code-surface);
		margin-inline: var(--space-sm);
	}

	.blog-content :global(.hljs-keyword),
	.blog-content :global(.hljs-selector-tag),
	.blog-content :global(.hljs-built_in),
	.blog-content :global(.hljs-type) {
		color: #f3bd64;
	}

	.blog-content :global(.hljs-title),
	.blog-content :global(.hljs-title.class_),
	.blog-content :global(.hljs-title.function_) {
		color: #8fc8ff;
	}

	.blog-content :global(.hljs-string),
	.blog-content :global(.hljs-attr),
	.blog-content :global(.hljs-symbol),
	.blog-content :global(.hljs-template-variable) {
		color: #b8d986;
	}

	.blog-content :global(.hljs-number),
	.blog-content :global(.hljs-literal),
	.blog-content :global(.hljs-variable),
	.blog-content :global(.hljs-params) {
		color: #d7b7ff;
	}

	.blog-content :global(.hljs-comment),
	.blog-content :global(.hljs-quote) {
		color: #9aa2ad;
		font-style: italic;
	}

	.blog-content :global(:not(pre) > code) {
		background: color-mix(in srgb, var(--surface-container-high) 72%, white 28%);
		border-radius: var(--radius-xs);
		color: var(--color-ink);
		font-size: 0.92em;
		padding: var(--space-3xs) var(--space-2xs);
	}

	.blog-content :global(h2 code),
	.blog-content :global(h3 code),
	.blog-content :global(h4 code) {
		background: none;
		border-radius: 0;
		color: inherit;
		font-weight: inherit;
		letter-spacing: 0;
		padding: 0;
	}

	.blog-content :global(.blog-content__table-scroll) {
		margin: var(--space-xl) 0;
		overflow-x: auto;
	}

	.blog-content :global(table) {
		border-collapse: separate;
		border-spacing: 0 var(--space-3xs);
		min-width: 38rem;
		width: 100%;
	}

	.blog-content :global(th),
	.blog-content :global(td) {
		background: color-mix(
			in srgb,
			var(--surface-container-lowest) 84%,
			var(--surface-container-low) 16%
		);
		padding: var(--space-xs) var(--space-sm);
		text-align: left;
		vertical-align: top;
	}

	.blog-content :global(th) {
		color: var(--color-ink);
		font-size: var(--text-micro);
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.blog-content :global([data-align='center']) {
		text-align: center;
	}

	.blog-content :global([data-align='right']) {
		text-align: right;
	}

	.blog-content :global(.katex-display) {
		overflow-x: auto;
		overflow-y: hidden;
		padding: var(--space-3xs) 0;
	}

	.blog-post-nav {
		display: grid;
		gap: var(--space-sm);
		max-width: 52rem;
	}

	.blog-post-nav__home,
	.blog-post-nav__link {
		color: inherit;
		text-decoration: none;
	}

	.blog-post-nav__home {
		align-items: center;
		color: var(--color-primary);
		display: inline-flex;
		font-size: var(--text-meta);
		font-weight: 700;
		gap: var(--space-2xs);
		justify-self: start;
		line-height: 1.2;
		min-height: 1.5rem;
	}

	.blog-post-nav__home:active {
		color: var(--color-primary-active);
	}

	.blog-post-nav__grid {
		display: grid;
		gap: var(--space-sm);
	}

	.blog-post-nav__link {
		background: color-mix(
			in srgb,
			var(--surface-container-lowest) 78%,
			var(--surface-container-low) 22%
		);
		border-radius: var(--radius-lg);
		display: grid;
		gap: var(--space-xs);
		min-height: 8.5rem;
		padding: var(--space-sm);
		transition:
			background-color var(--motion-base) var(--motion-ease),
			color var(--motion-base) var(--motion-ease);
	}

	.blog-post-nav__link:hover {
		background: color-mix(
			in srgb,
			var(--surface-container-high) 52%,
			var(--surface-container-lowest) 48%
		);
	}

	.blog-post-nav__link:active {
		background: var(--surface-container-high);
	}

	.blog-post-nav__home:focus-visible,
	.blog-post-nav__link:focus-visible {
		outline: var(--focus-ring-width) solid var(--outline-focus);
		outline-offset: var(--focus-ring-offset);
	}

	.blog-post-nav__label {
		align-items: center;
		color: var(--color-primary);
		display: inline-flex;
		font-size: var(--text-micro);
		font-weight: 700;
		gap: var(--space-2xs);
		letter-spacing: 0.12em;
		line-height: 1.2;
		text-transform: uppercase;
	}

	.blog-post-nav__title {
		color: var(--color-ink);
		font-size: var(--text-body);
		font-weight: 600;
		letter-spacing: -0.045em;
		line-height: 1.18;
		max-width: 22ch;
	}

	@media (min-width: 640px) {
		.blog-content :global(.blog-content__code-scroll) {
			padding: var(--space-xs) var(--space-md) 0;
		}

		.blog-content :global(.blog-content__code-header) {
			padding: var(--space-xs) var(--space-xs) 0 var(--space-md);
		}

		.blog-content :global(.blog-content__code) {
			padding-bottom: var(--space-md);
		}

		.blog-post-nav__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1024px) {
		.blog-post-hero {
			grid-template-columns: minmax(9rem, 0.3fr) minmax(0, 1fr);
			padding-top: var(--space-sm);
		}

		.blog-post-hero .ds-inline-link {
			align-self: start;
			margin-top: var(--space-sm);
		}

		.blog-post-layout {
			grid-template-columns: minmax(9rem, 0.3fr) minmax(0, 1fr);
		}

		.blog-content {
			grid-column: 2;
		}

		.blog-post-nav {
			grid-column: 2;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.blog-post-nav__link,
		.blog-content :global(.blog-content__copy-button) {
			transition-duration: 0.01ms;
		}

		.blog-content :global(.blog-content__copy-button:active) {
			transform: none;
		}
	}
</style>
