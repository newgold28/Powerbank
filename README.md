# AbiWande Events & Concierge — Website

A premium, mobile-friendly website for **AbiWande Events & Concierge**, an event
planning and concierge business in Manchester, UK.

> **You Celebrate, We Handle the Rest.**

Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 ·
Supabase** (database, auth, storage) · **Resend** (optional email).

---

## 1. What's included

| Page | Route | Purpose |
| --- | --- | --- |
| Home | `/` | Hero, 16 services, featured portfolio, why us, how it works, CTA |
| Services | `/services` | All 16 services grouped into 5 sections |
| Our Work | `/portfolio` | Filterable gallery + lightbox (keyboard accessible) |
| About Us | `/about` | Editable biography + portrait |
| Request a Booking | `/book` | 5-step enquiry wizard with validation |
| Contact | `/contact` | Verified call / WhatsApp / email / map links |
| Privacy Policy | `/privacy` | How enquiry data is used |
| Owner Dashboard | `/admin` | Private enquiries manager + portfolio uploader |

Plus: SEO metadata, Open Graph tags, `sitemap.xml`, `robots.txt`, a favicon,
lazy-loaded images, reduced-motion support, secure headers and accessible
navigation.

---

## 2. Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in the values you have
npm run dev                  # http://localhost:3000
```

The **public site works immediately** — no configuration required. Only the
booking form storage and the owner dashboard need Supabase (see §4).

Useful commands:

```bash
npm run dev       # local development
npm run build     # production build
npm run start     # run the production build
npm run lint      # ESLint
npx tsc --noEmit  # type-check
```

---

## 3. Brand, content & images

### Brand assets
- Colours and typography are defined in `src/app/globals.css` (Tailwind v4
  `@theme` tokens: `deep`, `bronze`, `lavender`, `charcoal`, `ivory`).
- Fonts: **Cormorant Garamond** (headings) + **Inter** (body), loaded in
  `src/app/layout.tsx`.

### Business details
All contact links live in **`src/lib/site.ts`** — phone, WhatsApp (with a
pre-filled message), email, Google Maps search and navigation. Update them in
one place.

### The 16 services
**`src/content/services.ts`** — titles, descriptions and grouping. Each card's
"Enquire" link opens `/book?service=<id>` with that service pre-selected.

### Portfolio photos
- 40 event photos from the supplied `abi` folder were optimised into
  `public/images/portfolio/` (max 1600 px, ~78% quality).
- **They are intentionally unlabelled** (category `Events`) so nothing is
  misrepresented. Add real titles, captions and categories in
  **`src/content/portfolio.ts`**, or through the dashboard.
- Hero / secondary / about images are `public/images/hero.jpg`,
  `hero-secondary.jpg`, `about.jpg` — replace these with your best shots.
- To re-generate optimised portfolio images from a source folder:

```bash
node scripts/process-images.mjs
node scripts/generate-portfolio.mjs
```

### Editable text placeholders
- About biography: `src/content/about.ts`
- Testimonials (hidden until filled): `src/content/testimonials.ts`

---

## 4. Connect the booking system + dashboard (Supabase)

Nothing is faked: until Supabase is connected, the booking form shows an
honest "this system isn't live yet" message with a mailto fallback instead of a
fake confirmation.

1. Create a project at <https://supabase.com> (free tier is fine).
2. Open **SQL Editor** and run **`supabase/schema.sql`** — it creates the
   `enquiries` and `portfolio_items` tables, Row Level Security policies and the
   `reference-images` (private) + `portfolio` (public) storage buckets.
3. **Project Settings → API**: copy the URL, `anon` key and `service_role` key
   into `.env.local`.
4. **Authentication → Users → Add user**: create the owner account
   (email `bookings.abiwandeevents@gmail.com` + a strong password, confirmed).
5. Set `ADMIN_EMAILS` in `.env.local` to that email so only she can reach
   `/admin`.
6. Restart the dev server. Submit a test enquiry — it should appear in
   `/admin` and be stored in the `enquiries` table.

### Email notifications (optional)
The form stores every enquiry even without email. To also receive an email:

1. Create a free account at <https://resend.com> and verify a sending domain.
2. Add `RESEND_API_KEY` and `RESEND_FROM` to `.env.local`.
3. New-enquiry notifications go to `BOOKINGS_NOTIFY_EMAIL` (defaults to the
   business inbox), and customers get a confirmation email. Private admin notes
   are never included in emails.

### Security notes
- Enquiries are readable/writable only by the authenticated owner (RLS).
  The public form can **insert only**.
- Reference images are private; signed links are generated server-side with the
  service-role key from the dashboard.
- The dashboard requires authentication and a server-side authorisation check
  (`src/lib/admin.ts`); `/admin` and `/api/` are blocked in `robots.txt`.

---

## 5. Booking flow (how it works)

1. Client submits an enquiry (5 steps) → stored as status **New**.
2. Owner reviews it in `/admin` → moves to **Reviewing**.
3. Owner sends a quotation, records it under *Agreed quotation*, moves to
   **Quote Sent**.
4. When agreed, the owner records deposit status and marks **Confirmed**.
   (Payment collection is intentionally **not** enabled yet — connect a
   payment provider such as Stripe later, or invoice manually.)
5. After the event, mark **Completed** (or **Declined** if it doesn't proceed).

Submitting the form never auto-confirms a booking — the confirmation message
makes this clear.

---

## 6. Deploy

Recommended: **Vercel** (zero-config for Next.js).

1. Push this folder to a Git repository (GitHub / GitLab).
2. Import it in Vercel.
3. Add the environment variables from `.env.example`.
4. In Supabase → Authentication → URL Configuration, add your production URL
   and `https://your-domain/api/auth/confirm` as a redirect URL.
5. Set `NEXT_PUBLIC_SITE_URL` to your live domain (used by metadata,
   `sitemap.xml` and Open Graph).

Any Node host works too (`npm run build && npm run start`).

---

## 7. Quick owner walkthrough

- **View the site:** run `npm run dev` and open the printed URL.
- **Manage enquiries:** go to `/admin`, sign in, click any enquiry to expand it.
  Change status, add private notes, record a quotation/deposit, and contact the
  client by email, phone or WhatsApp.
- **Add a portfolio project:** on `/admin`, under *Portfolio items*, click
  **Add project**, upload a photo, add a title/category/caption and save. It
  appears on `/portfolio` instantly.
- **Edit the 40 existing photos:** open `src/content/portfolio.ts`, set each
  item's `title`, `category`, `caption`, `location` and `date`.
- **Change any contact detail:** edit `src/lib/site.ts`.

---

## 8. Project structure

```
src/
  app/                 pages, API routes, sitemap/robots, favicon
  components/
    ui/                buttons, inputs, section, reveal, page header
    layout/            header, footer, logo, year
    home/              hero, services, portfolio, why-us, steps, CTA
    services/          service card + icon map
    portfolio/         filterable gallery + lightbox
    booking/           multi-step booking form
    admin/             login form, enquiries manager, portfolio manager
  content/             services, portfolio, about, testimonials (editable)
  lib/                 site config, Supabase clients, validation, email, utils
  proxy.ts             session refresh (Next 16 "middleware")
supabase/schema.sql    database + storage setup
scripts/               asset optimisation helpers
```
