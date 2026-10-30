# dewly.: Skincare & Beauty Store Template

A soft, playful skincare store template in **one single file**: `index.html`.

The design, code and product visuals are all inside that file, so it works:
- when you open just `index.html` on its own (phone, file preview, email attachment)
- offline, with no internet (fonts fall back to system fonts)
- on GitHub Pages, Netlify or any web host

## Design

Blush, peach and plum colours, Fraunces and DM Sans fonts, a morphing blob, rounded cards and sticker badges.
Every product is drawn in **pure CSS** (bottle, dropper, jar or tube in its own colour, with a printed label), so there are no photos that could fail to load.

## Features

- **Shop by skin concern** (acne, dullness, dark spots, dryness, oil, fine lines) plus a skin-type filter
- Product cards with size options, ratings, concern tags and the key ingredient on hover
- **Skin Quiz**: 4 questions build a personalised 3- or 5-step routine, which can be added to the bag at **15% off**
- **Pick any 3** bundle builder at **20% off**
- **Before/After slider** (illustrated skin close-up) with result stats
- **Ingredient guide**: tap an ingredient to see every product that has it
- Bag with a free-shipping bar, **Subscribe & save 10%**, **2 free samples above ₹999**, and a clear total of savings
- **Checkout on WhatsApp** with the full order
- Mobile menu, and the bag is saved in the browser

## Make it your own

Open `index.html` and scroll to the `<script>` at the bottom. Edit the block marked **SETTINGS**:

| What | Where |
|---|---|
| WhatsApp number, shipping, discounts, sample rules | `CONFIG` (dummy number `919876543210` by default, so change it) |
| Products: name, label, sizes and prices, concerns, skin types, colour (`tint`), pack `shape` | `PRODUCTS` |
| Ingredients | `INGREDIENTS` |
| Free samples | `SAMPLES` |

**Real product photos (optional):** add `img: "images/serum.jpg"` to a product and put the photo in an `images/` folder next to `index.html`. The photo is shown on top of the drawing; if it ever fails to load, the drawing shows instead.

Change colours in `:root` at the top of the `<style>` block.
