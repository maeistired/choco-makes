---
name: Choco Makes
description: Small-batch handmade notebooks and clicker fidgets, ordered by sending a numbered sheet straight to the maker.
colors:
  paper: "#F5F4F7"
  sheet: "#FFFFFF"
  ink: "#25232C"
  ink-soft: "#55515F"
  rule: "#DEDBE4"
  rule-strong: "#25232C"
  cloth-lilac: "#B9A6E0"
  cloth-pink: "#E6B6C6"
  cloth-blue: "#B3D0E5"
  cloth-stone: "#D7D3DD"
  copy-pink: "#F1C9D6"
  copy-blue: "#C6DFEE"
  error: "#A3253F"
  ok: "#2F5D46"
typography:
  display:
    fontFamily: "Castoro, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2.125rem, min(3.2vw, 5.4vh), 3rem)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Castoro, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2rem, 3vw, 2.75rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Castoro, Iowan Old Style, Georgia, serif"
    fontSize: "1.375rem"
    fontWeight: 400
    lineHeight: 1.2
  lead:
    fontFamily: "Castoro, Iowan Old Style, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "Hanken Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Hanken Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.55
    fontFeature: "\"tnum\""
rounded:
  none: "0px"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "24px"
  s6: "32px"
  s7: "48px"
  s8: "64px"
  s9: "96px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "#3A3744"
  button-primary-active:
    backgroundColor: "#000000"
  button-small:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "40px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "40px"
  button-quiet-hover:
    backgroundColor: "{colors.sheet}"
  button-disabled:
    backgroundColor: "{colors.rule}"
    textColor: "{colors.ink-soft}"
  paper-label:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
  variant-chip:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "36px"
  product-tag:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "2px 8px"
  text-input:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "44px"
  order-slip-bar:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    height: "68px"
---

# Design System: Choco Makes

## Overview

**Creative North Star: "The Bookbinder's Order Book"**

A quiet stationery boutique. The pastels are not paint on the page; they are linen-weave bookbinding cloth, laid down as discrete surfaces on a cool, almost-white paper ground and written over in charcoal ink. Names sit on small white paper labels tipped onto the cloth. Ordering happens on a numbered carbon-copy order slip that docks slim at the bottom edge and unfolds upward into the full sheet, its pink and blue duplicate copies fanning out beneath it.

The register is classy and familiar: a standard shop layout (header, intro, product grid, updates, about, footer) with no novelty navigation. Density is calm. Colour arrives in tiles, never in floods, so the page reads as cool paper with a few swatches of cloth on it. A literary serif speaks for names, headings and totals; a plain grotesk handles every working word (prices, counts, buttons, fields). The system rejects the pastel-gradient cutesy shop, wall-to-wall pink and purple, die-cut sticker motifs, and the always-open cart sidebar; it must not read as made for children or for one gender.

Motion is paper-weight: short, eased with a long-tail out curve, never bouncy. There is one orchestrated arrival on load and one signature unfold for the order sheet. With reduced motion requested, everything is instant.

**Key Characteristics:**
- Cool paper ground, charcoal ink, book-cloth colour only as bounded surfaces.
- Linen-weave texture over every cloth surface; flat paper everywhere else.
- Square corners throughout; hairline rules do the structural work.
- White tipped-on paper labels are the only lifted objects at rest.
- Charcoal solid buttons; one quiet outlined variant.
- Serif for names and headings, grotesk for everything operational, tabular figures for every number.
- A docked order slip with tinted duplicate copies as the signature component.

## Colors

A restrained neutral ink-on-paper system carrying four linen book-cloth hues (lilac primary, pink secondary, light blue accent, stone neutral) and two paler duplicate-copy tints.

### Primary
- **Lilac Book Cloth** (`cloth-lilac`): the owner's primary colour. The default cloth behind products and the intro feature panel. Also the text-selection highlight and the scrollbar thumb.

### Secondary
- **Rose Book Cloth** (`cloth-pink`): an alternate product tile cloth and the single About swatch that carries the facts label.

### Tertiary
- **Pale Sky Book Cloth** (`cloth-blue`): an alternate product tile cloth.
- **Duplicate Pink** (`copy-pink`) and **Duplicate Blue** (`copy-blue`): the two carbon-copy sheets stacked under the order slip. Used nowhere else.

