---
name: riceset
description: A precise, warm, and quietly personal portfolio and digital garden.
colors:
  rice-paper: "#faf8f8"
  card-paper: "#fdfcfc"
  mist-rule: "#e5e5e5"
  quiet-gray: "#b8b8b8"
  graphite-copy: "#4e4e4e"
  charcoal-ink: "#2b2b2b"
  muted-navy: "#284b63"
  sage-response: "#84a59d"
  soft-highlight: "#8f9fa926"
  marker-yellow: "#fff23688"
  night-paper: "#161618"
  night-rule: "#393639"
  night-muted: "#646464"
  night-copy: "#d4d4d4"
  night-ink: "#ebebec"
  night-link: "#7b97aa"
  night-marker: "#b3aa0288"
  media-white: "#ffffff"
  rail-glass: "#ffffffb8"
  rail-glass-border: "#ffffff99"
  night-rail-glass: "#161617b8"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, Times New Roman, serif"
    fontSize: "2.25rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Instrument Serif, Georgia, Times New Roman, serif"
    fontSize: "2rem"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "normal"
  title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.6rem"
    letterSpacing: "normal"
  label:
    fontFamily: "IBM Plex Mono, JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.74rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  code:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.9em"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  code: "5px"
  portrait: "6px"
  search: "7px"
  banner: "10px"
  card: "12px"
  rail: "1.5rem"
  circle: "50%"
  pill: "999px"
spacing:
  quarter: "0.25rem"
  half: "0.5rem"
  three-quarter: "0.75rem"
  base: "1rem"
  roomy: "1.5rem"
  section: "2rem"
  feature: "2.5rem"
  page-gutter: "clamp(1.5rem, 4vw, 5rem)"
components:
  article-card:
    backgroundColor: "{colors.card-paper}"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.base}"
  article-card-featured:
    backgroundColor: "{colors.card-paper}"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.section}"
  topic-chip:
    backgroundColor: "{colors.soft-highlight}"
    textColor: "{colors.muted-navy}"
    rounded: "{rounded.pill}"
    padding: "0.1rem 0.5rem"
  inline-search:
    backgroundColor: "{colors.rice-paper}"
    textColor: "{colors.graphite-copy}"
    rounded: "{rounded.pill}"
    padding: "0.72rem 0.95rem"
    height: "2.9rem"
  desktop-tool-rail:
    backgroundColor: "{colors.rail-glass}"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.rail}"
    padding: "1.75rem 0.75rem"
    width: "4.5rem"
    height: "calc(100vh - 2rem)"
  mobile-toolbar:
    backgroundColor: "{colors.rail-glass}"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.pill}"
    padding: "0.4rem 0.85rem"
  icon-control:
    backgroundColor: "transparent"
    textColor: "{colors.charcoal-ink}"
    size: "1.75rem"
    height: "1.75rem"
    width: "1.75rem"
  portrait:
    backgroundColor: "{colors.mist-rule}"
    rounded: "{rounded.portrait}"
---

# Design System: riceset

## Overview

**Creative North Star: "The Cross-Cultural Field Notebook"**

riceset should feel like a field notebook kept by a thoughtful engineer: orderly enough to scan quickly, personal enough to reward a slower read, and specific enough that the author is always present. Its visual voice is precise, warm, and quietly personal. Editorial type, real project imagery, compact metadata, hand-drawn marks, and restrained technical details carry the Japanese-Brazilian and software-craft story without turning it into decoration.

The system is calm but not anonymous. Instrument Serif provides a literary surface for names, article titles, and reflective statements. Poppins keeps explanations approachable. Bricolage Grotesque gives technical headings a firm shape, while mono labels organize dates, locations, and section numbers like annotations in a working notebook. Muted navy and sage are used sparingly so photographs, organization marks, and writing remain the visual focus.

The home page is a broad, image-supported portfolio canvas. Long-form articles are narrow reading surfaces with a persistent tool rail. Desktop pages use fluid outer gutters and keep the rail anchored near the viewport edge; article prose stays capped at 720px. At widths below 1200px the desktop rail becomes a compact floating toolbar, and composed two-column sections collapse when their content needs a single reading order.

