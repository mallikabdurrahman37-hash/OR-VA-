# ORÈVA — Customer Storefront

A premium, fully responsive e-commerce storefront built with plain HTML, CSS and
JavaScript (ES modules), Firebase (Auth + Firestore) and Cloudinary.

## 1. Add your assets

Drop these two files into `/assets/`:

- `assets/logo.png` — used in the header, mobile drawer and footer. Until it's
  present the header automatically shows a styled "ORÈVA" text logotype instead
  (no broken-image icon).
- `assets/bg.png` — optional site background. If it fails to load, the site
  automatically falls back to the paper colour background. Nothing else needs
  to change — this is handled in `js/ui.js` → `applyBackground()`.

## 2. Firebase setup

The project already points at the `eddy-s-portfolio` Firebase project and the
`Wb_mobile_products` Cloudinary preset (see `js/firebase-config.js`) — these
match the master specification exactly and shouldn't need to change.

In the Firebase console for this project:

1. **Authentication** → enable **Anonymous**, **Email/Password**, and **Google**
   sign-in providers.
2. **Firestore** → make sure the `products`, `users`, `orders`, `settings` and
   `visitor_ids` collections match the schema in the spec (this storefront
   reads/writes them exactly as documented, no renamed fields).
3. Deploy the security rules and indexes in this repo:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use eddy-s-portfolio
   firebase deploy --only firestore:rules,firestore:indexes
   ```
4. **Admin access**: the rules in `firestore.rules` expect an admin to have a
   custom auth claim `admin: true` on their Firebase Auth token (set this from
   your admin panel / a Cloud Function — never store an "isAdmin" flag inside a
   client-writable Firestore document).

## 3. Run locally

No build step — it's static HTML/CSS/JS. Serve the folder with any static
server, e.g.:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Open `index.html` (via the server, not `file://`, since ES modules require
`http(s)://`).

## 4. Deploy

**Firebase Hosting** (recommended, same project as your data):
```bash
firebase deploy --only hosting
```

**GitHub Pages / Netlify / Vercel**: this is a static site, so it deploys as-is
from the repository root — no framework build required.

## 5. Project structure

```
index.html                 Home
shop.html                  Catalogue, filters, search, sort
product.html                Product detail (gallery, sizes, add to cart)
cart.html                  Cart
checkout.html               Checkout (COD only) → creates the Firestore order
order-confirmation.html     Post-checkout summary
track-order.html            Public order lookup + tracker + cancellation
account.html                 Sign in / sign up / Google / profile
my-orders.html               Signed-in order history
order-details.html           Full order view
wishlist.html                 Saved products
about.html / contact.html / faq.html
shipping-policy.html / cancellation-policy.html / return-policy.html
privacy-policy.html / terms.html

css/styles.css              Full design system (tokens, layout, components)
js/firebase-config.js       Firebase + Cloudinary config (exact spec values)
js/auth.js                  Anonymous / email / Google auth
js/products.js               Firestore product reads + card rendering
js/cart.js                   localStorage cart + wishlist
js/orders.js                  Order creation, tracking stages, cancellation
js/ui.js                      Shared header/footer/drawer/toast/formatting

firestore.rules              Security rules (extends the existing baseline)
firestore.indexes.json       Composite indexes the queries above need
firebase.json                Hosting + deploy config
```

## 6. What's intentionally not built yet

Per the spec, **returns/exchanges/refunds** are marked "under development" with
an honest notice on `return-policy.html` rather than a half-built flow.

## 7. Responsive testing checklist

Tested against 320 / 360 / 375 / 390 / 412 / 430 / 600 / 768 / 820 / 900 /
1024 / 1280 / 1440px using fluid `clamp()`/`minmax()` sizing, a 2-column mobile
product grid (1 column only if truly needed), and a slide-in mobile nav drawer
that scrolls internally and never causes page-level horizontal overflow.
