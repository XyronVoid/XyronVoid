# Butterbloom: Home Bakery Store Template

A warm, playful bakery store template built with plain HTML, CSS and JavaScript. It needs no build step.

```
bakery-store/
├── index.html   ← page structure
├── style.css    ← design
├── script.js    ← store logic and product list
└── images/      ← cake, cupcake, macaron and cookie photos
```

Keep these files together in one folder, then open `index.html`.

## Design

Cream, cocoa and strawberry colours, Caprasimo, Outfit and Caveat fonts, an arch-framed hero photo, a tilted flavour ticker and rounded cards. Veg/non-veg marks follow Indian food labelling.

## Features

- **12 products with real photos**: 6 cakes, cupcakes, macarons and 4 cookie boxes
- **Shop by occasion** (birthday, anniversary, wedding, kids' party, just because), category tabs and an **Eggless only** switch
- **Cake customiser**: pick a weight (with serving size), egg or eggless, and type a **message on the cake** that shows live on the photo
- **Same-day countdown** to the 4 PM cutoff
- Box with party add-ons (candles, topper, card, knife) and a free-delivery bar
- **Delivery details**: pincode check, date picker and time slots. Slots that start less than 3 hours away are closed, the wedding cake needs 3 days' notice, and there is a **midnight slot** with an extra fee
- **Custom cake enquiry** form that opens WhatsApp
- **Checkout on WhatsApp** with the full order, cake messages, add-ons, delivery date and slot
- FAQ, reviews, newsletter, responsive layout with a mobile menu; the box is saved in the browser

## Make it your own

Edit the **SETTINGS** block at the top of `script.js`:

| What | Where |
|---|---|
| WhatsApp number, city, pincodes, delivery fee, eggless charge, same-day cutoff | `CONFIG` (dummy number `919876543210` by default, so change it) |
| Occasions and menu tabs | `OCCASIONS`, `CATEGORIES` |
| Products: name, photo (`img`), sizes and prices, egg option, occasions, notice days | `PRODUCTS` |
| Party add-ons | `ADDONS` |
| Delivery time slots and their extra fees | `SLOTS` |

Colours and fonts are at the top of `style.css`. Change the text (story, FAQs, reviews, FSSAI number) in `index.html`.

## Photos

The photos come from Automattic's GPL WordPress themes Cakely and Batch (AI-generated). See `images/CREDITS.md`. Replace them with photos of your own bakes before going live.