**Key Characteristics:**

- Warm off-white and near-black surfaces instead of pure neutral page backgrounds.
- A deliberate serif, sans, and mono hierarchy with distinct jobs for each family.
- Real portraits, organization marks, article covers, and project imagery rather than decorative filler.
- Thin rules, compact metadata, and generous 2rem section intervals for editorial rhythm.
- Small, tactile rotations on hover, never constant spectacle.
- Light and dark themes that preserve the same hierarchy and reading comfort.
- A 720px long-form measure and fluid home-page canvas up to 100rem.
- Visible keyboard focus and reduced-motion fallbacks for every animated control.

**The Content-First Rule.** Every visual decision must make the work, writing, or personal story easier to understand. If an effect competes with the content, remove it.

**The Two-Surface Rule.** Home pages may use the wide portfolio canvas. Articles must remain a focused 720px reading surface with the utility rail outside the prose measure.

**The Real-Evidence Rule.** Prefer a real project image, organization mark, portrait, date, or outcome over a decorative graphic or unsupported claim.

## Colors

The palette resembles warm paper, charcoal drawing ink, blue-gray annotations, and a quiet sage response state. The YAML tokens above are normative and define both themes.

### Primary

- **Muted Navy** (`muted-navy`): Primary link and action color in the light theme. It should identify navigable text without overpowering headings or imagery.
- **Night Link** (`night-link`): Dark-theme counterpart to Muted Navy. It carries the same semantic role with enough luminance against Night Paper.

### Secondary

- **Sage Response** (`sage-response`): Hover, focus, and selection response. Its rarity is important; it should read as feedback rather than branding spread across the page.

### Tertiary

- **Soft Highlight** (`soft-highlight`): Low-opacity blue-gray wash for internal links, tags, selected fragments, and subtle grouped information.
- **Marker Yellow** (`marker-yellow`) and **Night Marker** (`night-marker`): Text-selection and explicit highlight colors. They evoke a physical highlighter and should never become large surface fills.

### Neutral

- **Rice Paper** (`rice-paper`): Primary light-theme canvas. It is warm enough to avoid a clinical white page.
- **Card Paper** (`card-paper`): Near-white article-card surface, just distinct from Rice Paper.
- **Mist Rule** (`mist-rule`): Dividers, outlines, quiet borders, and image rings.
- **Quiet Gray** (`quiet-gray`): Timestamps, locations, inactive controls, and supporting labels.
- **Graphite Copy** (`graphite-copy`): Default light-theme body copy.
- **Charcoal Ink** (`charcoal-ink`): Light-theme titles, icons, and strongest text.
- **Night Paper** (`night-paper`): Primary dark-theme canvas.
- **Night Rule** (`night-rule`): Dark-theme dividers and borders.
- **Night Muted** (`night-muted`): Dark-theme low-emphasis text.
- **Night Copy** (`night-copy`): Default dark-theme body copy.
- **Night Ink** (`night-ink`): Dark-theme headings and strongest icons.
- **Media White** (`media-white`): A controlled white field used only behind organization logos that require their original light artwork.
- **Rail Glass**, **Rail Glass Border**, and **Night Rail Glass**: Semi-transparent utility-rail surfaces. These are functional overlays, not a general card treatment.

### Named Rules

**The Ink Hierarchy Rule.** Use the strongest ink for headings and icons, body graphite for prose, and muted gray only for metadata. Never flatten all text into one gray.

**The Quiet Accent Rule.** Muted Navy identifies navigation. Sage Response identifies interaction. Neither color should occupy a large decorative area.

**The Paper, Not White Rule.** Page backgrounds use Rice Paper or Night Paper. Pure white is reserved for media assets that need it.

## Typography

