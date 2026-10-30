# LOOPSY: Handmade Crochet Toy Store Template

A bold, neo-brutalist store template for handmade toys, built with plain HTML, CSS and JavaScript. It needs no build step.

```
toy-store/
├── index.html   ← page structure
├── style.css    ← design
├── script.js    ← store logic and toy list
└── images/      ← toy photos
```

Keep these files together in one folder, then open `index.html`.

## Design

Neo-brutalism: thick black borders, hard offset shadows, flat candy colours (yellow, pink, mint, blue, orange), a dotted paper background, tilted stickers and highlights, a bento-grid hero and buttons that "press" into their shadow. Fonts are Archivo Black and Space Grotesk.

## Features

- **10 toys with real photos**: 7 single friends and 3 family sets, each with a name, species and personality line
- Collection filters (Woodland, Winter, Families) and size buttons on every card (Mini, Classic, Huggable)
- **Adopt view**: choose size and eyes (**baby-safe embroidered** or safety eyes), type the adopter's name and see a live **adoption certificate**, with an optional embroidered name ribbon
- Each toy shows **who made it** and how many hours it takes
- **Meet the makers** cards with stats and the toys each artisan makes
- **Custom toy request** (your pet or your child's drawing) sent to WhatsApp
- Cart with free-shipping bar, gift wrap and a **dispatch date** (made-to-order Huggable toys take longer)
- **Checkout on WhatsApp** with sizes, eyes, certificate names, ribbons and total
- Sticky-note reviews, FAQ, big footer; responsive with a mobile menu; the cart is saved in the browser

## Make it your own

Edit the **SETTINGS** block at the top of `script.js`:

| What | Where |
|---|---|
| WhatsApp number, shipping, ribbon and gift wrap prices, dispatch days | `CONFIG` (dummy number `919876543210` by default, so change it) |
| Sizes and eye options | `SIZES`, `EYES` |
| Artisans | `MAKERS` |
| Collections | `COLLECTIONS` |
| Toys: name, species, personality, photo (`img`), prices per size, maker, hours, colour | `TOYS` |

Colours, borders and shadows are at the top of `style.css`. Change the text (story, FAQs, reviews) in `index.html`.

## Photos

The photos come from Automattic's GPL WordPress theme Stitchery (AI-generated). See `images/CREDITS.md`. Replace them with photos of your own toys before going live.
