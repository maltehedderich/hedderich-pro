<script lang="ts">
	import { mount, unmount } from 'svelte';

	import ArrowLeft from '~icons/lucide/arrow-left';
	import CalendarDays from '~icons/lucide/calendar-days';
	import Clock3 from '~icons/lucide/clock-3';
	import CopyIcon from '~icons/lucide/copy';

	import type { Attachment } from 'svelte/attachments';

	import type { PageProps } from './$types';

	const siteUrl = 'https://hedderich.pro';
	const copyFeedbackDuration = 1800;

	let { data }: PageProps = $props();
	let post = $derived(data.post);
	let hasLongTitle = $derived(post.title.length > 60);

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
	<meta property="og:site_name" content="Malte Hedderich" />
	<meta property="og:title" content={post.title} />
	<meta property="og:description" content={post.frontmatter.metaDescription} />
	<meta property="og:url" content={post.canonicalHref} />
	<meta property="article:published_time" content={post.publishedAt} />
	<meta property="article:author" content={new URL('/', siteUrl).toString()} />
	{#each post.categories as category (category)}
		<meta property="article:section" content={category} />
	{/each}
	{#each post.tags as tag (tag)}
		<meta property="article:tag" content={tag} />
	{/each}
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@hedderichpro" />
	<meta name="twitter:creator" content="@hedderichpro" />
	<meta name="twitter:title" content={post.title} />
	<meta name="twitter:description" content={post.frontmatter.metaDescription} />
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

				<div class="space-y-6">
					<h1 class="blog-post-title" data-long-title={hasLongTitle}>{post.title}</h1>
					<p class="blog-post-deck">{post.summary}</p>
				</div>
			</div>
		</header>

		<div class="blog-post-layout">
			<div class="blog-content" {@attach copyCode}>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html post.contentHtml}
			</div>
		</div>
	</article>
</main>

<style>
	.blog-post-page {
		overflow-x: clip;
	}

	.blog-post-hero {
		display: grid;
		gap: 3rem;
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
		gap: 1.35rem;
		max-width: 52rem;
	}

	.blog-post-title {
		color: var(--color-ink);
		font-size: 3.25rem;
		font-weight: 600;
		letter-spacing: -0.075em;
		line-height: 0.94;
		max-width: 12ch;
	}

	.blog-post-title[data-long-title='true'] {
		font-size: 2.75rem;
		letter-spacing: -0.062em;
		line-height: 0.98;
		max-width: 100%;
	}

	.blog-post-deck {
		color: color-mix(in srgb, var(--color-ink) 70%, white 30%);
		font-size: 1.12rem;
		line-height: 1.75;
		max-width: 42rem;
	}

	.blog-post-layout {
		display: grid;
		gap: 3rem;
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

	.blog-content {
		color: color-mix(in srgb, var(--color-ink) 82%, white 18%);
		font-size: 1.06rem;
		line-height: 1.85;
		max-width: 52rem;
		min-width: 0;
	}

	.blog-content :global(> * + *) {
		margin-top: 1.35rem;
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
		font-size: 2.1rem;
		margin-top: 4.25rem;
		max-width: 18ch;
	}

	.blog-content :global(h3) {
		font-size: 1.55rem;
		margin-top: 3rem;
		max-width: 24ch;
	}

	.blog-content :global(h4) {
		font-size: 1.2rem;
		margin-top: 2.5rem;
	}

	.blog-content :global(a) {
		color: var(--color-primary);
		font-weight: 600;
		text-decoration-color: color-mix(in srgb, var(--color-accent) 60%, transparent);
		text-decoration-thickness: 0.08em;
		text-underline-offset: 0.24em;
	}

	.blog-content :global(a:hover) {
		color: var(--color-primary-active);
	}

	.blog-content :global(a:focus-visible) {
		outline: 2px solid var(--outline-focus);
		outline-offset: 4px;
	}

	.blog-content :global(strong) {
		color: var(--color-ink);
		font-weight: 700;
	}

	.blog-content :global(ul),
	.blog-content :global(ol) {
		display: grid;
		gap: 0.55rem;
		margin: 1.55rem 0;
		padding-left: 1.5rem;
	}

	.blog-content :global(ul) {
		list-style: disc outside;
	}

	.blog-content :global(ol) {
		list-style: decimal outside;
	}

	.blog-content :global(li) {
		padding-left: 0.35rem;
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
		border-radius: 1.5rem;
		color: var(--color-ink);
		font-size: 1.18rem;
		font-weight: 500;
		letter-spacing: -0.025em;
		line-height: 1.65;
		margin: 3rem 0;
		padding: 1.5rem 1.5rem 1.5rem 2rem;
		position: relative;
	}

	.blog-content :global(blockquote::before) {
		background: var(--color-accent);
		border-radius: 9999px;
		bottom: 1.35rem;
		content: '';
		left: 0;
		position: absolute;
		top: 1.35rem;
		width: 0.18rem;
	}

	.blog-content :global(.blog-content__figure) {
		background: color-mix(in srgb, var(--surface-container-low) 76%, white 24%);
		border-radius: 1.5rem;
		margin: 3rem 0;
		padding: 0.75rem;
	}

	.blog-content :global(.blog-content__figure img) {
		border-radius: 1rem;
		display: block;
		height: auto;
		width: 100%;
	}

	.blog-content :global(.blog-content__code-frame) {
		--blog-code-surface: color-mix(in srgb, var(--color-ink) 94%, black 6%);
		--blog-code-scroll-thumb: color-mix(in srgb, var(--color-accent) 70%, #f5efe2 10%);

		background: var(--blog-code-surface);
		border-radius: 1.25rem;
		color: #f5efe2;
		font-size: 0.9rem;
		line-height: 1.75;
		margin: 2rem 0;
		max-width: 100%;
		overflow: hidden;
		position: relative;
	}

	.blog-content :global(.blog-content__code-header) {
		align-items: center;
		display: flex;
		gap: 1rem;
		justify-content: space-between;
		min-height: 3.15rem;
		padding: 0.75rem 0.75rem 0 1.15rem;
	}

	.blog-content :global(.blog-content__code-reference),
	.blog-content :global(.blog-content__code-reference-placeholder) {
		min-width: 0;
	}

	.blog-content :global(.blog-content__code-reference) {
		color: color-mix(in srgb, var(--color-accent) 84%, white 16%);
		display: inline-block;
		font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 1.2;
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
		outline: 2px solid var(--outline-focus);
		outline-offset: 4px;
	}

	.blog-content :global(.blog-content__copy-button) {
		align-items: center;
		background: color-mix(in srgb, var(--surface-container-lowest) 14%, transparent);
		border: 0;
		border-radius: 9999px;
		color: color-mix(in srgb, #f5efe2 88%, var(--color-accent) 12%);
		cursor: pointer;
		display: inline-flex;
		height: 2.35rem;
		justify-content: center;
		margin-left: auto;
		padding: 0;
		flex: 0 0 auto;
		transition:
			background 160ms ease,
			color 160ms ease;
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

	.blog-content :global(.blog-content__copy-button:focus-visible) {
		outline: 2px solid var(--outline-focus);
		outline-offset: 3px;
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
		padding: 0.5rem 1.15rem 0;
		-webkit-overflow-scrolling: touch;
		scrollbar-color: var(--blog-code-scroll-thumb) var(--blog-code-surface);
		scrollbar-width: thin;
	}

	.blog-content :global(.blog-content__code) {
		background: transparent;
		color: inherit;
		margin: 0;
		padding: 0 0 1.15rem;
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
		margin-inline: 1rem;
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
		border-radius: 0.45rem;
		color: var(--color-ink);
		font-size: 0.92em;
		padding: 0.12rem 0.35rem;
	}

	.blog-content :global(.blog-content__table-scroll) {
		margin: 2.5rem 0;
		overflow-x: auto;
	}

	.blog-content :global(table) {
		border-collapse: separate;
		border-spacing: 0 0.35rem;
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
		padding: 0.72rem 0.85rem;
		text-align: left;
		vertical-align: top;
	}

	.blog-content :global(th) {
		color: var(--color-ink);
		font-size: 0.74rem;
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
		padding: 0.35rem 0;
	}

	@media (min-width: 640px) {
		.blog-post-title {
			font-size: 4.75rem;
		}

		.blog-post-title[data-long-title='true'] {
			font-size: 4rem;
			max-width: 14ch;
		}

		.blog-post-deck {
			font-size: 1.24rem;
		}

		.blog-content :global(.blog-content__code-scroll) {
			padding: 0.6rem 1.5rem 0;
		}

		.blog-content :global(.blog-content__code-header) {
			padding: 0.8rem 0.8rem 0 1.5rem;
		}

		.blog-content :global(.blog-content__code) {
			padding-bottom: 1.35rem;
		}
	}

	@media (min-width: 1024px) {
		.blog-post-hero {
			grid-template-columns: minmax(9rem, 0.3fr) minmax(0, 1fr);
			padding-top: 1rem;
		}

		.blog-post-hero .ds-inline-link {
			align-self: start;
			margin-top: 0.9rem;
		}

		.blog-post-title {
			font-size: 5.6rem;
		}

		.blog-post-title[data-long-title='true'] {
			font-size: 4.75rem;
			max-width: 16ch;
		}

		.blog-post-layout {
			grid-template-columns: minmax(9rem, 0.3fr) minmax(0, 1fr);
		}

		.blog-content {
			grid-column: 2;
		}
	}
</style>
