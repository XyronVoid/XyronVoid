# dewly.: Skincare & Beauty Store Template

A soft, playful skincare and beauty store template built with plain HTML, CSS and JavaScript. It needs no build step. Open `index.html` and it works.

## Design

Blush, peach and plum colours, Fraunces and DM Sans fonts, morphing blob shapes, rounded cards and sticker badges. It looks different from the other four templates in this repo.

Every product has a **CSS-drawn bottle, jar, tube or dropper** in its own tint behind the photo. If a photo can't load, the drawing shows instead, so the store still looks good.

## Features

- **Shop by skin concern** (acne, dullness, dark spots, dryness, oil, fine lines) plus a skin-type filter
- Product cards with size options, ratings, concern tags and the **key ingredient on hover**
- **Skin Quiz**: 4 questions build a personalised 3- or 5-step routine, which can be added to the bag at **15% off**
- **Build your routine**: pick any 3 products for **20% off**, with a live bundle panel
- **Before/After slider** you drag to compare, plus clinical-result stats
- **Ingredient guide**: tap an ingredient to see every product that has it
- Bag with:
  - Free-shipping progress (₹499) that continues to the samples goal
  - **Subscribe & save 10%** (monthly delivery) on each item
  - **Choose 2 free samples** above ₹999
  - A clear total of routine, bundle and subscription savings
- **Checkout on WhatsApp**, including deals, subscriptions and chosen samples
- Reviews, newsletter and a fully responsive layout; the bag is saved in the browser

## Make it your own

Everything is at the top of `script.js`:

| What | Where |
|---|---|
| WhatsApp number, shipping, discounts, sample rules | `CONFIG` (dummy number by default, so change it) |
| Products (photo, sizes and prices, concerns, skin types, tint, shape) | `PRODUCTS` |
| Ingredients | `INGREDIENTS` |
| Free samples list | `SAMPLES` |
| Quiz questions and routine logic | `QUESTIONS` and `buildRoutine()` |

Photos use Unsplash ids. To use your own, put files in an `images/` folder and set `img: "images/serum.jpg"`.

Change colours in `:root` at the top of `style.css`.

## Go live for free

Use GitHub **Settings → Pages**, or drag this folder onto [Netlify Drop](https://app.netlify.com/drop).
