import { Marked, Renderer, type Token, type Tokens } from 'marked';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import python from 'highlight.js/lib/languages/python';
import { renderToString as renderKatexToString } from 'katex';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

const SITE_URL = 'https://hedderich.pro';
const BLOG_PATH_PREFIX = '/blog/';
const BLOG_IMAGE_PATH_PREFIX = '/blog/images/';
const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SUPPORTED_IMAGE_EXTENSION_PATTERN = /\.(?:avif|gif|heif|jpe?g|png|tiff|webp)$/i;
const MARKDOWN_IMAGE_LEGACY_PREFIX = '../images/';
const CODE_LANGUAGE_ALIASES = new Map([
	['md', 'markdown'],
	['py', 'python']
]);

hljs.registerLanguage('json', json);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('python', python);

const frontmatterSchema = z.object({
	author: z.string().min(1),
	categories: z.array(z.string().min(1)).min(1),
	date: z.string().regex(ISO_DATE_PATTERN),
	draft: z.boolean().default(false),
	excerpt: z.string().min(1),
	legacyUrl: z.string().url(),
	metaDescription: z.string().min(1),
	readTime: z.string().regex(/^\d+\s+min$/),
	slug: z.string().regex(SLUG_PATTERN),
	tags: z.array(z.string().min(1)).default([]),
	title: z.string().min(1),
	titleTag: z.string().min(1)
});

export type BlogPostFrontmatter = z.infer<typeof frontmatterSchema>;

export interface BlogPostItem {
	categories: string[];
	dateLabel: string;
	href: string;
	id: string;
	publishedAt: string;
	readTime: string;
	summary: string;
	tag: string;
	tags: string[];
	title: string;
}

export interface BlogPost extends BlogPostItem {
	canonicalHref: string;
	contentHtml: string;
	frontmatter: BlogPostFrontmatter;
	legacyUrl: string;
	pathname: string;
	routeSlug: string;
	sourcePath: string;
	structuredData: string;
}

interface MarkdownModuleMap {
	[sourcePath: string]: string;
}

interface AssetModuleMap {
	[assetPath: string]: string;
}

interface CodeReference {
	href: string;
	label: string;
	title: string | null;
}

interface CodeTokenWithReference extends Tokens.Code {
	codeReference?: CodeReference;
}

const blogModules: MarkdownModuleMap = import.meta.glob<string>(
	'/src/lib/content/blog/published/*.md',
	{
		eager: true,
		import: 'default',
		query: '?raw'
	}
);

const imageModules: AssetModuleMap = import.meta.glob<string>(
	'/src/lib/content/blog/assets/**/*.{avif,AVIF,gif,GIF,heif,HEIF,jpeg,JPEG,jpg,JPG,png,PNG,tiff,TIFF,webp,WEBP}',
	{
		eager: true,
		import: 'default',
		query: '?url'
	}
);

const imageUrlByPublicPath: Map<string, string> = new Map(
	Object.entries(imageModules).map(([assetPath, imageUrl]) => {
		const relativePath = assetPath.split('/src/lib/content/blog/assets/').at(1);

		if (!relativePath) {
			throw new Error(
				`Blog image asset path is outside the expected content asset directory: ${assetPath}`
			);
		}

		return [`${BLOG_IMAGE_PATH_PREFIX}${relativePath}`, imageUrl] as const;
	})
);

const blogPosts = Object.entries(blogModules)
	.map(([sourcePath, source]) => parseBlogPost(source, sourcePath))
	.sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));

export function getPublishedBlogPosts(): BlogPost[] {
	return blogPosts.filter((post) => !post.frontmatter.draft);
}

export function getPublishedBlogPostItems(): BlogPostItem[] {
	return getPublishedBlogPosts().map(toBlogPostItem);
}

export function getBlogPostByRouteSlug(slug: string): BlogPost | undefined {
	return getPublishedBlogPosts().find((post) => post.routeSlug === slug);
}

export function getBlogPostEntries(): Array<{ slug: string }> {
	return getPublishedBlogPosts().map((post) => ({ slug: post.routeSlug }));
}

