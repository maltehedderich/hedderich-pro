# Deploy to Cloudflare Pages

This repo is configured for a fully static Cloudflare Pages deployment through Git integration. It does not require Pages Functions, a custom `_worker.js`, the Cloudflare runtime adapter, or a committed Wrangler config.

## What this repo already has

- `@sveltejs/adapter-static` in `package.json`
- `svelte.config.js` writing the production build to `build/`
- `src/routes/+layout.ts` exporting `prerender = true` and `trailingSlash = 'always'`
- `bun.lock` committed so the Cloudflare build can use the same dependency graph
- no required build-time app environment variables

## What you need to do in Cloudflare

- Create a real `Pages` project, not a `Workers`/`Workers Builds` project
- Connect that Pages project to this GitHub repository
- Set `main` as the production branch
- Set `bun run build:cloudflare` as the build command
- Set `build` as the build output directory
- Set `BUN_VERSION=1.3.9` in Pages environment variables to match the local Bun version used in this repo
- Optionally set `WRANGLER_SEND_METRICS=false`, though Pages-only deployment should not require Wrangler in the repo

## Step by step

1. Push the current repository state to GitHub.
2. In Cloudflare, open `Workers & Pages`.
3. Select `Create application` and then the `Pages` tab.
4. Select `Import an existing Git repository` or `Connect to Git`.
5. Choose this GitHub repository and begin setup.
6. If you already connected this repository to a Worker or Workers Build, do not reuse that deploy path. Create a separate Pages project for this repo.
7. If Cloudflare suggests the default `SvelteKit` preset, override it. That preset expects `.svelte-kit/cloudflare`, which is only correct for the Cloudflare runtime adapter. This repo outputs static files to `build/`.
8. Set the production branch to `main`.
9. Set the build command to `bun run build:cloudflare`.
10. Set the build output directory to `build`.
11. Add the environment variable `BUN_VERSION` with the value `1.3.9`.
12. Save and deploy.
13. After the first deployment finishes, verify the generated `*.pages.dev` URL.
14. Check the homepage, static assets, and direct navigation to any non-root route. With `trailingSlash = 'always'`, prerendered routes are emitted as `route/index.html`, which is the safest shape for static hosting.
15. Add the production custom domain after the `pages.dev` deployment is working.

## Preview deployments

- Pushes to `main` should update production.
- Pull requests should get preview deployments automatically through the GitHub integration.
- Use preview deployments to verify layout, assets, and route loading before merging.

## Important notes

- This repo intentionally does not commit `wrangler.jsonc`. That avoids accidentally turning a Pages deployment into a Worker deployment path.
- If your current Cloudflare deployment log shows `wrangler deploy`, you are not using a Pages-only deploy path yet.
- The `build:cloudflare` script runs `bun install --frozen-lockfile` before `vite build`. Use it in Pages because your current build log shows Cloudflare is skipping automatic dependency installation.
- If you already created a non-Pages Cloudflare project for this repo, the clean fix is to create a new Pages project and connect the same GitHub repository there.
- Cloudflare documents that existing Direct Upload Pages apps cannot later add Git integration. If you need Git integration and do not already have a Git-integrated Pages project, create a new Pages app.
- If Pages still skips dependency installation after using `bun run build:cloudflare`, reauthorize the Cloudflare Pages GitHub integration. Cloudflare calls out Git integration setup problems as a cause of build initialization failures.

## Optional: local Wrangler use

Add Wrangler only if you want local Pages emulation or manual Pages uploads later:

```sh
bun add -d wrangler
```

Useful commands after that:

```sh
bun run build
bunx wrangler pages dev build
bunx wrangler pages deploy build --project-name <your-pages-project-name>
```