- **Display Font:** Instrument Serif (with Georgia and Times New Roman fallbacks)
- **Body Font:** Poppins (with the system sans-serif stack)
- **Heading Font:** Bricolage Grotesque (with the system sans-serif stack)
- **Label/Mono Font:** IBM Plex Mono, falling back to JetBrains Mono
- **Code Font:** JetBrains Mono (with the system monospace stack)
- **Japanese Support:** LINE Seed JP and Noto Sans JP, followed by native Japanese system fonts
- **Signature Font:** La Belle Aurore, used only for the handwritten sign-off

**Character:** Instrument Serif makes the site feel reflective and human without weakening its technical confidence. Poppins and Bricolage Grotesque keep dense information clear, while mono labels behave like precise marginal notes. The families are not interchangeable; each one carries a specific layer of the voice.

### Hierarchy

- **Display** (400, 2.25rem, 1): Home wordmark and the largest identity moment. Use tight tracking at `-0.02em`.
- **Headline** (400, 2rem, 1.12): Article titles and reflective home-page statements. Featured-card titles may scale fluidly from 1.6rem to 2.05rem. Italic is reserved for personal, reflective copy such as the About statement.
- **Section Title** (700, 1.4rem, 1.4): Technical and article section hierarchy in Bricolage Grotesque.
- **Item Title** (600, 1.05rem, 1.4): Experience roles, schools, awards, talks, and similarly compact records.
- **Body** (400, 1rem, 1.6rem): Long-form prose. Articles must stay within a 720px measure, approximately 65 to 75 characters for typical paragraphs.
- **Compact Body** (400, 0.85rem to 0.95rem, 1.4 to 1.75): Portfolio descriptions, organizations, summaries, and supporting narrative.
- **Label** (400, 0.74rem, 1.4): Uppercase section numbers and metadata. Keep it short and structural.
- **Card Metadata** (600, 0.68rem, 1.4): Uppercase article tags and dates with `0.065em` letter spacing.
- **Code** (400, 0.9em, 1.6): Inline code and fenced examples only.
- **Japanese Name Detail** (400, 0.5em of the surrounding name): A compact bilingual annotation aligned optically with the Latin display name.

### Named Rules

**The Assigned-Family Rule.** Instrument Serif tells the story, Poppins explains it, Bricolage Grotesque structures it, and mono type annotates it. Do not substitute one role for another without a specific reason.

**The Short-Label Rule.** Uppercase mono styling is permitted only for short section chrome, dates, tags, and status text. Never set body copy in uppercase.

**The Reading-Measure Rule.** Long-form prose never exceeds 720px. Wider space belongs to imagery and portfolio composition, not longer lines.

## Elevation

The system is flat by default. Depth appears only where a surface must remain spatially separate from scrolling content: the floating rail, mobile toolbar, search field, and search results. Article cards use a thin border and tiny rotational movement rather than a resting shadow. Tonal layering and hairline rules should solve most grouping needs.

### Shadow Vocabulary

- **Rail Ambient:** `inset 0 1px 0 rgba(255,255,255,0.7), 0 8px 32px rgba(27,33,48,0.12)`. Use only for the floating desktop rail and mobile toolbar in light mode.
- **Rail Night:** `inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.45)`. Dark-theme counterpart to Rail Ambient.
- **Search Rest:** `0 1px 2px rgba(27,33,48,0.05)`. Barely visible separation for the inline search shell.
- **Search Focus:** `0 6px 18px rgba(27,33,48,0.06)`. Appears when the inline search field contains focus.
- **Search Panel:** `0 14px 34px rgba(27,33,48,0.08)`. Separates search results from the page beneath them.
- **Search Modal:** `0 14px 50px rgba(27,33,48,0.12), 0 10px 30px rgba(27,33,48,0.16)`. Reserved for the full search overlay.

### Named Rules

**The Flat-by-Default Rule.** Standard content and article cards do not receive shadows. Use a 1px rule, a tonal shift, or whitespace first.

**The Floating-Utility Rule.** Blur and ambient shadows are reserved for persistent utility surfaces that sit above scrolling content. Never spread the glass treatment to content cards.

**The Soft-Depth Test.** If a shadow edge is clearly traceable, it is too sharp or too dark for this system.

## Components

### Desktop Tool Rail

