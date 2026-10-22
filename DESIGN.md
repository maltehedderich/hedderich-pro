# hedderich.pro design system

## Scope and authority

This guide defines the Electric Press design system for hedderich.pro: Malte Hedderich’s projects, writing and contact pages. It covers the visual rules, shared components and responsive behavior of this static website.

- [static/design-tokens.css](static/design-tokens.css) owns the exact palette, type scale, spacing, radii, focus and motion values.
- [static/fonts.css](static/fonts.css) loads the locally hosted Barlow fonts. The Latin WOFF2 files in [static/fonts](static/fonts) come from Fontsource 5.3.0; their license is [OFL.txt](static/fonts/OFL.txt).
- [src/routes/layout.css](src/routes/layout.css) imports those files and implements shared `ds-*` treatments.
- [src/lib/components](src/lib/components) owns the Svelte component APIs. Page styles handle composition, using the shared tokens.
- [static/error-page.css](static/error-page.css) shares the error layout between Svelte and the standalone hosting fallback.
- [src/lib/theme.ts](src/lib/theme.ts) applies and stores the visitor's theme; the inline script in [src/app.html](src/app.html) (repeated in [static/404.html](static/404.html)) applies it before first paint.

## Character and reading order

The site should feel bold, direct and graphic. Visitors should quickly understand what Malte builds, inspect his work, read an article or find a contact channel.

Use heavy condensed headings, flat color and straight edges. Keep paragraphs in the regular-width face. Align text to a clear left edge; use whitespace and flat surfaces to group related content. A section heading should clearly outrank its item titles.

Use an asymmetric section rail on wide screens. Avoid adding containers around every sentence. Articles need a steady reading rhythm; project summaries need enough density to compare them.

## Color and modes

The three brand inks are `--color-signal` (turquoise), `--color-ink` (near-black) and `--color-paper` (off-white). Exact values live only in the token file.

| Mode   | Purpose                                      | Approved treatment                                     |
| ------ | -------------------------------------------- | ------------------------------------------------------ |
| Paper  | Default pages, articles, explanations        | Ink text; signal fills for an action or evidence strip |
| Signal | A key statement, result or primary action    | Ink text; paper evidence strip                         |
| Dark   | Code, data or a deliberate contrasting panel | Paper text; signal emphasis; paper evidence strip      |

Use `.ds-surface` with `data-mode="paper"`, `"signal"` or `"dark"` for a flat panel. Its `--panel-ink`, `--panel-muted` and `--panel-emphasis` roles provide the appropriate text colors. Panel modes are a composition choice, separate from the site theme below. Text in these panels should inherit the panel color. Components with their own filled surfaces retain their own foreground/background pairing.

`--surface-container-*` and `--color-muted` derive from ink and paper for quieter web surfaces and metadata. They are neutral roles, not extra brand accents. Prefer the lightest useful surface shift. Avoid nested panels.

### Light and dark themes

The site has a light theme (ink on paper) and a dark theme (paper on ink). The OS setting chooses by default. The `ThemeToggle` stores a choice only when it differs from the OS setting, so clearing it returns the site to the OS. Without JavaScript the toggle stays hidden and the OS still decides.

- The brand inks never change. Theme roles live in the token file: `--color-on-surface` for page text, `--surface`, `--surface-container-*`, `--color-muted` and `--focus-ring-color`. Use these roles for anything that sits on the page; reserve `--color-ink` and `--color-paper` for text on a fixed fill, such as ink on signal.
- Roles use `light-dark()` with `color-scheme` on `:root`; `[data-theme]` overrides the OS. In the dark theme, surfaces lift toward paper in slightly larger steps than the light theme sinks toward ink, so cards stay visible.
- Paper panels follow the theme. Signal surfaces (`.ds-surface[data-mode="signal"]`, `InsightBlock`, article quotations) remain light contexts with ink text in both themes. The production build lowers `light-dark()` into variables that resolve on `:root`, so these surfaces pin the text roles they need; a nested `color-scheme` alone is not enough.
- Dark panels contrast with paper in the light theme. In the dark theme they lift to `--surface-container-high` and keep paper text with signal emphasis.
- Code frames stay dark in both themes and lift to `--surface-container-low` on the dark page. Article figures keep their original image content.

Use ink on paper and signal; use paper or signal on ink. Do not use turquoise text or essential icons on paper, or paper text on turquoise. `--color-primary` remains an ink text-link alias; the primary button’s fill uses `--color-signal`. Turquoise attracts attention and does not itself mean success or approval. State labels and icons must explain outcomes.

Real screenshots retain their product colors. Article syntax highlighting can retain its functional colors; code frames, toolbar controls and links use the brand palette.

## Typography

