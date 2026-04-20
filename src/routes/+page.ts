import { dev } from '$app/environment';
import type { PageLoad } from './$types';

type WritingPost = {
	href: string;
	id: string;
	publishedAt: string;
	readTime: string;
	summary: string;
	tag: string;
	title: string;
};

const BLOG_ORIGIN = 'https://blog.hedderich.pro';
const BLOG_SITEMAP_URL = `${BLOG_ORIGIN}/sitemap.xml`;
const BLOG_POST_PATH_PATTERN = /^\/\d{4}\/\d{2}\/\d{2}\/[^/]+\/$/;
const SUMMARY_MAX_LENGTH = 170;

const fallbackPosts: WritingPost[] = [
	{
		href: `${BLOG_ORIGIN}/2026/02/09/programmatic-prompt-optimization-building-a-spam-filter-with-dspy-and-miprov2/`,
		id: 'programmatic-prompt-optimization-building-a-spam-filter-with-dspy-and-miprov2',
		publishedAt: '2026-02-09',
		readTime: '10 min',
		summary:
			'Why prompt engineering by intuition stops working in production, and how DSPy plus MIPROv2 let you optimize prompts against explicit metrics.',
		tag: 'DSPy',
		title: 'Programmatic Prompt Optimization: Building a Spam Filter with DSPy and MIPROv2'
	},
	{
		href: `${BLOG_ORIGIN}/2025/08/22/do-you-know-what-agents-are/`,
		id: 'do-you-know-what-agents-are',
		publishedAt: '2025-08-22',
		readTime: '6 min',
		summary:
			'A practical definition of AI agents, what actually counts as agentic, and when simpler LLM systems are the better engineering choice.',
		tag: 'Agents',
		title: 'Do You Know What Agents Are?'
	},
	{
		href: `${BLOG_ORIGIN}/2024/06/30/running-state-enhancing-short-term-memory-in-ai-agents/`,
		id: 'running-state-enhancing-short-term-memory-in-ai-agents',
		publishedAt: '2024-06-30',
		readTime: '8 min',
		summary:
			'How agents carry context through complex tasks, and why memory design matters as much as the model choice.',
		tag: 'Agents',
		title: 'Running State: Enhancing Short-Term Memory in AI Agents'
	},
	{
		href: `${BLOG_ORIGIN}/2024/02/11/scikit-learn-pipelines/`,
		id: 'scikit-learn-pipelines',
		publishedAt: '2024-02-11',
		readTime: '12 min',
		summary:
			'How to bundle preprocessing and model training into reusable scikit-learn pipelines without letting feature engineering sprawl.',
		tag: 'Machine Learning',
		title: 'scikit-learn Pipelines'
	},
	{
		href: `${BLOG_ORIGIN}/2023/10/28/tabular-q-learning/`,
		id: 'tabular-q-learning',
		publishedAt: '2023-10-28',
		readTime: '9 min',
		summary:
			'A hands-on introduction to tabular Q-learning, the Bellman equation, and training an agent on Frozen Lake.',
		tag: 'Reinforcement Learning',
		title: 'Tabular Q-Learning'
	}
];

const decodeHtmlEntities = (value: string) =>
	value
		.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
		.replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&nbsp;/g, ' ');

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, ' ').trim();

const stripTags = (value: string) =>
	normalizeWhitespace(decodeHtmlEntities(value.replace(/<[^>]+>/g, ' ')));

const getPostId = (href: string) =>
	new URL(href).pathname.split('/').filter(Boolean).at(-1) ?? href;

const extractMatch = (content: string, pattern: RegExp) => pattern.exec(content)?.[1] ?? '';

const shortenText = (value: string, maxLength = SUMMARY_MAX_LENGTH) => {
	const text = normalizeWhitespace(value);

	if (text.length <= maxLength) {
		return text;
	}

	const sentenceBoundary = text.lastIndexOf('. ', maxLength);
	if (sentenceBoundary >= Math.floor(maxLength * 0.6)) {
		return text.slice(0, sentenceBoundary + 1).trim();
	}

	const wordBoundary = text.lastIndexOf(' ', maxLength);
	const cutoff = wordBoundary > 0 ? wordBoundary : maxLength;
	return `${text.slice(0, cutoff).trim()}...`;
};

const normalizeReadTime = (value: string) => normalizeWhitespace(value.replace(/\bread\b/i, ''));

const parseBlogPost = (href: string, html: string): WritingPost | null => {
	const title = stripTags(extractMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i));
	const publishedAt = extractMatch(html, /<time datetime="([^"]+)"/i).slice(0, 10);
	const readTime = normalizeReadTime(
		extractMatch(html, /<span class="md-ellipsis">\s*(\d+\s+min(?:\s+read)?)\s*<\/span>/i)
	);
	const tag = stripTags(
		extractMatch(html, /<span class="md-ellipsis">\s*in\s*<a [^>]*>([^<]+)<\/a>/i)
	);
	const excerptMatch =
		extractMatch(html, /<\/h1>\s*<p>([\s\S]*?)<\/p>\s*<!--\s*more\s*-->/i) ||
		extractMatch(html, /<\/h1>\s*<p>([\s\S]*?)<\/p>/i);
	const summary = shortenText(stripTags(excerptMatch));

	if (!title || !publishedAt || !readTime || !summary) {
		return null;
	}

	return {
		href,
		id: getPostId(href),
		publishedAt,
		readTime,
		summary,
		tag: tag || 'Essay',
		title
	};
};

const sortPosts = (posts: WritingPost[]) =>
	posts.slice().sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));

const mergeWithFallbackPosts = (posts: WritingPost[]) => {
	const postsByHref = new Map(fallbackPosts.map((post) => [post.href, post]));

	for (const post of posts) {
		postsByHref.set(post.href, post);
	}

	return sortPosts(Array.from(postsByHref.values()));
};

const extractPostUrls = (sitemapXml: string) =>
	Array.from(sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g), (match) => match[1]).filter((href) => {
		try {
			return BLOG_POST_PATH_PATTERN.test(new URL(href).pathname);
		} catch {
			return false;
		}
	});

const fetchPost = async (fetcher: typeof fetch, href: string) => {
	try {
		const response = await fetcher(href);

		if (!response.ok) {
			return null;
		}

		return parseBlogPost(href, await response.text());
	} catch {
		return null;
	}
};

const getBlogPosts = async (fetcher: typeof fetch) => {
	try {
		const sitemapResponse = await fetcher(BLOG_SITEMAP_URL);

		if (!sitemapResponse.ok) {
			throw new Error(`Blog sitemap request failed with ${sitemapResponse.status}`);
		}

		const sitemapXml = await sitemapResponse.text();
		const postUrls = extractPostUrls(sitemapXml);
		const livePosts = (await Promise.all(postUrls.map((href) => fetchPost(fetcher, href)))).filter(
			(post): post is WritingPost => Boolean(post)
		);

		if (livePosts.length === 0) {
			return sortPosts(fallbackPosts);
		}

		return mergeWithFallbackPosts(livePosts);
	} catch (error) {
		if (dev) {
			console.warn('Unable to refresh blog posts from blog.hedderich.pro during prerender.', error);
		}

		return sortPosts(fallbackPosts);
	}
};

export const load = (async ({ fetch }) => {
	const posts = await getBlogPosts(fetch);

	return {
		posts
	};
}) satisfies PageLoad;
