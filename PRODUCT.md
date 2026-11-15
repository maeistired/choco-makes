# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML site (owner's choice), hosted on GitHub Pages. Repository: `~/Documents/GitHub/choco-makes`. Domain to be purchased; not yet chosen.

## Users

- **Primary:** people who discover Choco Makes at a one-off small market, then come back to the site later to see what's available and order directly.
- **Audience (owner, 2026-11-15):** university students, men and women alike. The site must not read as made for kids or for one gender.
- **Ongoing:** anyone who wants to order handmade notebooks or 3D-printed clicker fidgets from Choco Makes after the market, at any time.
- **Owner:** the maker, who updates inventory, posts updates for customers, and receives orders and demand signals.

## Product Purpose

Choco Makes needs a home of its own that stays useful after the market is over. Customers who met the brand at the market should be able to find it again, browse current stock, and send an order sheet straight to the maker. Success means people order directly between and beyond market days, and the owner can easily keep stock and customer updates current.

## Positioning

A small independent maker of handmade notebooks and 3D-printed clicker fidgets. Customers order directly from the person who makes the items, not through a marketplace. The market is how people find Choco Makes; the site is what keeps the brand going independently.

## Operating Context

- Discovery starts at a one-off market. The site is supplementary there and outlives it.
- Each item is made in small batches: about 10–20 units per item.
- The owner updates inventory and posts updates for customers.
- Orders are sent as an order sheet. The owner reviews them personally; there is no checkout or online payment.

## Capabilities and Constraints

**Product catalogue.** Each item shows: name, price, photo, description, variants, stock count, and sold-out state.

**Sold-out interest.** A sold-out item shows a button that lets a customer register interest, so the owner can gauge demand.

**Bundle pricing.** Some products have a "buy 2 for $X" price. Order totals must account for it.

**Order sheet.** Collects customer name, phone or email, items, quantities, and prices/totals, then sends the sheet to the owner.

**Product range.** Notebooks and clicker fidgets for now, with no fixed pattern yet. Categories and variants must stay flexible.

**Decided (owner, 2026-11-15):**
- Structure: a single scrolling page (shop, updates, about, order sheet), one link to share.
- Order delivery: Web3Forms, emailed to the owner. Sold-out interest requests use the same channel.
- Pickup: on campus, arranged by email after the order sheet arrives.
- Payment: e-Transfer, contactless at pickup, or cash (change not guaranteed). Nothing is charged online.
- Inventory: an edited data file in the repo (products data), committed to update the site.
- Post-order confirmation copy: the owner writes it; ship a clearly marked placeholder until then.
- Currency: Canadian dollars (CAD).
- Customer updates: short dated notes, newest first, kept in the same data file as products.

**Open decisions (do not assume):**
- Delivery or shipping. Not offered; undecided beyond on-campus pickup.
- Domain name.

**Change policy:** the owner must approve any feature, content, or suggestion beyond what's listed here before it is built.

## Brand Commitments

- **Name:** Choco Makes. The brand is unofficial and still in development.
- **Colour direction (owner-specified):** soft pastels. Lilac is primary, pink is secondary, light blue is an accent.
- **Voice / personality:** cozy, happy, cute, cool, unique, dopamine.
- **Brand components requested:** a colour palette and a consistent, efficient design system used throughout the site.
- No logo, fonts, tagline, or photography exist yet.
- **Tone (owner, 2026-11-15):** classy, with a standard, familiar shop layout. Keep the lilac / pink / light-blue palette but use it with restraint, not as wall-to-wall pink and purple. No die-cut-sticker motifs (the owner does not make stickers).
- **Must not feel:** too busy or overwhelming (dopamine must never get in the way of ordering), babyish, childish, or overly playful, or plain and washed-out.

## Evidence on Hand

None yet: no product photos, inventory list, prices, testimonials, or sales data. Future work must not invent products, prices, reviews, customer counts, or policies (shipping, refunds, pickup). Use clearly marked placeholders until the owner supplies real content.

## Product Principles

1. **Independent beyond the market.** Everything should make sense to someone who never attended the market.
2. **The owner can keep it current.** Updating stock and posting updates must stay quick for one person.
3. **Honest scarcity.** Stock counts and sold-out states are real. Demand for sold-out items gets captured, not hidden.
4. **Ordering stays personal.** An order sheet goes to the maker, not to an impersonal checkout.
5. **Nothing added without approval.** Suggestions go to the owner first.

## Accessibility & Inclusion

WCAG 2.2 AA. English only.