| Role                 | Face and weight                                | Use                                                              |
| -------------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| Display and headings | Barlow Condensed ExtraBold, `--weight-display` | Page titles, section headings, article headings and card titles  |
| Large numerals       | Barlow Condensed Black, `--weight-numeral`     | Results and comparable metrics through `.ds-numeral`             |
| Body                 | Barlow Medium, `--weight-body`                 | Paragraphs, summaries and introductions                          |
| Labels and emphasis  | Barlow SemiBold, `--weight-label`              | Controls and short labels; bold article text may use Barlow Bold |
| Code and mathematics | Existing monospace and KaTeX faces             | Technical content only                                           |

The display family falls back to Arial Narrow and sans-serif; body falls back to Helvetica Neue and sans-serif. Fonts use `font-display: swap`. Body italic has a real font file.

Use the `--text-*` roles rather than new local font sizes. `--text-hero` is reserved for the home name. `--text-display` covers page titles; `--text-section`, `--text-title` and `--text-title-sm` distinguish section headings, article/list headings and smaller item titles. Metadata uses `--text-meta`; short labels use `--text-micro`.

`.ds-heading` supplies condensed heading weight, tracking and leading. Use uppercase for the short home name and section labels. Keep long article titles, project names, labels and body copy in their natural case. Never stretch letters; use the shared tracking tokens.

Keep display lines tight using the heading tokens. Paragraphs use roughly 1.65–1.85 line height for sustained reading. Prose caps at `--measure-prose`; figures, tables and code may use the wider article frame. Let long titles wrap, and check the longest real article title at narrow widths.

For data, use tabular numerals and align comparable values and units. Keep precision consistent. A large number still needs a visible label, scope and comparison period where relevant.

## Layout, spacing and shape

Reuse the `--space-*` scale. Gaps between sections should exceed gaps within a group. `.ds-page`, `.ds-page-frame` and `.ds-page-stack` share the page gutters, content width and section rhythm. Their values live in `--page-gutter`, `--layout-max` and `--section-gap`. Section rails use `--layout-rail` and `--layout-gap` so the home page, archive and articles share an alignment.

- Below the desktop rail breakpoint, section labels move above their content. At desktop widths, the label rail sits beside the content.
- The home portrait precedes the introduction on narrow screens and moves right on desktop. Its frame is a flat signal rectangle.
- Home actions follow the main introduction, before the supporting biography. They stack on narrow screens and sit side by side when space permits. Keep their labels intact.
- The hero ends with the latest launch, derived from the project list in [src/routes/+page.svelte](src/routes/+page.svelte). Avoid hand-written “right now” status lines on the home page; they go stale. Adding a `launched` date to a project updates the hero.
- Project cards and contact links become one column on narrow screens. Preserve their reading order.
- Contact links put the icon, label and arrow on one row, centred on the label's capitals, with the handle beneath the label. The icon's left edge meets the section's content edge; the link padding hangs outside it.
- Articles keep one reading column. Wide code and tables scroll inside their own frames; the page must not scroll sideways.

The home masthead holds the section navigation and the theme toggle; the archive and article headers place the toggle at the right end of their first row, level with the back link. On narrow screens the home toggle sits beside the eyebrow, above the navigation. The archive introduction and home contact section use signal surfaces; the background statement uses a dark panel. Keep these panels aligned with the page content. Article titles use the full header column with balanced wrapping; paragraph width remains limited by `--measure-prose`.

All structural surfaces and controls have square corners. The existing `--radius-*` names alias `--radius-square` for compatibility. Use the square token for new components.

The website keeps its no-line rule for layout separation: use space and surface shifts instead of decorative borders or dividers. Focus outlines, input boundaries and lines that explain a real diagram are allowed. Surfaces are flat. Do not add gradients, glows, glass, paper distress or decorative shadows.

## Components and states

