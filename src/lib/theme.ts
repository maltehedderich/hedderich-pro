export type Theme = 'light' | 'dark';

// The inline script in src/app.html and static/404.html reads the same key before first paint.
const storageKey = 'theme';
const darkSchemeQuery = '(prefers-color-scheme: dark)';

// Browser chrome colors; they mirror --color-paper and --color-ink in static/design-tokens.css.
const themeColors: Record<Theme, string> = {
	light: '#f5f5ee',
	dark: '#101817'
};

const getSystemTheme = (): Theme => (matchMedia(darkSchemeQuery).matches ? 'dark' : 'light');

const readStoredTheme = (): Theme | undefined => {
	try {
		const theme = localStorage.getItem(storageKey);
		return theme === 'light' || theme === 'dark' ? theme : undefined;
	} catch {
		return undefined;
	}
};

const applyTheme = (theme: Theme): void => {
	document.documentElement.dataset.theme = theme;

	for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
		meta.setAttribute('content', themeColors[theme]);
	}
};

export const getActiveTheme = (): Theme =>
	document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

/** Applies a visitor's choice. Only a choice that differs from the OS setting is stored. */
export const setTheme = (theme: Theme): void => {
	applyTheme(theme);

	try {
		if (theme === getSystemTheme()) {
			localStorage.removeItem(storageKey);
		} else {
			localStorage.setItem(storageKey, theme);
		}
	} catch {
		// Without storage the choice lasts for this page view.
	}
};

/**
 * Syncs the browser chrome with the theme the inline script picked, then keeps the page on
 * the OS setting while the visitor has no stored choice.
 */
export const initTheme = (): (() => void) => {
	applyTheme(readStoredTheme() ?? getSystemTheme());

	const query = matchMedia(darkSchemeQuery);
	const handleChange = () => {
		if (!readStoredTheme()) applyTheme(getSystemTheme());
	};

	query.addEventListener('change', handleChange);
	return () => query.removeEventListener('change', handleChange);
};
