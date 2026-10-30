# KANAK: Everyday Fine Jewellery Store Template

A minimal, editorial jewellery store template built with plain HTML, CSS and JavaScript. It needs no build step.

```
jewellery-store/
├── index.html   ← page structure
├── style.css    ← design
├── script.js    ← store logic and product list
└── images/      ← product and lifestyle photos
```

Keep these files together in one folder, then open `index.html`.

## Design

Sand, forest green and soft gold colours, Instrument Serif and Manrope fonts, numbered editorial sections, thin rules and a lot of white space.

## Features

- **10 products with real photos**: earrings, rings, bracelets, necklaces and a gift set
- Category filter, price sorting and **metal swatches** on every card (18k gold vermeil or solid 14k gold, each with its own price)
- **Product view** with metal choice, **ring size picker** (Indian sizes 6–20) and **free engraving** on bracelets and necklaces
- **Shop the look**: tap the dots on a lifestyle photo to see each piece, then add the full look at **10% off**
- **Ring size finder**: slide to your finger circumference to get your Indian and US size, then save it so rings pre-select it
- **Wishlist** (♡) and bag in one drawer with tabs
- **Gift wrap** with a handwritten gift note (free above ₹5,000) and a no-cost EMI line
- Materials comparison, care FAQs, reviews and newsletter
- **Checkout on WhatsApp** with metal, ring size, engraving, gift note and total
- Responsive layout with a mobile menu; the bag, wishlist and ring size are saved in the browser

## Make it your own

Edit the **SETTINGS** block at the top of `script.js`:

| What | Where |
|---|---|
| WhatsApp number, gift wrap price, EMI months, look discount, ring sizes | `CONFIG` (dummy number `919876543210` by default, so change it) |
| Categories and metals | `CATEGORIES`, `METALS` |
| Products: name, photo (`img`), prices per metal, ring size, engraving | `PRODUCTS` |
| Shop-the-look hotspots (product and position on the photo) | `LOOK` |

Colours and fonts are at the top of `style.css`. Change the text (story, FAQs, reviews) in `index.html`.

## Photos

The photos come from Automattic's GPL WordPress theme Aether (AI-generated). See `images/CREDITS.md`. Replace them with photos of your own pieces before going live.
