import { describe, expect, it } from 'vitest';

import {
	getBlogPostByRouteSlug,
	getBlogPostEntries,
	getPublishedBlogPostItems,
	getPublishedWritingItems,
	renderBlogMarkdown
} from './blog';

describe('blog content registry', () => {
	it('publishes the migrated legacy posts newest first', () => {
		const posts = getPublishedBlogPostItems();

		expect(posts).toHaveLength(5);
		expect(posts.map((post) => post.id)).toEqual([
			'programmatic-prompt-optimization-building-a-spam-filter-with-dspy-and-miprov2',
			'do-you-know-what-agents-are',
			'running-state-enhancing-short-term-memory-in-ai-agents',
			'scikit-learn-pipelines',
			'tabular-q-learning'
		]);
		expect(posts[0]).toMatchObject({
			href: '/blog/programmatic-prompt-optimization-building-a-spam-filter-with-dspy-and-miprov2/',
			publishedAt: '2026-02-09',
			tag: 'DSPy'
		});
	});

	it('adds the Medium article to the combined writing list newest first', () => {
		const writingItems = getPublishedWritingItems();

		expect(writingItems).toHaveLength(6);
		expect(writingItems[0]).toMatchObject({
			href: 'https://generativeai.pub/how-i-build-ai-agents-from-masterclass-guides-not-prompt-templates-75069b891110',
			id: 'how-i-build-ai-agents-from-masterclass-guides-not-prompt-templates',
			isExternal: true,
			publishedAt: '2026-05-18',
			readTime: '9 min',
			sourceLabel: 'Medium',
			tag: 'AI Agents',
			title: 'How I Build AI Agents From Masterclass Guides, Not Prompt Templates'
		});
	});

	it('exports static route entries for every published post', () => {
		expect(getBlogPostEntries()).toEqual(
			getPublishedBlogPostItems().map((post) => ({ slug: post.id }))
		);
		expect(getBlogPostEntries()).not.toContainEqual({
			slug: 'how-i-build-ai-agents-from-masterclass-guides-not-prompt-templates'
		});
	});

	it('renders a migrated post with stable headings, assets, and external link attributes', () => {
		const post = getBlogPostByRouteSlug('do-you-know-what-agents-are');

		expect(post?.contentHtml).toContain('<h2 id="academic-definition">Academic Definition</h2>');
		expect(post?.contentHtml).toContain('target="_blank" rel="noreferrer noopener"');
		expect(post?.contentHtml).toContain('alt="Agentic Problem Decision Tree"');
		expect(post?.contentHtml).not.toContain('<!-- more -->');
	});

	it('strips unsafe raw HTML before rendering', () => {
		const html = renderBlogMarkdown('<script>alert("xss")</script>\n\n## Safe Heading');

		expect(html).toContain('<h2 id="safe-heading">Safe Heading</h2>');
		expect(html).not.toContain('<script>');
		expect(html).not.toContain('alert("xss")');
	});

	it('validates Markdown image paths and alt text', () => {
		expect(() =>
			renderBlogMarkdown('![Missing](/blog/images/intelligent_agents/missing.png)')
		).toThrow(/bundled asset/);
		expect(() =>
			renderBlogMarkdown('![](/blog/images/intelligent_agents/agentic_problem.png)')
		).toThrow(/alt text/);
	});

	it('renders inline and display math with KaTeX', () => {
		const html = renderBlogMarkdown('Inline $x^2$.\n\n$$\ny = mx + b\n$$');

		expect(html).toContain('katex');
		expect(html).toContain('katex-display');
	});

	it('renders syntax-highlighted fenced code blocks', () => {
		const html = renderBlogMarkdown('```python\ndef classify(text):\n    return text\n```');

		expect(html).toContain('<div class="blog-content__code-frame" data-language="python">');
		expect(html).toContain('data-copy-code');
		expect(html).toContain('data-copy-icon');
		expect(html).toContain('<span class="sr-only">Copy code</span>');
		expect(html).toContain('blog-content__code-reference-placeholder');
		expect(html).toContain('<pre class="blog-content__code">');
		expect(html).toContain('class="hljs language-python"');
		expect(html).toContain('hljs-keyword');
	});

	it('integrates standalone code file references into the following code block header', () => {
		const html = renderBlogMarkdown(
			'[agent/memory.py](https://github.com/maltehedderich/examples-agents/blob/main/agent/memory.py)\n\n```python\nclass KnowledgeBase:\n    pass\n```'
		);

		expect(html).toContain('class="blog-content__code-reference"');
		expect(html).toContain('>agent/memory.py</a>');
		expect(html).toContain('target="_blank" rel="noreferrer noopener"');
		expect(html).not.toContain('<p><a href="https://github.com');
	});
});
