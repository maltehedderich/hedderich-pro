# Deploy to Cloudflare Pages

This site produces static files in `build/` with `@sveltejs/adapter-static`. Cloudflare Pages deploys them through its GitHub integration. No app secrets or build-time app variables are required.

## Dashboard settings

Create a **Pages** project connected to this repository. Use these settings for production and preview builds:

| Setting                   | Value           |
| ------------------------- | --------------- |
| Production branch         | `main`          |
| Build image               | v3              |
| Root directory            | Repository root |
| Build output directory    | `build`         |
| `SKIP_DEPENDENCY_INSTALL` | `1`             |
| `MISE_ENV` in Production  | `production`    |
| `MISE_ENV` in Preview     | `staging`       |

Set the build command to this single line:

```sh
curl -fsSL https://mise.run -o /tmp/install-mise.sh && sh /tmp/install-mise.sh && export PATH="$HOME/.local/bin:$PATH" && mise trust && mise install --locked && mise run setup && mise run build
```

The command installs mise using its [official installer](https://mise.jdx.dev/installing-mise.html), installs tools from `mise.lock`, then runs the same setup and build tasks used locally. Cloudflare supports [skipping automatic dependency installation](https://developers.cloudflare.com/pages/configuration/build-image/#skip-dependency-install), so `setup` owns dependency installation.

Remove any dashboard `BUN_VERSION` or `NODE_VERSION` overrides. Tool versions come from `mise.toml` and `mise.lock`. `MISE_ENV` loads the production or staging config for the build; keep it scoped to the Pages environment rather than exporting it in a local shell profile.

If Cloudflare suggests the SvelteKit preset, override its output directory to `build`. `.svelte-kit/cloudflare` belongs to the runtime adapter and is not this site's output.

## Verify the deployment

1. Save the settings and deploy the branch containing the mise migration.
2. Open the generated `*.pages.dev` URL.
3. Check the homepage, static assets, and direct navigation to a blog post. Routes use trailing slashes and produce `route/index.html` files.
4. Add the production custom domain once the Pages URL works.

Pushes to `main` update production. Other enabled branches produce preview deployments. The staging mise config labels those preview builds; it does not create a separate Pages project.

GitHub Actions checks the code and static build. Cloudflare's Git integration handles publishing; there is no deployment task or Cloudflare API token in this repository.

## Troubleshooting

- If the log runs `wrangler deploy`, check that the project uses Pages Git integration rather than Workers Builds.
- If the output directory is missing, confirm it is set to `build`.
- If mise reports an untrusted config, confirm the build command includes `mise trust` before installation and tasks.
- If dependencies are missing, confirm `mise run setup` finishes before `mise run build`.
- For local inspection, run `mise run build` followed by `mise run preview`.
