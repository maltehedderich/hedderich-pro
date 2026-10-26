import { renderBlogCard } from '$lib/server/social-image';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () =>
	new Response(new Uint8Array(await renderBlogCard()), {
		headers: {
			'Content-Type': 'image/png'
		}
	});
