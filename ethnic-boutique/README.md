# ZARIYA: Indian Ethnic Wear Boutique Template

An elegant boutique template for sarees, lehengas, kurta sets and jewellery, built with plain HTML, CSS and JavaScript. It needs no build step. Open `index.html` and it works.

## Design

Deep maroon, antique gold and ivory, Cormorant Garamond and Jost fonts, **Mughal-arch photo frames** and a hand-drawn ornament divider, for a traditional, wedding-invitation feel. It looks different from the other three templates in this repo.

## Features

- **Auto-rotating hero slider** (3 slides) with arrows, dots and a slow zoom effect
- **Shop by Occasion**: Wedding, Festive, Office and Sangeet, in arch frames
- Collection with **type and fabric filters**, sorting, and a **second photo on hover**
- **Product popup** with:
  - Photo gallery with thumbnails and click-to-zoom
  - Fabric, work, care and shipping details
  - Size selection plus a **Size Guide** chart
  - **Custom stitching option** (+₹499); for sarees this means blouse stitching with fall and pico
  - **"Ask about this piece on WhatsApp"** button
- **Shop the Look**: tap the dots on the photo, or add the complete look to the bag
- Craft story section, **Recently Viewed** strip and a testimonial slider
- **Wishlist drawer** that actually lists saved items
- Bag with **gift wrap (+₹99) and a gift message**
- **Checkout on WhatsApp**, including stitching and gift details
- **Book an appointment**: video call or boutique visit, with date and time, confirmed on WhatsApp
- Fully responsive with a hamburger menu; bag, wishlist and recently viewed are saved in the browser

## Make it your own

Everything is at the top of `script.js`:

| What | Where |
|---|---|
| WhatsApp number, stitching fee, gift wrap fee | `CONFIG` (dummy number by default, so change it) |
| Occasion tiles | `OCCASIONS` |
| Products (photos, price, fabric, sizes, stitching) | `PRODUCTS` |
| Shop the Look products | `LOOK` (positions of the dots are in `index.html`) |

Photos use Unsplash ids. **For a real boutique, use the boutique's own photos**: put them in an `images/` folder and write `imgs: ["images/saree-1.jpg", "images/saree-1-back.jpg"]`. If any photo fails to load, an elegant maroon placeholder is shown.

Change colours in `:root` at the top of `style.css`.

## Go live for free

Use GitHub **Settings → Pages**, or drag this folder onto [Netlify Drop](https://app.netlify.com/drop).
