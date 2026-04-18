# Deploy to Cloudflare Pages

This repo is configured for a fully static Cloudflare Pages deployment through GitHub integration. It does not require Pages Functions, a custom `_worker.js`, or the Cloudflare runtime adapter.

## What this repo already has

- `@sveltejs/adapter-static` in `package.json`
- `svelte.config.js` writing the production build to `build/`
- `src/routes/+layout.ts` exporting `prerender = true` and `trailingSlash = 'always'`
- `bun.lock` committed so the Cloudflare build can use the same dependency graph

## What you still need in Cloudflare

- A Cloudflare Pages project connected to this GitHub repository
- `main` as the production branch
- `bun run build` as the build command
- `build` as the build output directory
- `BUN_VERSION=1.3.9` as a Pages environment variable to match the local Bun version used in this repo

## Step by step

1. Push the current repository state to GitHub.
2. In Cloudflare, open `Workers & Pages` and create a new `Pages` project from an existing Git repository.
3. Select this repository and start the setup flow.
4. Do not keep the default `SvelteKit` preset values if Cloudflare suggests them. That preset expects `.svelte-kit/cloudflare`, which is only correct for the Cloudflare runtime adapter. This repo builds static files into `build/`.
5. Set the production branch to `main`.
6. Set the build command to `bun run build`.
7. Set the build output directory to `build`.
8. Add the environment variable `BUN_VERSION` with the value `1.3.9`.
9. Save and deploy.
10. After the first deployment finishes, verify the generated `*.pages.dev` URL.
11. Check the homepage, static assets, and direct navigation to any non-root route. With `trailingSlash = 'always'`, prerendered routes are emitted as `route/index.html`, which is the safest shape for static hosting.
12. Add the production custom domain after the `pages.dev` deployment is working.

## Preview deployments

- Pushes to `main` should update production.
- Pull requests should get preview deployments automatically through the GitHub integration.
- Use preview deployments to verify layout, assets, and route loading before merging.

## Optional: Wrangler

Wrangler is not required for the GitHub-integrated Pages workflow above.

Add Wrangler only if you want local Pages emulation or manual CLI deployments:

```sh
bun add -d wrangler
```

Useful commands after that:

```sh
bun run build
bunx wrangler pages dev build
bunx wrangler pages deploy build --project-name <your-pages-project-name>
```

Do not add a committed `wrangler.jsonc` yet unless you want to standardize a CLI deployment workflow and are ready to pin the real Cloudflare Pages project name in the repo.
