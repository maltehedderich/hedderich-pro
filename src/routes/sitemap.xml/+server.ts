import { getPublishedBlogPostItems } from '$lib/content/blog';
import { createAbsoluteUrl } from '$lib/site';
import type { RequestHandler } from './$types';

type SitemapEntry = {
	changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly';
	lastmod?: string;
	loc: string;
	priority?: string;
};

export const prerender = true;

const staticEntries: SitemapEntry[] = [
	{
		changefreq: 'weekly',
		loc: createAbsoluteUrl('/'),
		priority: '1.0'
	},
	{
		changefreq: 'weekly',
		loc: createAbsoluteUrl('/blog/'),
		priority: '0.8'
	}
];

export const GET: RequestHandler = () => {
	const blogEntries: SitemapEntry[] = getPublishedBlogPostItems().map((post) => ({
		changefreq: 'monthly',
		lastmod: post.publishedAt,
		loc: createAbsoluteUrl(post.href),
		priority: '0.7'
	}));

	return new Response(createSitemapXml([...staticEntries, ...blogEntries]), {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8'
		}
	});
};

function createSitemapXml(entries: SitemapEntry[]): string {
	const urls = entries.map(renderSitemapEntry).join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function renderSitemapEntry(entry: SitemapEntry): string {
	return [
		'\t<url>',
		`\t\t<loc>${escapeXml(entry.loc)}</loc>`,
		entry.lastmod ? `\t\t<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : '',
		entry.changefreq ? `\t\t<changefreq>${entry.changefreq}</changefreq>` : '',
		entry.priority ? `\t\t<priority>${entry.priority}</priority>` : '',
		'\t</url>'
	]
		.filter(Boolean)
		.join('\n');
}

function escapeXml(value: string): string {
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
				return '&apos;';
			default:
				return character;
		}
	});
}
