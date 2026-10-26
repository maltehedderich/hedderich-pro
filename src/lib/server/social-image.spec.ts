import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

import { getPublishedBlogPosts } from '$lib/content/blog';
import { SOCIAL_IMAGE_HEIGHT, SOCIAL_IMAGE_WIDTH } from '$lib/site';
import { renderArticleCard, renderBlogCard, renderHomeCard } from './social-image';

// WhatsApp reportedly drops previews above roughly 600 KB; stay well below that.
const maxCardBytes = 300 * 1024;

async function expectShareCard(card: Buffer, format: 'jpeg' | 'png'): Promise<void> {
	const metadata = await sharp(card).metadata();

	expect(metadata).toMatchObject({
		format,
		height: SOCIAL_IMAGE_HEIGHT,
		width: SOCIAL_IMAGE_WIDTH
	});
	expect(card.byteLength).toBeLessThan(maxCardBytes);
}

describe('share cards', () => {
	it('renders the home card as a JPEG', async () => {
		await expectShareCard(await renderHomeCard(), 'jpeg');
	});

	it('renders the blog archive card as a PNG', async () => {
		await expectShareCard(await renderBlogCard(), 'png');
	});

	it('renders a card for every published post', async () => {
		for (const post of getPublishedBlogPosts()) {
			await expectShareCard(await renderArticleCard(post), 'png');
		}
	});
});