### Neutral
- **Cool Paper** (`paper`): page ground. Also the stepper hover fill and the order-sent confirmation panel.
- **Sheet White** (`sheet`): paper labels, product tags, variant chips, inputs, the About band, the slip bar and the unfolded sheet.
- **Charcoal Ink** (`ink`): all primary text, primary buttons, focus outlines, the slip's top edge.
- **Graphite** (`ink-soft`): secondary text (ledes, descriptions, meta, notes, hints), input borders, disabled button text.
- **Hairline** (`rule`): dividers between list rows, chip and icon-button borders, masthead and footer edges.
- **Heavy Rule** (`rule-strong`): same value as ink; the 1px rule under section heads, above facts, and above the grand total.
- **Stone Book Cloth** (`cloth-stone`): the neutral cloth option for products that should not read as coloured.
- **Oxblood** (`error`) and **Bottle Green** (`ok`): validation errors and remove-hover; bundle savings and success status. Text only.

### Named Rules
**The Cloth Is a Surface Rule.** Book-cloth colours appear only as bounded rectangles: product tiles, one intro feature panel, one About swatch. They are never page fill, section backgrounds, text colour, or button colour.

**The Cloth Carries Linen Rule.** Every cloth surface layers the procedural linen overlay (`assets/img/linen.png`, 240px tile, generated by `tools/linen-generator.py`) over its colour. Flat pastel blocks are not cloth.

**The Ink Does the Talking Rule.** Interactive emphasis is charcoal, never a pastel. Buttons, selected chips, focus rings and the slip edge are all ink.

## Typography

**Display Font:** Castoro (with Iowan Old Style, Georgia, serif), self-hosted, regular weight only.
**Body Font:** Hanken Grotesk (with system-ui, -apple-system, Segoe UI, sans-serif), self-hosted variable 400 to 700.

**Character:** a bookish, slightly old-style serif for anything with a name, set at weight 400 and tightened slightly at large sizes, against a clean, neutral grotesk that does the shop's arithmetic.

### Hierarchy
- **Display** (400, clamp(2.125rem, min(3.2vw, 5.4vh), 3rem), 1.06, -0.02em, balanced wrap): the single intro headline.
- **Headline** (400, clamp(2rem, 3vw, 2.75rem), 1.1, -0.015em): section heads (Shop, Updates, About). The unfolded sheet title uses 2rem.
- **Title** (400, 1.375rem, 1.2): product names, paper-label names, the slip title. Category heads step up to 1.625rem; order lines step down to 1.125rem.
- **Lead** (serif 400, 1.5rem, 1.4): the About lead sentence and the grand total. Update notes use the same voice at 1.25rem/1.45, max 60ch.
- **Body** (grotesk 400, 1rem, 1.55): running text. The intro lede is 1.125rem, max 46ch; secondary copy is 0.9375rem in Graphite, max 40 to 62ch.
- **Label** (grotesk 600, 0.875rem): prices, dates, field labels, fact terms, stock counts, order numbers. Legends and small meta drop to 0.8125rem; product tags are 0.75rem with 0.02em tracking.

### Named Rules
**The Named Things Are Serif Rule.** Products, sections, the wordmark, the sheet, and totals speak in Castoro. Prices, counts, controls and fields speak in Hanken Grotesk.

**The Honest Figures Rule.** Every price, count, date, total and order number sets tabular numerals (`font-variant-numeric: tabular-nums`).

**The No-Shouting Rule.** No uppercase runs and no wide tracking. Emphasis comes from weight 600 or the serif, never from case.

## Layout

A centred column of max 1296px plus a fluid gutter (clamp(20px, 5vw, 72px)) on each side. The spacing scale is 4, 8, 12, 16, 24, 32, 48, 64, 96px, used throughout; section ends breathe at 96px.

Two-column splits use a 5:7 ratio (intro copy to feature panel; About side to body; the sheet reverses this to 7:5 for lines to form). Section heads sit on a heavy 1px rule with the title left and an optional note right, baseline-aligned. The product grid auto-fills columns of at least 260px with 48px row and 24px column gaps (four across at full width); product actions pin to the card bottom so buttons align across a row. Updates and facts are ruled rows with a fixed label column (11rem and 9rem).

The order slip is fixed to the bottom edge at 68px (72px under 640px) and the body reserves that height plus the safe-area inset.

Responsive behaviour: at 960px and below the 5:7 splits collapse to one column (About body moves above the swatch).

