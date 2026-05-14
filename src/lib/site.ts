export const SITE_AUTHOR = 'Malte Hedderich';
export const SITE_LANGUAGE = 'en';
export const SITE_NAME = 'Malte Hedderich';
export const SITE_SOCIAL_HANDLE = '@hedderichpro';
export const SITE_URL = 'https://hedderich.pro';

export function createAbsoluteUrl(pathname: string): string {
	return new URL(pathname, SITE_URL).toString();
}