export function renderBlogMarkdown(markdown: string): string {
	const renderState = {
		headingCounts: new Map<string, number>()
	};
	const mathPlaceholders: string[] = [];
	const markdownWithMathPlaceholders = replaceMathWithPlaceholders(markdown, mathPlaceholders);
	const marked = new Marked({ breaks: false, gfm: true });
	const renderer = new Renderer();

	renderer.html = function html(): string {
		return '';
	};

	renderer.hr = function hr(): string {
		return '';
	};

	renderer.heading = function heading(this: Renderer, { depth, tokens }: Tokens.Heading): string {
		const headingText = extractTokenText(tokens);
		const headingId = getUniqueHeadingId(slugifyHeading(headingText), renderState.headingCounts);
		const innerHtml = this.parser.parseInline(tokens);

		return `<h${depth} id="${escapeAttribute(headingId)}">${innerHtml}</h${depth}>`;
	};

	renderer.paragraph = function paragraph(this: Renderer, { tokens }: Tokens.Paragraph): string {
		const isStandaloneImage = tokens.length === 1 && tokens[0]?.type === 'image';
		const innerHtml = this.parser.parseInline(tokens);

		return isStandaloneImage ? innerHtml : `<p>${innerHtml}</p>`;
	};

	renderer.link = function link(this: Renderer, { href, title, tokens }: Tokens.Link): string {
		const normalizedHref = normalizeLinkHref(href);
		const isExternal = isExternalHref(normalizedHref);
		const titleAttribute = title ? ` title="${escapeAttribute(title)}"` : '';
		const externalAttributes = isExternal ? ' target="_blank" rel="noreferrer noopener"' : '';
		const innerHtml = this.parser.parseInline(tokens);

		return `<a href="${escapeAttribute(normalizedHref)}"${titleAttribute}${externalAttributes}>${innerHtml}</a>`;
	};

	renderer.image = function image({ href, text, title }: Tokens.Image): string {
		const imageAlt = text.trim();

		if (!imageAlt) {
			throw new Error(`Blog image ${href} must include non-empty alt text.`);
		}

		const imageUrl = resolveBlogImageUrl(href);
		const titleAttribute = title ? ` title="${escapeAttribute(title)}"` : '';

		return `<figure class="blog-content__figure"><img src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(imageAlt)}"${titleAttribute} loading="lazy" decoding="async" /></figure>`;
	};

	renderer.code = function code(token: Tokens.Code): string {
		const { lang, text } = token;
		const codeReference = (token as CodeTokenWithReference).codeReference;
		const normalizedLanguage = normalizeCodeLanguage(lang);
		const highlightedCode = highlightCode(text, normalizedLanguage);
		const languageAttribute = normalizedLanguage
			? ` data-language="${escapeAttribute(normalizedLanguage)}"`
			: '';
		const codeClassNames = ['hljs'];

		if (normalizedLanguage) {
			codeClassNames.push(`language-${normalizedLanguage}`);
		}

		return `<div class="blog-content__code-frame"${languageAttribute}><div class="blog-content__code-header">${renderCodeReference(codeReference)}<button type="button" class="blog-content__copy-button" data-copy-code aria-label="Copy code" title="Copy code"><span class="blog-content__copy-icon" data-copy-icon aria-hidden="true"></span><span class="sr-only">Copy code</span></button></div><div class="blog-content__code-scroll"><pre class="blog-content__code"><code class="${escapeAttribute(codeClassNames.join(' '))}">${highlightedCode}</code></pre></div></div>`;
	};

	renderer.table = function table(this: Renderer, token: Tokens.Table): string {
		const headerCells = token.header.map((cell) => renderTableCell.call(this, cell)).join('');
		const bodyRows = token.rows
			.map((row) => `<tr>${row.map((cell) => renderTableCell.call(this, cell)).join('')}</tr>`)
			.join('');

		return `<div class="blog-content__table-scroll"><table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table></div>`;
	};

	marked.use({ renderer });

	const renderedHtml = marked.parser(
		attachCodeReferencesToFollowingCodeBlocks(marked.lexer(markdownWithMathPlaceholders))
	);
	return mathPlaceholders.reduce(
		(html, mathHtml, index) => html.replaceAll(createMathPlaceholder(index), mathHtml),
		renderedHtml
	);
}

function parseBlogPost(source: string, sourcePath: string): BlogPost {
	const frontmatterMatch = source.match(FRONTMATTER_PATTERN);

	if (!frontmatterMatch) {
		throw new Error(`Blog post ${sourcePath} must start with YAML frontmatter.`);
	}

	const parsedYaml: unknown = parseYaml(frontmatterMatch[1]);
	const parsedFrontmatter = frontmatterSchema.safeParse(parsedYaml);

	if (!parsedFrontmatter.success) {
		throw new Error(
			`Invalid blog frontmatter in ${sourcePath}: ${parsedFrontmatter.error.message}`
		);
	}

	const frontmatter = parsedFrontmatter.data;

	if (!sourcePath.endsWith(`/${frontmatter.slug}.md`)) {
		throw new Error(
			`Blog post ${sourcePath} must use a filename that matches slug "${frontmatter.slug}".`
		);
	}

	const pathname = `${BLOG_PATH_PREFIX}${frontmatter.slug}/`;
	const canonicalHref = createCanonicalUrl(pathname);
	const contentHtml = renderBlogMarkdown(source.slice(frontmatterMatch[0].length).trim());
	const dateLabel = formatPostDate(frontmatter.date);
	const structuredData = createBlogPostStructuredData(frontmatter, canonicalHref);

	return {
		canonicalHref,
		categories: frontmatter.categories,
		contentHtml,
		dateLabel,
		frontmatter,
		href: pathname,
		id: frontmatter.slug,
		legacyUrl: frontmatter.legacyUrl,
		pathname,
		publishedAt: frontmatter.date,
		readTime: frontmatter.readTime,
		routeSlug: frontmatter.slug,
		sourcePath,
		structuredData,
		summary: frontmatter.excerpt,
		tag: frontmatter.categories[0],
		tags: frontmatter.tags,
		title: frontmatter.title
	};
}

