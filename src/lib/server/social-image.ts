import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import satori, { type Font } from 'satori';
import sharp from 'sharp';

import type { BlogPostItem } from '$lib/content/blog';
import { SOCIAL_IMAGE_HEIGHT, SOCIAL_IMAGE_WIDTH } from '$lib/site';

type CardStyle = Record<string, number | string>;

interface CardNode {
	type: string;
	props: {
		children?: CardChild | CardChild[];
		src?: string;
		style?: CardStyle;
	};
}

type CardChild = CardNode | string;

export type ArticleCardPost = Pick<BlogPostItem, 'dateLabel' | 'readTime' | 'tag' | 'title'>;

// Brand inks; they mirror --color-signal, --color-ink and --color-paper in static/design-tokens.css.
const signal = '#00f0cb';
const ink = '#101817';
const paper = '#f5f5ee';
// --color-muted on paper: 72% ink mixed into paper.
const mutedOnPaper = '#505653';

const displayFont = 'Barlow Condensed';
const bodyFont = 'Barlow';
const pagePadding = 64;
const portraitSize = 344;

let fontsPromise: Promise<Font[]> | undefined;
let portraitPromise: Promise<string> | undefined;

/** The home card mirrors the hero: name and thesis on paper, the portrait in a signal frame. */
export async function renderHomeCard(): Promise<Buffer> {
	const card = h(
		'div',
		{
			alignItems: 'center',
			backgroundColor: paper,
			boxSizing: 'border-box',
			color: ink,
			display: 'flex',
			gap: 48,
			height: '100%',
			padding: pagePadding,
			width: '100%'
		},
		[
			h('div', { display: 'flex', flex: 1, flexDirection: 'column', minWidth: 0 }, [
				eyebrow('AI engineer & product builder', mutedOnPaper),
				h(
					'div',
					{
						display: 'flex',
						flexDirection: 'column',
						fontFamily: displayFont,
						fontSize: 136,
						fontWeight: 800,
						letterSpacing: '-0.015em',
						lineHeight: 0.95,
						marginTop: 24,
						textTransform: 'uppercase'
					},
					[h('div', {}, 'Malte'), h('div', {}, 'Hedderich')]
				),
				h(
					'div',
					{
						fontFamily: bodyFont,
						fontSize: 30,
						fontWeight: 500,
						lineHeight: 1.25,
						marginTop: 32,
						maxWidth: 560
					},
					'AI engineer. What I learn building, selling and running my own products with AI.'
				)
			]),
			h(
				'div',
				{ backgroundColor: signal, display: 'flex', flexShrink: 0, padding: '24px 24px 72px' },
				[
					{
						type: 'img',
						props: {
							src: await loadPortrait(),
							style: { height: portraitSize, width: portraitSize }
						}
					}
				]
			)
		]
	);

	return sharp(await renderSvg(card))
		.jpeg({ chromaSubsampling: '4:4:4', mozjpeg: true, quality: 90 })
		.toBuffer();
}

/** The archive card repeats the signal hero of /blog/. */
export async function renderBlogCard(): Promise<Buffer> {
	const card = signalCard([
		eyebrow('Writing archive', ink),
		h(
			'div',
			{
				fontFamily: displayFont,
				fontSize: 200,
				fontWeight: 800,
				letterSpacing: '-0.015em',
				lineHeight: 1,
				marginTop: 8
			},
			'Blog'
		),
		h(
			'div',
			{
				fontFamily: bodyFont,
				fontSize: 30,
				fontWeight: 500,
				lineHeight: 1.35,
				marginTop: 40,
				maxWidth: 900
			},
			'Essays on LLM applications, AI agents, evaluation, prompt optimization, and machine learning engineering.'
		)
	]);

	return renderPng(card);
}