| Component                  | Rule                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button` / `.ds-button`    | Primary: signal fill with ink text. Secondary: neutral fill with ink text. Tertiary: text with an underline on hover. All retain a visible focus outline and a distinct pressed state.                                                                                                                                                                                                                                                    |
| `Card`                     | Flat neutral rectangle with content-driven height. Only the project grid stretches cards to match a row. A linked card changes surface on hover/press and focuses as a whole. Project cards list their dates as labelled pairs with tabular figures, pinned to the foot of the card on fixed columns so they line up across a row whatever the description length. They carry no status label while every project shares the same status. |
| `Chip`                     | Compact rectangular label in sentence case. Neutral fills carry category information. Allow long labels to wrap.                                                                                                                                                                                                                                                                                                                          |
| `EditorialList`            | Open vertical rhythm with flat item surfaces. Focus outlines the whole linked item. Keep titles, summaries and metadata in a consistent order.                                                                                                                                                                                                                                                                                            |
| `WritingLink` / `PostMeta` | Shared by the home writing list, archive and article metadata. Keep the category in a chip; dates, reading time and publication stay plain. The entire writing row is one link.                                                                                                                                                                                                                                                           |
| `GhostInput`               | Retains its API and an ink-derived bottom boundary. The ink focus bar remains visible on paper. Pair the field with a real label; native disabled and validation semantics remain available.                                                                                                                                                                                                                                              |
| `InsightBlock`             | Signal rectangle with ink text and a condensed statement. Split into columns only when supporting context exists. Keep the panel level with its parent grid. Use it for an actual takeaway.                                                                                                                                                                                                                                               |
| `ThemeToggle`              | Text control with a Lucide moon or sun icon that names the theme it switches to. CSS picks the label from `[data-theme]`, so the first frame is correct before hydration. Its accessible name reads “Switch to dark theme” or “Switch to light theme”.                                                                                                                                                                                    |
| `.ds-evidence-strip`       | Level rectangular strip carrying concise scope or evidence. Use the parent panel’s contrasting strip color. Keep all qualifications visible.                                                                                                                                                                                                                                                                                              |

Buttons have a generous minimum height. Disabled buttons keep native disabled behavior and visibly reduce emphasis. For any new asynchronous control, keep its dimensions stable, name the pending action and expose completion or failure in text. Do not invent a form backend for a visual state.

Keep controls, article blocks, evidence strips and data panels level and aligned with the content grid.

Article quotations use a signal surface without an accent line. Code copy buttons show `Copy`, `Copied` or `Failed` in a stable-width control. Code and table frames accept keyboard focus for horizontal scrolling. Input labels and hints inherit the panel palette; hints describe the input without becoming part of its accessible name.

## Accessibility, assets and motion

Use WCAG 2.2 AA as the working baseline. Check actual foreground/background pairs, including hover and focus. Focus uses the shared ring width and offset: ink on paper or signal, signal on dark panels and throughout the dark theme. Keep the skip link, native links and buttons, document heading order and descriptive labels.

Body links stay underlined. Essential icons inherit `currentColor`. Use Lucide for interface icons; the existing social platform marks are an explicit identity exception and keep their proportions and ink treatment. Keep the portrait natural and preserve the original content of screenshots.

Motion uses the shared short durations and easing. Restrict it to state feedback and small directional cues. Respect `prefers-reduced-motion`: remove spatial movement while retaining clear color and focus feedback. Do not add ambient animation.

## Verification and maintenance

Run `bun run dev` for the local preview, then `bun run check`, `bun run lint` and `bun run build` after a shared-system change. Run the Svelte autofixer on changed Svelte components.

Review these cases with loaded fonts:

- Home at desktop and narrow widths: name, portrait, actions, project cards, writing expansion and contact links.
- `/blog/` and a long article: title wrapping, metadata, reading width, code toolbar and horizontal scrolling.
- Svelte error view and `/404.html`: matching type, palette, square controls and keyboard focus.
- Shared controls: default, hover, pressed, keyboard focus and disabled; input focus; all three panel modes.
- Both themes, with the OS set to light and to dark: toggling, reloading with a stored choice, and an OS change with no stored choice. Inspect signal surfaces in the dark theme in a production build (`bun run build && bun run preview`), because the development server does not lower `light-dark()`.
- Around the section-rail breakpoint and with reduced motion enabled: no clipped content or lost actions.

The page migration was reviewed on October 22, 2026. Visual checks covered the home page, archive and longest article at desktop and 390 px, the other four article headers at 390 px, both error views, and a temporary fixture for shared controls in all three panel modes. All nine routes were checked for overflow at 320, 390, 768, 1023, 1024 and 1440 px. Keyboard focus, the skip link, writing expansion, email resolution, code scrolling, copy success and failure, button states and reduced motion were exercised. The palette retains the foundation's measured ink/paper and ink/signal contrast ratios of 16.46:1 and 12.30:1. These checks do not constitute a full accessibility audit.

The dark theme was added on October 22, 2026. Visual checks covered the home page in both themes at 1440 and 390 px, the archive and a long article in both themes at desktop and in light at 390 px, article code frames and figures in the dark theme, and both error views in the dark theme. Toggling, stored and OS-driven themes, live OS changes, browser theme colors, keyboard focus on the toggle (signal on the dark page, ink in the signal hero) and the no-script state were exercised in Chromium. Computed colors for signal surfaces, including an injected article quotation with a link, bold text and inline code, were checked in the production preview in both themes. Home, archive and article showed no horizontal overflow at 320, 768, 1023 and 1024 px. Dark-theme contrast: paper on ink 16.46:1, muted text 7.71:1 on the card surface, signal emphasis 9.16:1 on the lifted dark panel. Firefox could not be launched in that environment and remains unchecked.

Keep exact values in the token file and load the same fonts in the app and standalone 404. Browser theme metadata in the layout and the 404 page pairs the paper token (light) with the ink token (dark), and [src/lib/theme.ts](src/lib/theme.ts) mirrors both values for a stored choice. The manifest keeps the paper token, since it has a single theme color. Update this contract when a shared role or rule changes. Record visual checks actually performed; a successful build alone does not establish visual quality.
