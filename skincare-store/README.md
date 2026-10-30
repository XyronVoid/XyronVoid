# dewly.: Skincare & Beauty Store Template

A soft, playful skincare store template built with plain HTML, CSS and JavaScript. It needs no build step.

```
skincare-store/
├── index.html   ← page structure
├── style.css    ← design
├── script.js    ← store logic and product list
└── images/      ← product, hero and before/after photos
```

Keep these files together in one folder, then open `index.html`.

## Design

Blush, peach and plum colours, Fraunces and DM Sans fonts, a morphing blob behind an arch-framed hero photo, rounded cards and sticker badges.

## Features

- **5 products with real photos**: cleansing bar, niacinamide serum, hydra night serum, barrier cream and sunscreen
- **Shop by skin concern** (acne, dullness, dark spots, dryness, oil, fine lines) plus a skin-type filter
- Product cards with size options, ratings, concern tags and the key ingredient on hover
- **Skin Quiz**: 4 questions build a 3- or 4-step routine, which can be added to the bag at **15% off**
- **Pick any 3** bundle builder at **20% off**
- **Before/After slider** on a real skin close-up
- **Ingredient guide**: tap an ingredient to see every product that has it
- Bag with a free-shipping bar, **Subscribe & save 10%**, **2 free samples above ₹999**, and a clear total of savings
- **Checkout on WhatsApp** with the full order
- Responsive layout with a mobile menu; the bag is saved in the browser

## Make it your own

Edit the **SETTINGS** block at the top of `script.js`:

| What | Where |
|---|---|
| WhatsApp number, shipping, discounts, sample rules | `CONFIG` (dummy number `919876543210` by default, so change it) |
| Products: name, photo (`img`), sizes and prices, concerns, skin types | `PRODUCTS` |
| Ingredients | `INGREDIENTS` |
| Free samples | `SAMPLES` |
| Which products the quiz recommends | `buildRoutine()` |

To use your own photos, put them in `images/` and point each product's `img` at them. Square or portrait photos on a light background look best.
If a photo can't load, a drawn bottle in the product's `tint` colour shows instead.

Change colours in `:root` at the top of `style.css`. Photo credits are in `images/CREDITS.md`.

## Go live for free

Use GitHub **Settings → Pages**, or drag this folder onto [Netlify Drop](https://app.netlify.com/drop).