function toBlogPostItem(post: BlogPost): BlogPostItem {
	return {
		categories: post.categories,
		dateLabel: post.dateLabel,
		href: post.href,
		id: post.id,
		publishedAt: post.publishedAt,
		readTime: post.readTime,
		summary: post.summary,
		tag: post.tag,
		tags: post.tags,
		title: post.title
	};
}

function createCanonicalUrl(pathname: string): string {
	return new URL(pathname, SITE_URL).toString();
}

function createBlogPostStructuredData(
	frontmatter: BlogPostFrontmatter,
	canonicalHref: string
): string {
	return JSON.stringify({
		'@context': 'https://schema.org',
		'@id': `${canonicalHref}#article`,
		'@type': 'BlogPosting',
		author: {
			'@type': 'Person',
			name: frontmatter.author,
			url: SITE_URL
		},
		dateModified: frontmatter.date,
		datePublished: frontmatter.date,
		description: frontmatter.metaDescription,
		headline: frontmatter.title,
		isPartOf: {
			'@type': 'Blog',
			name: 'Malte Hedderich',
			url: createCanonicalUrl(BLOG_PATH_PREFIX)
		},
		keywords: [...frontmatter.categories, ...frontmatter.tags],
		mainEntityOfPage: canonicalHref,
		publisher: {
			'@type': 'Person',
			name: frontmatter.author,
			url: SITE_URL
		}
	});
}

function formatPostDate(date: string): string {
	return new Intl.DateTimeFormat('en', {
		day: 'numeric',
		month: 'long',
		timeZone: 'UTC',
		year: 'numeric'
	}).format(new Date(`${date}T00:00:00.000Z`));
}

function replaceMathWithPlaceholders(markdown: string, mathPlaceholders: string[]): string {
	return markdown
		.replace(/\$\$([\s\S]+?)\$\$/g, (_, expression: string) =>
			storeMathPlaceholder(expression, true, mathPlaceholders)
		)
		.replace(/(^|[^\\$])\$([^\n$]+?)\$/g, (_, prefix: string, expression: string) => {
			return `${prefix}${storeMathPlaceholder(expression, false, mathPlaceholders)}`;
		});
}

function storeMathPlaceholder(
	expression: string,
	displayMode: boolean,
	mathPlaceholders: string[]
): string {
	const placeholder = createMathPlaceholder(mathPlaceholders.length);
	const renderedMath = renderKatexToString(expression.trim(), {
		displayMode,
		throwOnError: false
	});

	mathPlaceholders.push(renderedMath);
	return placeholder;
}

function createMathPlaceholder(index: number): string {
	return `BLOG_MATH_PLACEHOLDER_${index}`;
}

function renderTableCell(this: Renderer, cell: Tokens.TableCell): string {
	const tagName = cell.header ? 'th' : 'td';
	const alignAttribute = cell.align ? ` data-align="${escapeAttribute(cell.align)}"` : '';
	const innerHtml = this.parser.parseInline(cell.tokens);

	return `<${tagName}${alignAttribute}>${innerHtml}</${tagName}>`;
}

function attachCodeReferencesToFollowingCodeBlocks(tokens: Token[]): Token[] {
	const transformedTokens: Token[] = [];

	for (let index = 0; index < tokens.length; index += 1) {
		const token = tokens[index];
		const codeReference = getStandaloneCodeReference(token);

		if (codeReference) {
			const codeTokenIndex = findNextCodeTokenIndex(tokens, index + 1);

			if (codeTokenIndex !== -1) {
				(tokens[codeTokenIndex] as CodeTokenWithReference).codeReference = codeReference;
				continue;
			}
		}

		transformedTokens.push(token);
	}

	return transformedTokens;
}

function findNextCodeTokenIndex(tokens: Token[], startIndex: number): number {
	for (let index = startIndex; index < tokens.length; index += 1) {
		const token = tokens[index];

		if (token.type === 'space') {
			continue;
		}

		return token.type === 'code' ? index : -1;
	}

	return -1;
}

