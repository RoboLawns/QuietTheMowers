# Quiet The Mowers — Project Guide

## Overview
Civic-tech platform turning #QuietTheMowers into local policy change. Astro 6 frontend with Cloudflare Pages (D1, R2), Clerk auth, Resend email, Stripe payments.

## Quick Start
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:4321)
npm run build        # Production build
npm run preview      # Preview production build
```

## Stack
- **Framework:** Astro 6 with Node.js adapter (dev) / Cloudflare adapter (prod)
- **Styling:** Tailwind CSS v4 (custom brand theme in `src/styles/global.css`)
- **Auth:** Clerk (`@clerk/astro`)
- **Database:** Cloudflare D1 (prod) / better-sqlite3 (dev)
- **Email:** Resend
- **Payments:** Stripe

## Project Structure
```
src/
├── layouts/Layout.astro     # Base layout with SEO, nav, footer
├── components/               # Shared components
│   ├── Nav.astro            # Navigation (auth-aware)
│   └── Footer.astro         # Footer with waitlist form
├── pages/                    # Routes (file-based routing)
│   ├── index.astro          # Homepage (static)
│   ├── campaigns/           # Campaign pages (SSR)
│   │   ├── index.astro      # Browse all campaigns
│   │   ├── new.astro        # Create campaign wizard
│   │   └── [slug]/          # Campaign detail, sign, manage
│   ├── dashboard/            # User dashboard (SSR)
│   ├── wall/                 # Testimonial wall
│   ├── measure/              # Measurement program
│   ├── admin/                # Admin dashboard
│   ├── blog/                 # Blog (static)
│   ├── learn/                # Guides (static)
│   ├── ordinances/           # Ordinance library (static)
│   ├── account/              # User account pages (SSR)
│   ├── api/                  # API endpoints (SSR)
│   ├── wins/                 # Wins map (SSR)
│   ├── share/                # Shareable assets
│   ├── u/[username]/         # Organizer profiles (SSR)
│   ├── privacy.astro         # Privacy policy
│   └── terms.astro           # Terms of service
├── utils/                    # Shared utilities
│   ├── db.ts                 # D1/local DB abstraction
│   ├── auth.ts               # Clerk auth helpers
│   ├── blog.ts               # Blog post data
│   ├── learn.ts              # Guide data
│   ├── ordinances.ts         # Ordinance data
│   ├── structured-data.ts    # JSON-LD schemas
│   └── seo.ts                # SEO utilities
├── styles/global.css         # Tailwind + custom theme
└── env.d.ts                  # TypeScript declarations
migrations/                   # SQL migration files for D1
```

## Page Modes
- **Static (prerendered):** homepage, manifesto, why, the-book, course, learn, blog, ordinances, about, contact, privacy, terms, share, measure (overview/rent/buy/protocol)
- **SSR (server-rendered):** campaigns (list/detail/sign/manage), dashboard, wall, account/*, admin/*, wins, u/[username], all API routes

## Key Patterns
- SSR pages have `export const prerender = false` at the top
- DB access: `import { getDBFromLocals } from '../../utils/db'; const db = getDBFromLocals(Astro.locals);`
- Auth: `import { getCurrentUser } from '../../utils/auth'; const user = await getCurrentUser(Astro.locals);`
- Layout always imported as: `import Layout from '../../layouts/Layout.astro';` (adjust `../` count by depth)

## Environment Variables (.env)
```
PUBLIC_CLERK_PUBLISHABLE_KEY=  # Clerk public key
CLERK_SECRET_KEY=              # Clerk secret key
RESEND_API_KEY=                # Resend email API key
STRIPE_SECRET_KEY=             # Stripe secret key
```

## Deployment
1. Switch adapter in `astro.config.mjs` to `@astrojs/cloudflare`
2. Create D1 database: `wrangler d1 create qtm-db`
3. Apply migrations: `wrangler d1 execute qtm-db --file=migrations/001_initial_schema.sql`
4. Set secrets: `wrangler secret put CLERK_SECRET_KEY`

## Lint & Typecheck
```bash
npx astro check       # TypeScript check
npm run build         # Full build (catches import errors)
```
