export const SITE_AUTHOR = 'Malte Hedderich';
export const SITE_LANGUAGE = 'en';
export const SITE_NAME = 'Malte Hedderich';
export const SITE_SOCIAL_HANDLE = '@hedderichpro';
export const SITE_URL = 'https://hedderich.pro';

// Share cards are rendered at build time by src/lib/server/social-image.ts.
export const SOCIAL_IMAGE_WIDTH = 1200;
export const SOCIAL_IMAGE_HEIGHT = 630;

export function createAbsoluteUrl(pathname: string): string {
	return new URL(pathname, SITE_URL).toString();
}

export function createSocialImageUrl(fileName: string): string {
	return createAbsoluteUrl(`/og/${fileName}`);
}
