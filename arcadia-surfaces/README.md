# Arcadia Surfaces

An original premium architectural-wallcovering brand — MERN stack, built
incrementally as **working slices**, not the full 200-requirement spec in one
shot. This README stays explicit about what's real versus what's left.

## What's built and verified (as of this pass)

**Backend** (`/server`) — syntax-checked, import-checked, and boot-tested:
- Models: `Collection`, `Product`, `Project`, `User`, `ContactEnquiry`,
  `NewsletterSubscriber`
- Full CRUD for Collections/Products/Projects with pagination, filtering,
  and `/api/products/search`
- **Real authentication**: bcrypt password hashing, JWT access + refresh
  tokens in httpOnly cookies, `/api/auth/login|logout|refresh|me`,
  `requireAdmin` middleware gating all write routes and admin endpoints
- **Real contact/enquiry backend**: `POST /api/contact` with express-validator
  validation, stores to MongoDB, sends admin notification + user confirmation
  emails (see email note below), `GET/PUT /api/contact` for admin triage
- **Real newsletter backend**: `POST /api/newsletter/subscribe` with duplicate
  prevention (both a pre-check and a unique-index fallback for race conditions)
  and a confirmation email
- **Admin stats endpoint**: `GET /api/admin/stats` (live counts, not fake numbers)
- Admin bootstrap script: `npm run create-admin` reads `ADMIN_EMAIL` /
  `ADMIN_PASSWORD` from `.env` and creates the account — no hardcoded creds
- Email service wraps Nodemailer but **degrades honestly**: if SMTP env vars
  aren't set, it logs the intended email and returns `{ sent: false }` instead
  of throwing or silently pretending to send

**Frontend** (`/client`) — production build verified clean:
- Home, Collections (filters/search/pagination), Collection Detail, Product
  Detail, Enquiry basket (localStorage-backed, real add/remove)
- **Real Contact page**: client + server validation, submits to the live
  endpoint, carries products over from the Enquiry basket via router state
  when you arrive from "Continue to Contact Form"
- **Real newsletter signup** on the homepage, wired to the live endpoint
- **Public Projects pages**: `/projects` (category filter + pagination) and
  `/projects/:slug` (description, related collections, and a working
  fullscreen gallery — click-to-open, arrow-key and on-screen prev/next
  navigation, Escape to close). No swipe gesture on mobile yet — tap-to-open
  and on-screen arrows work, but touch swipe wasn't wired up.
- **Real admin auth flow**: `/admin/login` → session cookie → `ProtectedRoute`
  wrapper → `/admin` dashboard with live stats → CRUD UIs for Collections,
  Products, and Projects against the real API
- **Per-page SEO**: title, meta description, Open Graph/Twitter tags, and a
  canonical link set on every public page via a small `useSeo` hook (no
  external dependency). Admin/utility pages are marked `noindex`. This is
  client-side (set after React mounts) — a crawler that doesn't execute JS
  won't see it; real SSR/prerendering is out of scope here.
- **`/sitemap.xml` and `/robots.txt`** on the backend, generating from live
  published Collections/Products/Projects rather than a static file. Verified
  the `robots.txt` logic directly (no DB dependency); `sitemap.xml` needs a
  live DB to test and I don't have one in this sandbox, so its query logic is
  reviewed but unexercised.
- `client/vercel.json` — SPA fallback plus rewrites proxying `/sitemap.xml`
  and `/robots.txt` to the backend so they're served from the site's own
  domain. **The backend URL in it is a placeholder — edit it before
  deploying**, since Vercel rewrites can't reference env vars.
- Every nav/footer link points to a page that exists

## What's still missing from the original spec

This was never going to be a one-pass job. Still not built:

- **Admin CRUD UI** for everything except Collections/Products/Projects
  (Diary, Materials, Catalogues, Brand Tools, Representatives, FAQ, Showroom,
  Careers, Awards, Media)
- **Role-based authorization** beyond a single `admin` role check (EDITOR,
  PRESS, PROFESSIONAL roles exist in the User schema's enum but nothing
  branches on them yet)
