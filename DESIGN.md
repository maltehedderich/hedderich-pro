# Design System Documentation

## 1. Overview & Creative North Star

This design system is built for the SaaS founder who believes that clarity is a competitive advantage. Inspired by the "substance over style" ethos of Derek Sivers and the functional brutalism of 37signals, the system rejects ornamental noise in favor of editorial precision.

**Creative North Star: The Digital Curator**
The aesthetic is rooted in the concept of a high-end gallery or a modern architectural blueprint. It moves beyond the "standard SaaS template" by utilizing intentional asymmetry, extreme typographic scales, and a "No-Line" philosophy. The goal is to make the founder’s thoughts feel like a definitive record—credible, personal, and intellectually sharp. We achieve this not through shadows and borders, but through the mastery of whitespace and tonal depth.

---

## 2. Colors

The palette is intentionally restrained to maintain focus on the content. We use a high-contrast monochromatic base with a single, sophisticated accent color (`#FBC75D`) to denote value and interaction.

### The Palette

- **Primary/Accent:** `#7b5900` (Primary) and `#fbc75d` (Container). This is used surgically for calls to action or to highlight key insights.
- **Neutral Base:** `#0A141F` (On-Surface) for authoritative text and `#f8f9ff` (Background) for a crisp, airy environment.
- **Surface Hierarchy:** We utilize the `surface-container` tiers to define information density.

### The "No-Line" Rule

**Explicit Instruction:** Prohibit the use of 1px solid borders for sectioning or containment. Boundaries must be defined solely through background color shifts. For example, a "Related Articles" section should be placed on a `surface-container-low` background to distinguish it from the `surface` main body. This creates a seamless, modern flow that feels designed, not "assembled."

### Signature Textures

To avoid a "flat" or clinical feel, use subtle gradients for primary CTAs, transitioning from `primary` to `primary_container`. For hero sections, a very faint radial gradient starting from `surface_container_low` at the top left to `surface` at the bottom right adds "soul" and professional polish.

---

## 3. Typography

Typography is the backbone of this system. We use **Inter**—a sophisticated system font—but we treat it with editorial intent.

- **Display (Large/Medium):** Used for big ideas and provocative statements. Set with tight letter-spacing (-0.02em) to feel like a premium broadsheet.
- **Headline & Title:** These levels establish the voice. Use `headline-lg` for section headers with generous top-padding to let the subject breathe.
- **Body (Large/Medium):** The workhorse. We prioritize legibility with a generous line-height (1.6) to mimic the reading experience of a well-designed book.
- **Label (Small/Medium):** Used for metadata, tags, and micro-copy. These are often set in `on_surface_variant` to recede visually, ensuring they don't compete with primary thoughts.

**The Hierarchy Goal:** The scale should be dramatic. A jump from a `display-lg` quote to a `body-md` explanation creates a rhythmic cadence that guides the reader through the founder's narrative.

---

## 4. Elevation & Depth

In this system, depth is a product of **Tonal Layering**, not structural lines.

- **The Layering Principle:** Stacking is the new bordering. Place a `surface-container-lowest` card (pure white) on a `surface-container-low` section to create a soft, natural lift. This mimics the physical layering of fine paper.
- **Ambient Shadows:** When a floating effect is required (e.g., a mobile navigation menu), use an extra-diffused shadow.
  - _Specs:_ `0px 20px 40px rgba(10, 20, 31, 0.05)`.
  - The shadow color must be a tinted version of `on-surface` at 5% opacity, never a generic grey.
- **The "Ghost Border" Fallback:** If a border is required for accessibility in input fields, use the `outline_variant` token at **20% opacity**. 100% opaque borders are strictly forbidden.
- **Glassmorphism:** For persistent elements like a "Back to Top" button or a floating Header, use `surface` colors with a 70% opacity and a `20px` backdrop-blur. This allows the founder's content to bleed through, making the UI feel integrated and premium.

---

## 5. Components

### Buttons

- **Primary:** High-contrast `primary` background with `on_primary` text. No border. Slightly rounded (`0.375rem`) to feel modern but stable.
- **Secondary:** `surface_container_high` background. This variant is for secondary actions that shouldn't distract from the main narrative.
- **Tertiary:** Text-only with an underline appearing only on hover. Use for "Read More" links within body text.

### Chips (Labels)

- Used for categorizing blog posts or projects.
- **Style:** `surface_container_highest` with `on_surface_variant` text. Use the `full` roundedness scale to distinguish them from structural buttons.

### Lists & Cards

- **Strict Rule:** No divider lines. Separate list items using `body-md` spacing (vertical whitespace).
- For cards, use a `surface-container-lowest` background. To indicate interactivity, shift the background to `surface-container-high` on hover.

### Input Fields

- **Style:** Minimalist. Only a bottom "Ghost Border" (low opacity `outline_variant`). When focused, the accent color (`primary`) should animate in from the center.

### Signature Component: The "Insight Block"

A custom component for this system. A large-scale quote or key takeaway using `headline-md`, positioned asymmetrically (e.g., 60% width, pulled to the left) with a `primary` vertical accent bar on the far left.

---

## 6. Do's and Don'ts

### Do

- **Use Asymmetry:** Place your main text column slightly off-center to the left to create a sophisticated, editorial layout.
- **Embrace Whitespace:** If you think there is enough space between sections, double it. Space is what makes the design feel "premium."
- **Focus on Typography:** Let the font do the heavy lifting. Use bold weights for emphasis instead of colors or boxes.

### Don't

- **Don't Use Dividers:** Never use a horizontal rule (`
`) or 1px border to separate content. Use a change in background tone or increased vertical padding.

- **Don't Use Pure Black Shadows:** Shadows should always be a faint, tinted reflection of the dark navy `on-surface` color.
- **Don't Overuse the Accent:** The gold/amber color (`#FBC75D`) is a high-potency tool. Use it only for things that require immediate action or represent a core insight.
- **Don't Center-Align Large Blocks of Text:** For intellectual clarity, keep body text left-aligned for better readability. Only center-align `display` type for poetic emphasis.
