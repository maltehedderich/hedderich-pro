# hedderich.pro

Static personal site built with SvelteKit, Svelte 5 runes, Tailwind CSS v4, mdsvex, and bun.

## Local development

Install [mise](https://mise.jdx.dev/getting-started.html), then run:

```sh
mise trust
mise install --locked
mise run setup
mise run dev
```

Tool versions live in `mise.toml`; `mise.lock` pins the binaries for local development and CI. Bun dependencies remain pinned in `bun.lock`. Node is included for the framework and test CLIs. Run `mise trust` once per checkout on each machine.

`setup` installs dependencies from the lockfile and generates SvelteKit types. It is safe to rerun. Task commands live in `mise.toml`; `package.json` holds dependencies.

## Tasks

Use `mise tasks ls` to list commands.

| Command                                   | Purpose                                           |
| ----------------------------------------- | ------------------------------------------------- |
| `mise run setup`                          | Install dependencies and generate SvelteKit types |
| `mise run dev`                            | Start the development server                      |
| `mise run check`                          | Run lint, type checks, and tests                  |
| `mise run lint`                           | Check formatting and lint the code                |
| `mise run typecheck`                      | Check Svelte and TypeScript types                 |
| `mise run typecheck --watch`              | Keep type checks running as files change          |
| `mise run test`                           | Run the test suite                                |
| `mise run format`                         | Format project files                              |
| `mise run build`                          | Generate the static site in `build/`              |
| `mise run preview`                        | Serve the existing build locally                  |
| `mise run email:generate you@example.com` | Generate an obfuscated email payload              |
| `mise run icons:generate`                 | Regenerate favicons and app icons                 |

Before opening a pull request:

```sh
mise run check
mise run build
```

GitHub Actions runs setup, checks, and the static build for pull requests and pushes to `main`.

Personal non-secret overrides belong in the ignored `mise.local.toml` or `mise.<environment>.local.toml`. No build-time app variables or secrets are required. The email obfuscation key is public client configuration, not a deployment secret.

## Deployment

This repo targets fully static deployment on Cloudflare Pages through GitHub integration.

Pages production builds select `mise.production.toml`; preview builds select `mise.staging.toml`. Local tasks need no environment selection. There is no separate deployed development environment.

See [docs/cloudflare-pages.md](docs/cloudflare-pages.md) for the dashboard settings and mise build command.
