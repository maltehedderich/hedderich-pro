import {
	getBlogPostByRouteSlug,
	getBlogPostEntries,
	getPublishedBlogPostItems
} from '$lib/content/blog';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => getBlogPostEntries();

export const load: PageServerLoad = ({ params }) => {
	const post = getBlogPostByRouteSlug(params.slug);

	if (!post) {
		error(404, { message: 'Blog post not found' });
	}

	const posts = getPublishedBlogPostItems();
	const postIndex = posts.findIndex((item) => item.id === params.slug);

	return {
		post,
		newerPost: postIndex > 0 ? posts[postIndex - 1] : null,
		olderPost: postIndex >= 0 ? (posts[postIndex + 1] ?? null) : null
	};
};
