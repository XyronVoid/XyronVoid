# Local Business Website Template

A reusable website for small local shops (salon, gym, clinic, coaching centre, restaurant, cafe, boutique) with a simple **owner admin panel**. Made by **QuanShade Labs**.

> **Short mein (Hinglish):**
> Yeh ek ready-made website template hai local dukaano ke liye. Naye client ki site banane ke liye bas `site.config.json` mein unki details bharo aur `public/assets/images/` mein unki photos daalo, aur site 1 ghante ke andar ready ho jaati hai.
> Local chalane ke liye: `npm install`, phir `node serve.mjs`, phir browser mein `http://localhost:5200` kholo.
> Live karne ke liye: GitHub se Netlify par deploy karo (Base directory: `business-site`) aur `ADMIN_PASSWORD` set karo.
> Dukaan ka owner `/admin` par login karke services, prices, offers, photos aur timings khud badal sakta hai. Iske liye koi coding nahi chahiye.

---

## What you get

- **Public website** (mobile first, fast, English):
  - top info bar with the address, today's hours, a live **Open now / Closed** badge and the phone number
  - sticky menu with a **Book on WhatsApp** button
  - a full-width hero with WhatsApp and Call buttons
  - about, services/prices, offers banner, gallery with lightbox, reviews slider, hours + Google Map, FAQ
  - an enquiry form that opens WhatsApp with the message already typed
  - footer with social links and the "Website by QuanShade Labs" credit
  - floating WhatsApp/Call buttons on phones
- **3 design presets**: `dark-gold` (premium dark, default), `light-minimal`, `bold-colour`, plus one accent colour of your choice.
- **SEO built in**: title, description, Open Graph tags and Google "LocalBusiness" data (JSON-LD), all generated from the config.
- **Owner admin panel** at `/admin`, protected by a password:
  - Services & prices: add, edit, hide, reorder, delete, optional photo
  - Offers: title, text, "valid till" date (it hides itself after that date)
  - Photos: upload from the phone (photos are resized automatically), reorder, caption, delete
  - Hours & contact: opening hours (with a lunch break), phone, WhatsApp, email, address, and a **Temporarily closed** notice
- If the admin data can't be loaded, the website still shows everything from `site.config.json`.

## Folder structure

```
business-site/
├─ site.config.json          ← ALL the business details (edit this for each client)
├─ examples/                 ← ready configs: salon.json, gym.json, clinic.json
├─ public/
│  ├─ index.html             ← the website
│  ├─ admin.html             ← the owner admin panel
│  └─ assets/ (css, js, images)
├─ server/
│  ├─ api-core.mjs           ← the API, written once, used locally and on Netlify
│  └─ render-page.mjs        ← adds SEO tags + config into index.html
├─ serve.mjs                 ← local server (port 5200), saves data in data/
├─ netlify/functions/api.mjs ← the same API on Netlify (uses Netlify Blobs)
├─ scripts/                  ← use-example.mjs, build.mjs
├─ netlify.toml
└─ .env.example
```

---

## 1. Run it on your computer

You need **Node.js 18 or newer**.

```bash
cd business-site
npm install
cp .env.example .env        # then open .env and set ADMIN_PASSWORD
node serve.mjs
```

- Website: <http://localhost:5200>
- Admin panel: <http://localhost:5200/admin>

Whatever the owner changes in the admin panel locally is saved in `data/` (`data/content.json` plus photos in `data/uploads/`). This folder is not committed to Git. Delete it to start fresh.

To try the demo businesses:

```bash
npm run use -- salon     # or: gym, clinic
```

This copies `examples/salon.json` over `site.config.json`. Your old config is saved as `site.config.backup.json`. Refresh the browser and you'll see the change; there's no need to restart.

---

## 2. Make a new client site (under 1 hour)

1. **Start from the closest example.** Run `npm run use -- salon` (or `gym` / `clinic`).
2. **Open `site.config.json` and fill in the client's details:**
   - `business`: name, tagline, `category` (`salon`, `gym`, `clinic`, `dentist`, `coaching`, `restaurant`, `cafe`, `boutique`, `bakery`, `spa`), optional `logo` path
   - `contact`:
     - `phone`, as you want it shown (e.g. `+91 98765 43210`)
     - `whatsapp`, digits only with the country code (e.g. `919876543210`)
     - `email` and `address`
     - `mapEmbedUrl`: in Google Maps, open the shop → Share → *Embed a map* → copy only the `src="…"` link. If you leave it empty, a map is made from the address.
     - `directionsUrl`: optional. If empty, it's made from the address.
   - `hours`: one line per day, e.g. `"10:00-20:00"`, `"10:00-14:00, 17:00-21:00"` (lunch break) or `"closed"`. Use 24-hour time. The Open/Closed badge always uses Indian time (`timezone`).
   - `social`: Instagram/Facebook/YouTube links (leave `""` to hide)
   - `theme.preset`: `dark-gold`, `light-minimal` or `bold-colour`
   - `theme.accent`: any hex colour, e.g. `#c8925b`. If a colour is too dark or too light for the preset, it is adjusted automatically.
   - `whatsappMessage`: the message that is pre-typed when someone taps "Book on WhatsApp"
   - `hero`, `about` (with `highlights`), `sections` (headings), `services`, `offers`, `gallery`, `testimonials`, `faq`
   - `seo`: page title and description for Google. Set `url` to the final domain (e.g. `https://velvettouch.in`) once you know it.
3. **Service icons:** use one of these names in `"icon"`:
   `scissors, brush, droplet, sparkle, crown, hand, leaf, flower, dumbbell, run, yoga, flame, calendar, user, users, stethoscope, tooth, shield, baby, activity, heart, pill, book, pen, cap, coffee, utensils, cake, shirt, bag, gift, star, check, clock, home, car, camera, music`.
   You can also just put an emoji like `"💇"`.
