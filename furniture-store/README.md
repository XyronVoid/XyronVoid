# KONA: Furniture & Plants Store Template

A bold, Bauhaus-inspired furniture store template built with plain HTML, CSS and JavaScript. It needs no build step.

```
furniture-store/
├── index.html   ← page structure
├── style.css    ← design
├── script.js    ← store logic, products and plants
└── images/      ← furniture and plant photos
```

Keep these files together in one folder, then open `index.html`.

## Design

Bauhaus: primary red, yellow and blue with black and off-white, circles, squares, triangles and half circles, a poster-style hero built from shapes, a strict grid with 2px black rules, outlined numbers and the geometric Jost font.

## Features

- **10 furniture pieces and 6 plants with real photos**
- **Shop by room** (living, dining, study, bedroom), each with its own shape and colour, plus sorting
- Every card shows the exact **size** and its **finishes**
- **Product view** with finish swatches (some change the price), a width/depth/height table and a **"Will it fit?" checker**: enter your space and door width and it tells you if the piece fits, with how much room to spare, even turned sideways
- **EMI slider** for 3, 6, 9 or 12 months with the monthly amount
- **Pair it with a plant** in one tap, and a plant section with quick add
- Cart with **assembly** per item (free above ₹25,000) and a **floor and lift** picker: without a lift, a stairs charge per floor for each large item is shown upfront
- **Checkout on WhatsApp** with finishes, sizes, assembly, floor and total
- Responsive with a mobile menu; the cart and your measurements are saved in the browser

## Make it your own

Edit the **SETTINGS** block at the top of `script.js`:

| What | Where |
|---|---|
| WhatsApp number, delivery, assembly, stairs charge, EMI months, fit margin | `CONFIG` (dummy number `919876543210` by default, so change it) |
| Rooms, with their shape and colour | `ROOMS` |
| Furniture: name, rooms, price, photo, size, finishes, plant pairings | `PRODUCTS` |
| Plants | `PLANTS` |

Colours and fonts are at the top of `style.css`. Change the text (story, FAQs, reviews) in `index.html`.

## Photos

The photos are from Unsplash (free under the Unsplash License), taken from Vendure's demo data. See `images/CREDITS.md` for each photographer. Replace them with photos of your own pieces before going live.
