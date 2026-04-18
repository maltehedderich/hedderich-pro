# hedderich.pro

Static personal site built with SvelteKit, Svelte 5 runes, Tailwind CSS v4, mdsvex, and bun.

## Local development

```sh
bun install
bun run dev
```

## Checks

```sh
bun run check
bun run lint
bun run build
```

## Deployment

This repo targets fully static deployment on Cloudflare Pages through GitHub integration.

See [docs/cloudflare-pages.md](docs/cloudflare-pages.md) for:

- the exact Cloudflare Pages build settings
- the step-by-step setup flow
- what is required in the repo versus what stays optional, like Wrangler
