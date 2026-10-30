# VOIDWEAR: Streetwear E-commerce Template

A bold, dark streetwear and clothing store template built with plain HTML, CSS and JavaScript. It needs no build step. Open `index.html` and it works.

## Design

Dark background, neon lime accent, Anton display font, hard-edged "brutalist" buttons and a lime offset shadow. It has a completely different look from the `ecommerce-template` (XYRON) store.

## Features

- Hero with outlined type, a rotating "Limited Edition" sticker and a **next-drop countdown**
- Tilted scrolling ticker band
- **New Drops** carousel with arrow buttons and swipe on mobile
- Shop with a **sidebar filter**: category (with counts), **max-price slider** and **size**, plus sorting
- SOLD OUT / ALMOST GONE / % off / NEW badges and colour swatches
- Product modal with **colour and size selection** (it asks for a size if none is picked), a quantity stepper and perks
- Full-screen **search overlay** with live results
- Cart drawer with a free-shipping bar and **coupon codes** (`VOID15`, `FIRST10`)
- **Checkout on WhatsApp** with the full order, sizes, discount and total
- Lookbook, customer quotes, an **FAQ accordion**, a newsletter and a giant-type footer
- **Mobile bottom nav bar**, like an app
- Cart, wishlist and coupon are saved in the browser

## Make it your own

Edit `CONFIG` and `PRODUCTS` at the top of `script.js`:

| Setting | What it does |
|---|---|
| `whatsapp` | Number that orders are sent to (dummy number by default, so change it) |
| `freeShippingAt` | Free-shipping threshold |
| `dropDate` | Next-drop countdown date (`null` = 3 days from now) |
| `coupons` | Coupon codes and their discount (0.15 = 15%) |

Change colours in `:root` at the top of `style.css` (`--lime` is the accent).

## Go live for free

Use GitHub **Settings → Pages**, or drag this folder onto [Netlify Drop](https://app.netlify.com/drop).