Phones (640px and below) are the market first impression, so the first viewport leads with product: the feature photo runs edge to edge at 16:9 (2:1 when the screen is 700px tall or less) above a 1.75rem headline, and a **section shelf** replaces "Browse the shop". The shelf is three equal Sheet White tiles: serif section name, Graphite count, and an 8px strip of the section's book cloth (from its first product) along the top edge, linking to each shop section plus Custom orders. The shop grid is one column with 3:2 photo tiles and descriptions shown. Name and price share the first row; a bundle deal sits below as a small Sheet White tag with a hairline border and Bottle Green text. Photo carousels drop their arrow buttons for swipe, with the next photo peeking 32px; the count is a small white paper tag. Chips, actions and the sheet's stepper/remove are at least 44px. "Add to sheet" briefly becomes an outlined "✓ Added to your sheet" (1.6s). Order lines restack into a two-row grid. Gutters respect safe-area insets (`viewport-fit=cover`).

Photos ship at 1600px with 800px copies in `assets/img/products/800/` (written by `tools/build_shop.py`), chosen by `srcset`. Wide but short screens (above 960px wide, at most 940px tall) flatten product tiles to 2:1 and trim the intro so the first product row clears the slip.

## Elevation & Depth

Flat paper by default. Depth is reserved for paper objects that physically sit on cloth or rise over the page: soft, low, ink-tinted shadows, never hard offsets and never on buttons, chips or cards.

### Shadow Vocabulary
- **Tipped label** (`box-shadow: 0 1px 2px rgba(37, 35, 44, 0.12), 0 6px 14px -8px rgba(37, 35, 44, 0.3)`): white paper labels on cloth.
- **Object on cloth** (`box-shadow: 0 2px 3px rgba(37, 35, 44, 0.12), 0 24px 34px -20px rgba(37, 35, 44, 0.45)`): the placeholder object standing on a product or feature cloth.
- **Sheet over page** (`box-shadow: 0 -18px 40px -24px rgba(37, 35, 44, 0.35)`): the unfolded order sheet casting upward onto the page.

The slip's duplicate copies create depth by stacking offset tinted sheets (5px and 10px up at rest, fanning to 7px/6px and 14px/12px when open), not by shadow.

### Named Rules
**The Only Paper Lifts Rule.** A shadow means "a sheet of paper is sitting on something." Buttons, chips, inputs and product cards stay flat.

## Shapes

Square corners everywhere (0px): buttons, chips, inputs, labels, tiles, panels, the sheet. Structure comes from 1px hairlines in `rule` and 1px heavy rules in `ink`, never from boxes with radius. Selected state thickens a hairline to a doubled ink edge (1px border plus 1px inset). Cloth tiles are 3:2 rectangles (4:3 on phones, 2:1 on wide-short screens); the feature panel is 7:3.2 (4:3 under 960px). Icons are 1.75px-stroke line drawings with round caps, 16 to 20px.

## Components

### Buttons
Solid, square, confident ink blocks.
- **Shape:** square (0px), 1px ink border.
- **Primary:** charcoal fill, paper text, weight 600, 48px tall, 24px side padding. Optional trailing line icon at 18px with 8px gap.
- **Hover / Active / Focus:** hover lifts to a slightly lighter charcoal, active drops to black, 160ms colour transition. Focus is a 2px ink outline offset 3px.
- **Small:** 40px tall, 16px padding, 0.9375rem; used on product cards and the interest form.
- **Quiet:** transparent fill with the same ink border and ink text; hover fills Sheet White. Used for the secondary action (Notify me).
- **Disabled:** hairline fill and border, Graphite text, not-allowed cursor.
- **Icon button:** 44px square, transparent, hairline border that turns ink on hover.

### Chips (variant selector)
- **Style:** Sheet White fill, 1px hairline border, 0.875rem grotesk, 36px tall, 12px side padding, wrapping with 8px gaps under a 0.8125rem/600 legend.
- **State:** hover darkens the border to Graphite; selected becomes a doubled ink edge; sold-out variants keep the chip but set Graphite text with a 1px strike-through. Native radio inputs sit invisibly over each chip.

### Cards / Containers (product)
- **Corner Style:** square.
- **Background:** a 3:2 book-cloth tile (per-product `cloth` field: lilac, pink, blue or stone) with linen texture, holding the photo or a placeholder object; the card body below sits directly on the page with no box.
- **Shadow Strategy:** none on the card; only the paper objects on the cloth lift.
- **Border:** none.
- **Internal Padding:** 16px above the body; name, price, description, variants, stock, actions stack on 8 to 16px steps.
- **Tags:** small white paper tags pinned 12px inside the tile corners (category left, Sample right).
- **Sold out:** the cloth is veiled with 50% Cool Paper and a tipped serif label reads the sold-out line at centre.

