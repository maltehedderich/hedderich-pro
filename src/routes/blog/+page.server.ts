import { getPublishedBlogPostItems } from '$lib/content/blog';
import type { PageServerLoad } from './$types';

export const load = (() => ({
	posts: getPublishedBlogPostItems()
})) satisfies PageServerLoad;
