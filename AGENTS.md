# Project Guidelines

## Project Goal

- Build and maintain this site as a fully static SvelteKit web app.
- Treat Cloudflare Pages, deployed through GitHub integration, as the target platform.
- Keep routes prerenderable and asset-based by default.
- Do not introduce server-only features such as `+server.ts`, form actions that require a runtime, session/auth backends, or other SSR-dependent behavior unless the user explicitly asks for them.

## Stack And Workflow

- Use TypeScript, Svelte 5, SvelteKit, Tailwind CSS v4, mdsvex, and bun.
- Use `bun` for install and scripts.
- The project forces Svelte runes mode in [svelte.config.js](svelte.config.js). Write new Svelte app code in runes style.
- Follow the existing composition and tone in [src/routes/+page.svelte](src/routes/+page.svelte) and the shared tokens and component classes in [src/routes/layout.css](src/routes/layout.css).
- If a task touches build or deployment config, favor a static output that fits Cloudflare Pages rather than defaulting to environment-agnostic adapter behavior.

## Design System

- Follow [DESIGN.md](DESIGN.md) as the visual source of truth.
- Respect the no-line rule: avoid divider lines and opaque borders for layout separation. Use spacing and surface shifts instead.
- Reuse the existing color, focus, and shadow tokens from [src/routes/layout.css](src/routes/layout.css) before adding new ones.
- Preserve the editorial feel: asymmetric layouts, strong type hierarchy, restrained amber accent usage, and generous whitespace.
- Keep motion subtle and purposeful. Avoid heavy animation, oversized shadows, and generic SaaS chrome.

## UI Conventions

- Import icons only from `~icons/lucide/<icon-name>` via `unplugin-icons`.
- Do not add raw SVG files, emoji, or Unicode arrow glyphs when a Lucide icon exists.
- Keep icons on `currentColor` unless there is a deliberate accent reason.
- Prefer extending or reusing patterns from [src/lib/components](src/lib/components) before creating one-off UI primitives.

## Commands

- `bun install`
- `bun run dev`
- `bun run check`
- `bun run lint`
- `bun run build`
- `bun run format`
- After non-trivial Svelte or styling changes, run at least `bun run check` and `bun run lint`.

## References

- Start with [README.md](README.md) for local setup.
- Use [package.json](package.json) for the canonical script list.
- Use [DESIGN.md](DESIGN.md) for design decisions instead of re-deriving the visual rules.

## Svelte MCP

- When you need Svelte or SvelteKit documentation, use the Svelte MCP docs flow: list sections first, then fetch every relevant section.
- Run the Svelte autofixer on changed `.svelte` files before finishing Svelte code changes.