/** Article cards lead with the post title and repeat the metadata row of PostMeta. */
export async function renderArticleCard(post: ArticleCardPost): Promise<Buffer> {
	const card = signalCard([
		h(
			'div',
			{
				alignItems: 'center',
				display: 'flex',
				fontFamily: bodyFont,
				fontSize: 22,
				fontWeight: 600,
				gap: 24,
				lineHeight: 1.2
			},
			[
				h('div', { backgroundColor: paper, display: 'flex', padding: '8px 14px' }, post.tag),
				h('div', {}, post.dateLabel),
				h('div', {}, `${post.readTime} read`)
			]
		),
		h(
			'div',
			{
				fontFamily: displayFont,
				fontSize: getTitleSize(post.title),
				fontWeight: 800,
				letterSpacing: '-0.015em',
				lineHeight: 1.02,
				marginTop: 32,
				maxWidth: SOCIAL_IMAGE_WIDTH - pagePadding * 2,
				textWrap: 'balance'
			},
			post.title
		)
	]);

	return renderPng(card);
}

function signalCard(body: CardChild[]): CardNode {
	return h(
		'div',
		{
			backgroundColor: signal,
			color: ink,
			display: 'flex',
			flexDirection: 'column',
			height: '100%',
			width: '100%'
		},
		[
			h(
				'div',
				{
					alignItems: 'center',
					backgroundColor: paper,
					display: 'flex',
					height: 72,
					justifyContent: 'space-between',
					padding: `0 ${pagePadding}px`
				},
				[
					h(
						'div',
						{
							fontFamily: displayFont,
							fontSize: 30,
							fontWeight: 800,
							textTransform: 'uppercase'
						},
						'Malte Hedderich'
					),
					h('div', { fontFamily: bodyFont, fontSize: 22, fontWeight: 600 }, 'hedderich.pro')
				]
			),
			h(
				'div',
				{
					display: 'flex',
					flex: 1,
					flexDirection: 'column',
					justifyContent: 'center',
					padding: `0 ${pagePadding}px 40px`
				},
				body
			)
		]
	);
}

function eyebrow(text: string, color: string): CardNode {
	return h(
		'div',
		{
			color,
			fontFamily: bodyFont,
			fontSize: 22,
			fontWeight: 600,
			letterSpacing: '0.08em',
			textTransform: 'uppercase'
		},
		text
	);
}

function getTitleSize(title: string): number {
	if (title.length <= 28) return 112;
	if (title.length <= 56) return 88;
	if (title.length <= 90) return 80;
	return 64;
}

function h(type: string, style: CardStyle, children?: CardChild | CardChild[]): CardNode {
	return { type, props: { children, style } };
}

async function renderPng(card: CardNode): Promise<Buffer> {
	return sharp(await renderSvg(card))
		.png({ compressionLevel: 9 })
		.toBuffer();
}

async function renderSvg(card: CardNode): Promise<Buffer> {
	const svg = await satori(card, {
		fonts: await loadFonts(),
		height: SOCIAL_IMAGE_HEIGHT,
		width: SOCIAL_IMAGE_WIDTH
	});

	return Buffer.from(svg);
}

// Prerendering runs from the project root, so the self-hosted fonts and portrait are read from there.
function loadFonts(): Promise<Font[]> {
	fontsPromise ??= Promise.all([
		loadFont(displayFont, 800, 'barlow-condensed-latin-800-normal.woff2'),
		loadFont(bodyFont, 500, 'barlow-latin-500-normal.woff2'),
		loadFont(bodyFont, 600, 'barlow-latin-600-normal.woff2')
	]);

	return fontsPromise;
}

async function loadFont(name: string, weight: Font['weight'], fileName: string): Promise<Font> {
	const data = await readFile(join(process.cwd(), 'static/fonts', fileName));

	return { data, name, style: 'normal', weight };
}

function loadPortrait(): Promise<string> {
	portraitPromise ??= sharp(join(process.cwd(), 'src/lib/assets/malte-hedderich.png'))
		.resize(portraitSize, portraitSize)
		.jpeg({ quality: 90 })
		.toBuffer()
		.then((portrait) => `data:image/jpeg;base64,${portrait.toString('base64')}`);

	return portraitPromise;
}