- Public-facing pages: Diary/Journal, About, Professionals, Bespoke Design,
  Materials, Catalogues, Brand Tools, Representatives, Press, Showroom,
  Careers, FAQ
- Cloudinary media upload pipeline (seed data still uses Unsplash URLs;
  admin forms take raw image URLs, not file uploads)
- SampleRequest / BespokeEnquiry / Appointment / Job / JobApplication models
  and their forms — the Contact form covers these as an `enquiryType` enum
  value, not as dedicated flows with their own fields
- i18n (EN/IT), cookie consent banner, analytics abstraction
- Automated tests (Vitest/RTL/Supertest) — verification here has been manual
  static checks, not a test suite
- Deployment config for the backend (Render/Railway service config) —
  `client/vercel.json` exists but needs its placeholder URL edited

## The one thing I still can't verify

This sandbox cannot reach MongoDB's servers or run a persistent `mongod`, so
**no code in this project has been run against a live database with real
requests**. Every check here is: syntax-valid, imports cleanly, fails
predictably (not silently) when Mongo is unreachable, and the query/validation
logic reads correctly on inspection. That is not the same as watching
`POST /api/contact` actually insert a document and trigger `sendMail`. Point
`MONGO_URI` at a real Atlas cluster and this should work as written — but
"should" is doing real work in that sentence.

## Requirements

- Node.js 20+
- A MongoDB connection string (Atlas free tier, or local `mongod`)
- SMTP credentials if you want real emails (optional — falls back to logging)

## Installation

```bash
cd server && npm install && cp .env.example .env
cd ../client && npm install && cp .env.example .env
```

## MongoDB setup

Create a free MongoDB Atlas cluster, add a database user, allow your IP (or
`0.0.0.0/0` for local dev only), and put the connection string in
`server/.env` as `MONGO_URI`. Or run local `mongod` and use
`mongodb://127.0.0.1:27017/arcadia-surfaces`.

## Seed the database

```bash
cd server
npm run seed          # collections, products, projects
npm run create-admin  # reads ADMIN_EMAIL / ADMIN_PASSWORD from .env
```

## SMTP setup (optional)

Fill in `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`
in `server/.env`. Any standard SMTP provider works (SendGrid, Postmark,
Mailgun, or Gmail with an app password). Leave them blank during development
— emails will log to the console instead of failing.

## Local development

```bash
# terminal 1
cd server && npm run dev        # http://localhost:5000

# terminal 2
cd client && npm run dev        # http://localhost:5173
```

Visit `/admin/login` after running `create-admin` to reach the admin panel.

## Production build

```bash
cd client && npm run build      # outputs to client/dist
```

## Environment variables

**Server** (`server/.env`):
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://...
CLIENT_URL=http://localhost:5173
JWT_SECRET=...
JWT_REFRESH_SECRET=...
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me-now
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
MAIL_FROM="Arcadia Surfaces" <no-reply@example.com>
```

**Client** (`client/.env`):
```
VITE_API_URL=http://localhost:5000/api
VITE_SITE_URL=http://localhost:5173
```

## Deployment

- **Frontend**: `client/dist` to Vercel as a static SPA. You'll need to add
  a `vercel.json` rewrite sending all paths to `/index.html` — not included yet.
- **Backend**: Render/Railway/Fly as a standard Node service, same env vars.
- **Database**: MongoDB Atlas, same connection string as local dev.

## Troubleshooting

- `MONGO_URI is not set` — copy `.env.example` to `.env` in `server/`.
- `ECONNREFUSED` on server start — Mongo isn't reachable; check the URI, IP
  allowlist (Atlas), or that local `mongod` is running.
- CORS errors in the browser — check `CLIENT_URL` in `server/.env` matches
  the frontend's actual origin.
- Login succeeds but `/admin` bounces back to `/admin/login` — check that
  `JWT_SECRET` is set and that cookies aren't being blocked (third-party
  cookie settings in some browsers if frontend/backend are on different
  domains in production; `sameSite: "lax"` assumes same-site or a proxy).