- **Character:** A quiet, persistent strip of personal identity and utilities.
- **Geometry:** Fixed visual width of 4.5rem inside a 6rem grid track, height `calc(100vh - 2rem)`, 1rem viewport inset, and 1.5rem corners.
- **Surface:** Rail Glass with a subtle white border and Rail Ambient shadow. Dark mode uses Night Rail Glass and Rail Night.
- **Layout:** Logo at the top. Theme toggle, divider, and social links form the bottom cluster. Each icon uses a 1.75rem box; the line-art logo is optically enlarged to 2.1rem.
- **Behavior:** The rail is sticky. On wide displays the outer page is uncapped so the rail remains anchored near the viewport edge. Social icons rotate `-10deg` on hover and scale to `0.9` on activation.

### Mobile Toolbar

- **Character:** The desktop rail compressed into one calm floating capsule.
- **Geometry:** Sticky at 0.75rem from the top with `0.4rem 0.85rem` padding and pill corners.
- **Layout:** Logo and wordmark begin the row. Theme toggle is pushed to the far edge. Desktop-only social links disappear.
- **Surface:** Uses the same theme-aware glass colors and shadows as the desktop rail.

### Theme Toggle and Icon Links

- **Shape:** Transparent icon controls with no resting border. Desktop controls use a 1.75rem box; home-page controls use a 2rem circular hit area.
- **Icon:** 18px to 20px line icons using current text color.
- **Hover:** Home social icons may receive the page surface and rotate `-10deg`. Rail icons remain visually transparent and rotate only where specified.
- **Focus:** Use a 2px Sage Response or Muted Navy outline with 2px to 3px offset.
- **Theme Motion:** Sun and moon crossfade and rotate over 0.32s to 0.45s. Reduced motion collapses this to a 0.05s opacity change with no transform.

### Home Banner and Identity Block

- **Banner:** Full width, 160px high on larger screens and 120px on narrow screens, using Mist Rule with 10px corners.
- **Identity:** The 88px circular portrait overlaps the banner through a negative top margin; it shrinks to 72px on mobile.
- **Wordmark:** Instrument Serif at 2.25rem with `-0.02em` tracking.
- **Motion:** The mark performs a slow, restrained nod. Disable the animation when reduced motion is requested.

### Portfolio Records

- **Character:** Resume information presented as a curated sequence, not a dense resume wall.
- **Structure:** Circular organization badge, strong 1.05rem title, organization line, compact metadata, and an optional 0.85rem description.
- **Spacing:** Items are normally separated by 1.2rem to 1.5rem. Internal title-to-meta spacing stays between 0.1rem and 0.4rem.
- **Logo Badge:** White circular field with a 1px Mist Rule border. Preserve each organization mark's native proportions.
- **Nested Relationships:** Use a dotted vertical connector when an experience belongs under a parent organization.

### Article Cards

- **Character:** Compact editorial previews with enough image presence to make each piece specific.
- **Shape:** 12px corners, Card Paper surface, and a 1px low-contrast border. Dark mode uses a tonal mix of Night Rule and Night Paper.
- **Grid:** Standard cards form two columns and collapse to one below 620px. The featured card uses a 1.12fr to 0.88fr text-image split and stacks text before image on small screens.
- **Content:** Standard padding is 1rem; featured padding is 2rem. Metadata is compact uppercase. Titles use Instrument Serif. Excerpts use 0.8rem Poppins with 1.62 line height.
- **State:** Rotate only `-0.6deg` on fine-pointer hover. Use a Muted Navy border for `focus-within`. The full card is clickable through the title link.
- **Placeholder:** Empty grid slots use a dashed, translucent rule and must not react to pointer input.

### Search

- **Inline Field:** Pill shell, 2.9rem minimum height, `0.72rem 0.95rem` padding, 1px Mist Rule border, and Search Rest shadow.
- **Input:** Poppins at no less than 16px on mobile to prevent browser zoom. Placeholder text uses Quiet Gray.
- **Results:** The panel shares the field's rounded geometry, expands beneath it, and uses Search Panel elevation. Result rows are separated by hairlines and use a tinted highlight on hover or keyboard focus.
- **Full Overlay:** Use the stronger Search Modal elevation only for the viewport-level search experience.
- **Focus:** The input itself remains visually clean; `focus-within` lifts the containing shell. Standalone search buttons use a 2px Sage Response outline.

