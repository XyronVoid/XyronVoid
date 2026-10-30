# XYRON: Premium E-commerce Template

A premium, responsive online store template built with plain HTML, CSS and JavaScript. It needs no build step and no framework. Open `index.html` in a browser and it works.

## Features

- Elegant premium design (Playfair Display + Inter, cream and gold palette)
- Scrolling announcement bar, sticky blurred header and live search
- Hero section with animated counters and floating cards
- Shop-by-category grid; clicking a category filters the products
- Product grid with category filters, sorting, sale/new/bestseller badges and a wishlist
- Quick-view modal with size selection
- Slide-out cart drawer with quantity controls and a free-shipping progress bar
- **Checkout on WhatsApp**: sends the full order with its total to your WhatsApp
- Deal of the Day section with a live countdown
- Testimonials, trust badges, newsletter signup and footer
- Cart and wishlist are saved in the browser (localStorage)
- Scroll animations, and a fully responsive layout for mobile, tablet and desktop

## Make it your own

All of these settings are at the top of `script.js`:

| What | Where |
|---|---|
| Your WhatsApp number | `WHATSAPP_NUMBER` |
| Free-shipping limit | `FREE_SHIPPING_AT` |
| Products (name, price, image, category, sizes) | `PRODUCTS` array |

Change brand colors in `:root` at the top of `style.css`. Edit the store name, contact details and text in `index.html`.

## Go live for free

1. Upload this folder to GitHub.
2. Go to repo **Settings → Pages**.
3. Select the branch and click Save.

You can also drag and drop the folder onto [Netlify Drop](https://app.netlify.com/drop).
