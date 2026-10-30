# FILMWALA: Refurbished Film Camera Store Template

A moody, analog-darkroom store template for vintage cameras, built with plain HTML, CSS and JavaScript. It needs no build step.

```
camera-store/
├── index.html   ← page structure
├── style.css    ← design
├── script.js    ← store logic, products and calculators
└── images/      ← camera photos
```

Keep these files together in one folder, then open `index.html`.

## Design

Analog darkroom: warm black background with film grain, a scrolling film-edge strip, product cards framed as film negatives with sprocket holes and frame numbers, a hero contact sheet with a red grease-pencil circle, a red "safelight" section and reviews pinned up like prints. Photos are black and white until you hover, then they "develop" into colour. Fonts are Bodoni Moda, IBM Plex Mono and Caveat.

## Features

- **9 products with real photos**: film SLR, twin lens reflex, folding camera, instant, instamatic, two digital compacts, a zoom lens and a tripod
- Filters by **film format** and **condition grade**, plus sorting by price or age
- Honest **grading guide** (A+ Mint, A Excellent, B Good) that links to matching stock
- **Product detail** with specs, grade notes and a "what we tested" checklist
- **Compare tray**: tick up to 3 items and see them side by side
- Real **stock limits** (one-off cameras can't be added twice)
- **Trade-in estimator**: camera type, condition and box give an instant offer range, sent to WhatsApp
- **Develop & scan calculator**: format, number of rolls, scan size and negative return, booked on WhatsApp
- Bag with an optional **18-month warranty** per camera, a film starter pack and a no-cost EMI line
- **Checkout on WhatsApp**; responsive with a mobile menu; the bag is saved in the browser

## Make it your own

Edit the **SETTINGS** block at the top of `script.js`:

| What | Where |
|---|---|
| WhatsApp number, film pack, warranty, EMI, compare limit | `CONFIG` (dummy number `919876543210` by default, so change it) |
| Formats and condition grades | `FORMATS`, `GRADES` |
| Products: name, year, format, grade, price, stock, photo, specs, note | `PRODUCTS` |
| Trade-in prices and condition multipliers | `TRADE` |
| Developing prices, scan sizes and return post | `DEVELOP` |

Colours and fonts are at the top of `style.css`. Change the text (story, FAQs, reviews) in `index.html`.

## Photos

The photos are from Unsplash (free under the Unsplash License), taken from Vendure's demo data. See `images/CREDITS.md` for each photographer. Replace them with photos of your own stock before going live.