function getStandaloneCodeReference(token: Token): CodeReference | undefined {
	if (token.type !== 'paragraph' || !Array.isArray(token.tokens) || token.tokens.length !== 1) {
		return undefined;
	}

	const [inlineToken] = token.tokens;

	if (!inlineToken || inlineToken.type !== 'link') {
		return undefined;
	}

	if (!Array.isArray(inlineToken.tokens)) {
		return undefined;
	}

	const label = extractTokenText(inlineToken.tokens).trim();

	if (!isCodeReferenceLabel(label)) {
		return undefined;
	}

	return {
		href: normalizeLinkHref(inlineToken.href),
		label,
		title: inlineToken.title
	};
}

function isCodeReferenceLabel(label: string): boolean {
	return /^[\w./-]+\.[a-z0-9]+$/i.test(label);
}

function renderCodeReference(codeReference: CodeReference | undefined): string {
	if (!codeReference) {
		return '<span class="blog-content__code-reference-placeholder" aria-hidden="true"></span>';
	}

	const titleAttribute = codeReference.title
		? ` title="${escapeAttribute(codeReference.title)}"`
		: '';
	const externalAttributes = isExternalHref(codeReference.href)
		? ' target="_blank" rel="noreferrer noopener"'
		: '';

	return `<a class="blog-content__code-reference" href="${escapeAttribute(codeReference.href)}"${titleAttribute}${externalAttributes}>${escapeHtml(codeReference.label)}</a>`;
}

function normalizeLinkHref(href: string): string {
	if (href.startsWith('#') || href.startsWith('/')) {
		return href;
	}

	const url = new URL(href);
	const allowedProtocols = new Set(['http:', 'https:', 'mailto:']);

	if (!allowedProtocols.has(url.protocol)) {
		throw new Error(`Unsupported blog link protocol for ${href}.`);
	}

	return href;
}

function isExternalHref(href: string): boolean {
	if (href.startsWith('/') || href.startsWith('#')) {
		return false;
	}

	const protocol = new URL(href).protocol;
	return protocol === 'http:' || protocol === 'https:';
}

function resolveBlogImageUrl(href: string): string {
	const publicPath = normalizeBlogImagePublicPath(href);
	const imageUrl = imageUrlByPublicPath.get(publicPath);

	if (!imageUrl) {
		throw new Error(`Blog image ${href} does not map to a bundled asset.`);
	}

	return imageUrl;
}

function normalizeBlogImagePublicPath(href: string): string {
	if (href.startsWith(MARKDOWN_IMAGE_LEGACY_PREFIX)) {
		return `${BLOG_IMAGE_PATH_PREFIX}${href.slice(MARKDOWN_IMAGE_LEGACY_PREFIX.length)}`;
	}

	if (!href.startsWith(BLOG_IMAGE_PATH_PREFIX)) {
		throw new Error(`Blog image ${href} must use the ${BLOG_IMAGE_PATH_PREFIX} path prefix.`);
	}

	if (!SUPPORTED_IMAGE_EXTENSION_PATTERN.test(href)) {
		throw new Error(`Blog image ${href} uses an unsupported file extension.`);
	}

	return href;
}

function normalizeCodeLanguage(language: string | undefined): string {
	if (!language) {
		return '';
	}

	const languageId =
		language
			.trim()
			.split(/\s+/)
			.at(0)
			?.toLowerCase()
			.replace(/[^a-z0-9_-]/g, '') ?? '';

	return CODE_LANGUAGE_ALIASES.get(languageId) ?? languageId;
}

function highlightCode(code: string, language: string): string {
	if (!language || !hljs.getLanguage(language)) {
		return escapeHtml(code);
	}

	try {
		return hljs.highlight(code, { language, ignoreIllegals: true }).value;
	} catch {
		return escapeHtml(code);
	}
}

function getUniqueHeadingId(headingId: string, headingCounts: Map<string, number>): string {
	const existingCount = headingCounts.get(headingId) ?? 0;
	headingCounts.set(headingId, existingCount + 1);

	return existingCount === 0 ? headingId : `${headingId}-${existingCount + 1}`;
}

function slugifyHeading(value: string): string {
	const slug = value
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	return slug || 'section';
}

function extractTokenText(tokens: Token[]): string {
	return tokens
		.map((token) => {
			if ('tokens' in token && Array.isArray(token.tokens)) {
				return extractTokenText(token.tokens);
			}

			if ('text' in token && typeof token.text === 'string') {
				return token.text;
			}

			return '';
		})
		.join('');
}

function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (character) => {
		switch (character) {
			case '&':
				return '&amp;';
			case '<':
				return '&lt;';
			case '>':
				return '&gt;';
			case '"':
				return '&quot;';
			case "'":
				return '&#39;';
			default:
				return character;
		}
	});
}

function escapeAttribute(value: string): string {
	return escapeHtml(value);
}