4. **Add photos.** Make a folder such as `public/assets/images/clientname/` and put the photos there. Use JPG or WebP, about 1600px wide, under 300 KB each. Then point `hero.image`, `about.image` and the `gallery` items to them, e.g. `"assets/images/clientname/hero.jpg"`. The example images are just placeholders, so replace them.
5. **Check it:** run `node serve.mjs` and look at the site on your phone (same Wi-Fi: `http://<your-computer-ip>:5200`) and on desktop.
6. **Credit:** the footer says "Website by QuanShade Labs". Change `credit.url` to your own site or Instagram.

Tip: keep one Git branch or repo per client so each client's config and photos stay separate.

---

## 3. Deploy on Netlify (free) through GitHub

1. Push this repo to GitHub.
2. In Netlify, go to **Add new site → Import an existing project → GitHub** and pick the repo.
3. Use these build settings (most are read from `netlify.toml` automatically):
   - **Base directory:** `business-site`
   - **Build command:** `node scripts/build.mjs`
   - **Publish directory:** `public` (Netlify shows it as `business-site/public`)
   - **Functions directory:** `netlify/functions`
4. Go to **Site configuration → Environment variables → Add a variable**:
   - `ADMIN_PASSWORD` = a strong password for the owner. Don't use the client's phone number!
   - optional: `TIME_ZONE` (default `Asia/Kolkata`), which decides when offers expire.
5. Click **Deploy**. Open `https://your-site.netlify.app/admin` and log in to test.

The admin data and uploaded photos are stored in **Netlify Blobs** automatically. You don't need a database.
Every time you push a change to `site.config.json`, Netlify rebuilds the site. The owner's admin changes are kept, because they live in Blobs and not in Git.

> If you change `ADMIN_PASSWORD` later, trigger a new deploy (Deploys → Trigger deploy) so the function picks it up.

## 4. Custom domain

1. Buy the domain (GoDaddy, Hostinger, Namecheap, etc.).
2. In Netlify, go to **Domain management → Add a domain** and type it (e.g. `velvettouch.in`).
3. Then do one of these:
   - **Easiest:** use Netlify DNS by changing the domain's nameservers at the registrar to the 4 that Netlify shows.
   - **Or:** keep the registrar's DNS and add an `A` record for `@` pointing to `75.2.60.5`, and a `CNAME` for `www` pointing to `your-site.netlify.app`.
4. Wait for DNS (usually under 1 hour, sometimes up to 24). Netlify adds free HTTPS automatically.
5. Put the final address in `seo.url` in `site.config.json` and push.

---

## 5. How the owner uses the admin panel

Send the owner this:

> 1. Open **yourwebsite.com/admin** on your phone and enter your password.
> 2. Use the 4 big buttons at the top:
>    - **Services**: tap **Edit** to change a name, price or description. **Hide** removes it from the website without deleting it. Use ↑ ↓ to change the order. **+ Add a service** adds a new one.
>    - **Offers**: tap **+ Add an offer**, write the title and details, and choose a **Valid till** date. The offer disappears from the website by itself after that date.
>    - **Photos**: tap **+ Add photos** and choose from your gallery. Photos are made smaller automatically. Use ← → to reorder, ✎ for a caption, 🗑 to delete.
>    - **Hours & contact**: tap **Open/Closed** for each day, change the times, add a lunch break if needed, and update the phone/WhatsApp/address. Going on holiday? Tick **Temporarily closed** and write a message. Then tap **Save hours & contact** at the bottom.
> 3. Every change is live on the website straight away. Refresh the website to see it.
> 4. Made a mess? Each tab has an **Undo all changes** link at the bottom that goes back to the original version.
> 5. Tap **Log out** when you're done on a shared phone.

---

## Technical notes

- **Stack:** plain HTML/CSS/vanilla JS, Node 18+, one dependency (`@netlify/blobs`). There's no framework and no frontend build.
- **How content works:** `site.config.json` is baked into `index.html` (by `serve.mjs` on each request locally, and by `scripts/build.mjs` on Netlify). The page renders from it immediately, then fetches `GET /api/content` and puts the owner's changes on top. If the API fails, the page still works.
- **API** (`server/api-core.mjs`), which takes a storage adapter `{ getContent, setContent, getImage, setImage, deleteImage }`:
  - `GET /api/content`: public data (hidden services and expired offers are removed)
  - `GET /api/images/:id`: uploaded photos (cached for a long time)
  - `POST /api/login`: checks the password
  - `GET /api/admin/content`: all saved admin data
  - `PUT /api/admin/services|offers|gallery|info`: replace one section
  - `DELETE /api/admin/services|offers|gallery|info`: reset that section to the config
  - `POST /api/admin/images`: upload a photo (raw body; JPG/PNG/WebP only, checked by file signature; max 3 MB)
- **Security:**
  - The password is checked on the server with SHA-256 + `timingSafeEqual`, and a wrong password waits about 700 ms.
  - The browser keeps the password in `sessionStorage` and sends it as the `x-admin-password` header.
  - All input is validated and cleaned on the server: HTML is stripped, lengths are limited, and phone, WhatsApp, dates, hours and image links are checked.
  - When an item or photo is removed, any uploaded photo that nothing uses any more is deleted.
  - `/admin` is sent with `X-Robots-Tag: noindex`.
- **Performance:**
  - Images load lazily, and the hero image is preloaded.
  - Fonts don't block the first paint, and the map iframe loads lazily.
  - The example site scores about 99 for Lighthouse mobile performance.
