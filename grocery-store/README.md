# Basketo: Grocery Delivery Store Template

A bright, friendly grocery and quick-delivery store template built with plain HTML, CSS and JavaScript. It needs no build step. Open `index.html` and it works.

Products use **emoji tiles** in place of photos, so nothing breaks if images fail to load. You can swap in real photos later.

## Design

Cream background, fresh green and orange colours, rounded cards, pastel category tiles and a handwritten accent font. It looks different from both the `ecommerce-template` (luxury) and `streetwear-store` (dark) templates.

## Features

- **Pincode checker** for delivery availability; you can limit it to your own areas
- **Live search suggestions** dropdown; press Enter to jump to the product
- Hero with floating fruit, plus offer cards that jump to a category
- 8 category tiles and category tabs
- **Pack-size selector** (500 g / 1 kg …) with its own price and MRP for each size
- **ADD button turns into a − 1 + stepper** right on the card
- % OFF badge, veg mark and "30 MINS" delivery tag
- **Value combos** section
- Cart drawer with:
  - **Delivery slot picker** (Express 30 min / Today / Tomorrow)
  - **Coupons** that unlock when the cart reaches a minimum value (`FRESH50`, `SAVE10`, `FIRST100`)
  - **Full bill**: item total, delivery fee (free above ₹299), handling fee, discount and a "You're saving ₹X" message
  - **Address form** with a choice of COD or UPI on delivery
- **Place order on WhatsApp**: sends the items, bill, slot, name, phone and address
- **Mobile sticky "View cart" bar**, the way delivery apps have it
- Cart and pincode are saved in the browser

## Make it your own

Everything is at the top of `script.js`:

| What | Where |
|---|---|
| WhatsApp number, delivery fee, free-delivery limit, handling fee | `CONFIG` (dummy number by default, so change it) |
| Delivery areas | `CONFIG.pincodes` (empty = all pincodes) |
| Categories and their colours | `CATEGORIES` |
| Products and pack sizes `[label, price, MRP]` | `PRODUCTS` |
| Combos | `COMBOS` |
| Coupon codes and rules | `COUPONS` |

Change colours in `:root` at the top of `style.css`.

## Go live for free

Use GitHub **Settings → Pages**, or drag this folder onto [Netlify Drop](https://app.netlify.com/drop).