### Paper Label (signature)
A white tipped-on label: Sheet White, 12px by 16px padding, the tipped-label shadow, serif title-size name over a Graphite tabular meta line. Sits bottom-left 24px inside the feature panel, carries the sold-out notice on a tile, and holds the facts list on the About swatch.

### Inputs / Fields
- **Style:** Sheet White fill, 1px Graphite border, square, 44px tall, 12px side padding, 1rem text. Label above in 0.875rem/600; hint below in 0.8125rem Graphite.
- **Focus:** border turns ink plus a 2px ink outline flush to the edge.
- **Error:** border and a 0.8125rem/600 message in Oxblood, tied with aria-describedby.

### Navigation
Serif wordmark (1.875rem, 1.5rem on phones) left; three grotesk links at weight 500 right, underline on hover only. The masthead is 76px (64px on phones) over a hairline. No sticky header; the order slip is the only fixed element.

### Order Slip and Sheet (signature)
- **Docked slip:** a full-width Sheet White bar fixed to the bottom with a 1px ink top edge. Left: serif "Order sheet" plus a grotesk order number (e.g. No. 1115-94Q) in Graphite. Right: a tabular summary (items · bold total · CAD) and a charcoal "Review & send" button whose chevron rotates 180° when open. Two tinted duplicate copies (pink, then blue) peek 5px and 10px above the bar.
- **Unfold:** the sheet rises from the bottom edge with a clip-path reveal plus 24px lift (380ms in, 220ms reversed out), capped at min(78vh, 760px) and scrolling internally. The duplicate copies fan right and up, staggered 40ms and 80ms. When open, the bar's edge softens to a hairline.
- **Tick:** adding an item replays a 520ms rise-and-fade on the slip summary.
- **Lines:** ruled rows of serif item name, Graphite meta, a hairline-bordered stepper (36px cells, tabular count), bold tabular line total, and a remove control that turns Oxblood on hover.
- **Totals:** Graphite terms with tabular amounts, bundle savings in Bottle Green, and a serif grand total over a heavy rule.

### Updates List
Dated notes newest first: a 11rem tabular date column in grotesk 600, then the note in serif at 1.25rem; rows divided by hairlines. Placeholder entries carry a small white "Sample" tag.

### Motion
- **Arrival:** one orchestrated load sequence using `cubic-bezier(0.16, 1, 0.3, 1)`: headline, lede and button rise 14px (700ms, staggered 0, 80, 140ms); the feature cloth wipes down into place (900ms); its label rises at 420ms; the slip docks up from below at 500ms.
- **Reduced motion:** all animation and transition is removed; the page and sheet appear instantly.

## Do's and Don'ts

### Do:
- **Do** keep the ground Cool Paper (#F5F4F7) and set text in Charcoal Ink (#25232C), with Graphite (#55515F) for secondary copy.
- **Do** confine book-cloth colour to bounded tiles and panels, always with the linen overlay at 240px.
- **Do** put names on white tipped-on paper labels when they sit on cloth.
- **Do** use charcoal solid square buttons for primary actions and the quiet outlined variant for the one secondary action.
- **Do** divide content with 1px hairlines (#DEDBE4) and mark section heads with a 1px ink rule.
- **Do** set every price, count, date and order number in tabular figures.
- **Do** give every new motion the paper-weight grammar (short, `cubic-bezier(0.16, 1, 0.3, 1)`, no bounce) and make it instant under reduced motion.
- **Do** label placeholder content visibly (Sample tag, "Photo coming soon").

### Don't:
- **Don't** use book-cloth or copy tints as page fill, section backgrounds, gradients, text colour or button colour.
- **Don't** round corners on controls, tiles, labels or panels.
- **Don't** use die-cut sticker shapes, outlines or sticker-style badges.
- **Don't** put shadows on buttons, chips, inputs or cards, and never use hard offset shadows.
- **Don't** add uppercase tracked labels or kicker lines above headings.
- **Don't** introduce a cart sidebar or a second fixed bar; the docked slip is the only persistent ordering surface.
- **Don't** make it read as childish, busy or washed out: no confetti, no bouncing, no wall-to-wall pastel.
