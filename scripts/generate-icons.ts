import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

interface IconVariant {
	scale: number;
	strokeWidth: number;
}

// Brand inks; they mirror --color-signal and --color-ink in static/design-tokens.css.
const signal = '#00f0cb';
const ink = '#101817';

// Lucide "cat", the site's mark, on a 24-unit grid.
const catPaths = [
	'M12 5c.67 0 1.35.09 2 .26c1.78-2 5.03-2.84 6.42-2.26c1.4.58-.42 7-.42 7c.57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44c0 0-1.89-6.42-.5-7s4.72.23 6.5 2.23A9 9 0 0 1 12 5m-4 9v.5m8-.5v.5',
	'M11.25 16.25h1.5L12 17z'
];

// Favicons fill more of the square with a heavier stroke so the cat survives 16 px. App icons
// leave room for platform corner rounding; maskable icons keep the cat inside the 80% safe zone.
const favicon: IconVariant = { scale: 0.82, strokeWidth: 2.5 };
const appIcon: IconVariant = { scale: 0.72, strokeWidth: 2 };
const maskableIcon: IconVariant = { scale: 0.6, strokeWidth: 2 };

const staticDir = fileURLToPath(new URL('../static/', import.meta.url));

function createIconSvg({ scale, strokeWidth }: IconVariant): string {
	const offset = 12 * (1 - scale);
	const paths = catPaths.map((path) => `<path d="${path}"/>`).join('');

	return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="${signal}"/><g fill="none" stroke="${ink}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${strokeWidth}" transform="translate(${offset} ${offset}) scale(${scale})">${paths}</g></svg>\n`;
}

function renderPng(variant: IconVariant, size: number): Promise<Buffer> {
	return sharp(Buffer.from(createIconSvg(variant)), { density: (72 * size) / 24 })
		.resize(size, size)
		.png({ compressionLevel: 9 })
		.toBuffer();
}

/** Packs PNG images into an ICO container, which every current browser reads. */
function createIco(images: Array<{ png: Buffer; size: number }>): Buffer {
	const header = Buffer.alloc(6);
	header.writeUInt16LE(1, 2);
	header.writeUInt16LE(images.length, 4);

	let offset = header.byteLength + 16 * images.length;
	const entries = images.map(({ png, size }) => {
		const entry = Buffer.alloc(16);
		entry.writeUInt8(size, 0);
		entry.writeUInt8(size, 1);
		entry.writeUInt16LE(1, 4);
		entry.writeUInt16LE(32, 6);
		entry.writeUInt32LE(png.byteLength, 8);
		entry.writeUInt32LE(offset, 12);
		offset += png.byteLength;
		return entry;
	});

	return Buffer.concat([header, ...entries, ...images.map(({ png }) => png)]);
}

const pngOutputs: Array<[fileName: string, variant: IconVariant, size: number]> = [
	['favicon-16x16.png', favicon, 16],
	['favicon-32x32.png', favicon, 32],
	['favicon-48x48.png', favicon, 48],
	['apple-touch-icon.png', appIcon, 180],
	['android-chrome-192x192.png', appIcon, 192],
	['android-chrome-512x512.png', appIcon, 512],
	['icon.png', appIcon, 512],
	['maskable-icon-192x192.png', maskableIcon, 192],
	['maskable-icon-512x512.png', maskableIcon, 512]
];

const icoImages: Array<{ png: Buffer; size: number }> = [];

await writeFile(`${staticDir}icon.svg`, createIconSvg(favicon));

for (const [fileName, variant, size] of pngOutputs) {
	const png = await renderPng(variant, size);
	await writeFile(`${staticDir}${fileName}`, png);

	if (variant === favicon) icoImages.push({ png, size });
}

await writeFile(`${staticDir}favicon.ico`, createIco(icoImages));

console.log(`Wrote icon.svg, favicon.ico and ${pngOutputs.length} PNG icons to static/.`);
