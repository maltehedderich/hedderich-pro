import { getBlogPostByRouteSlug, getBlogPostEntries } from '$lib/content/blog';
import { renderArticleCard } from '$lib/server/social-image';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => getBlogPostEntries();

export const GET: RequestHandler = async ({ params }) => {
	const post = getBlogPostByRouteSlug(params.slug);

	if (!post) {
		error(404, { message: 'Blog post not found' });
	}

	return new Response(new Uint8Array(await renderArticleCard(post)), {
		headers: {
			'Content-Type': 'image/png'
		}
	});
};
