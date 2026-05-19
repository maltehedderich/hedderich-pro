import { getPublishedWritingItems } from '$lib/content/blog';
import type { PageServerLoad } from './$types';

export const load = (() => ({
	posts: getPublishedWritingItems()
})) satisfies PageServerLoad;