### Topic Chips

- **Shape:** Fully rounded pill with `0.1rem 0.5rem` padding.
- **Color:** Soft Highlight background and the theme's link color.
- **Typography:** 0.75rem compact body text. Chips label topics; they are not generic decoration.

### Long-Form Article

- **Measure:** 720px maximum on desktop, centered independently from the tool rail.
- **Title:** Instrument Serif at 2rem. Section headings return to Bricolage Grotesque.
- **Body:** Poppins with 1.6rem line height and Graphite Copy or Night Copy.
- **Media:** Images fill the available article width, use 5px corners, and retain useful alternative text.
- **Code:** JetBrains Mono on a theme-aware rule-colored surface with 5px corners.
- **Links:** Muted Navy by default, Sage Response on hover, with subtle internal-link highlighting.

### About Portrait and Signature

- **Layout:** Portrait and copy use a 0.82fr to 1.18fr grid with a 2rem gap, collapsing below 620px.
- **Portrait:** 4:5 crop with 6px corners and no decorative shadow.
- **Statement:** Instrument Serif italic at 2rem and 1.12 line height.
- **Signature:** La Belle Aurore plus the hand-drawn logo mark. Keep it small, slightly rotated, and low contrast; it is a sign-off, not a second logo lockup.

## Do's and Don'ts

### Do:

- **Do** lead with the personal thread connecting identity, technology, and craft.
- **Do** show real work and specific outcomes through project imagery, organization marks, dates, and descriptive writing.
- **Do** keep long-form articles at a maximum width of 720px and body copy near 65 to 75 characters per line.
- **Do** keep the desktop tool rail near the viewport edge by leaving article and tag page shells uncapped above the 1200px breakpoint.
- **Do** use the 0.25rem to 2.5rem spacing vocabulary, with 2rem as the standard section boundary.
- **Do** preserve the distinct jobs of Instrument Serif, Poppins, Bricolage Grotesque, and mono labels.
- **Do** preserve meaningful image crops and provide descriptive alternative text.
- **Do** use visible 2px focus outlines and verify keyboard operation for links, theme controls, pagination, search, and graph triggers.
- **Do** preserve light and dark theme parity, including logos, borders, muted text, overlays, and focus states.
- **Do** honor `prefers-reduced-motion` for nodding, flipping, rotating, and theme-transition effects.
- **Do** keep the handcrafted identity consistent across the wordmark, line icons, signature, and interaction details.

### Don't:

- **Don't** use generic developer portfolio templates. Every major surface must carry riceset's specific identity, evidence, and editorial rhythm.
- **Don't** use loud self-promotion. Let concrete projects, roles, awards, and writing establish credibility.
- **Don't** create dense resume walls. Preserve organization marks, grouping, compact metadata, and breathing room between records.
- **Don't** build decorative card grids. Cards are reserved for article previews and search results where they clarify a repeated content type.
- **Don't** add effects that compete with the content. Remove any animation, blur, shadow, or rotation that draws attention away from the work.
- **Don't** spread glassmorphism beyond the floating rail, mobile toolbar, and search surfaces.
- **Don't** use pure white as the page canvas; reserve Media White for organization logos that require it.
- **Don't** use Sage Response as a large fill or a decorative accent. It exists primarily for interaction feedback.
- **Don't** set paragraphs or long labels in uppercase mono type.
- **Don't** add shadows to ordinary article cards, portfolio records, portraits, or prose containers.
- **Don't** use a colored side stripe thicker than 1px on cards, lists, callouts, or alerts.
- **Don't** use gradient text, decorative metric heroes, nested cards, or repeated icon-above-heading tiles.
- **Don't** hide focus indicators or rely on hover as the only way to reveal an action.
- **Don't** allow browser width, zoom, or display scaling to detach the utility rail from the viewport edge again.
