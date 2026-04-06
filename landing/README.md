# PrepWise Landing Page

Marketing landing page for [PrepWise](https://prepwise.app) — an AI-powered meal planning iOS app.

Built with Next.js (static export), Tailwind CSS, Framer Motion, and Lucide icons. Deployed to Cloudflare Pages.

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_BUTTONDOWN_API_KEY` | Buttondown API key for email waitlist |
| `NEXT_PUBLIC_APP_STORE_URL` | App Store download URL (when live) |

The email form gracefully handles a missing API key during development (simulates success).

## Build

```bash
npm run build
# Output goes to out/
```

Preview the static build locally:

```bash
npx serve out
```

## Deployment — Cloudflare Pages

This site is deployed as a static export via Cloudflare Pages with GitHub integration.

### Setup

1. Push this repo to GitHub (`tmgavron/prepwise-landing`)
2. In Cloudflare dashboard → Workers & Pages → Create application → Pages → Connect to Git
3. Select the `prepwise-landing` repo
4. Configure build settings:
   - **Framework preset:** Next.js (Static HTML Export)
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
5. Add environment variables:
   - `NODE_VERSION` = `18`
   - `NEXT_PUBLIC_BUTTONDOWN_API_KEY` = your Buttondown API key
6. Deploy

### Auto-deploys

Every push to `main` triggers an automatic rebuild and deploy.
Pull requests get preview deployments on a unique URL.

### Custom Domain

After first deploy, add custom domain in Cloudflare Pages settings:
- `prepwise.app` (or whatever domain you own)
- Cloudflare handles SSL automatically

## Tech Stack

- **Next.js 16** — App Router, static export (`output: 'export'`)
- **Tailwind CSS v4** — utility-first styling with CSS-based theme
- **Framer Motion** — scroll-triggered animations
- **Lucide React** — icons
- **TypeScript** — type safety

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout, fonts, metadata
│   ├── page.tsx         # Landing page (composes sections)
│   └── globals.css      # Tailwind + PrepWise theme colors
├── components/
│   ├── Navbar.tsx       # Sticky nav with mobile menu
│   ├── Hero.tsx         # Hero with phone mockups
│   ├── Features.tsx     # 2x2 feature grid
│   ├── HowItWorks.tsx   # 3-step process
│   ├── Stats.tsx        # Stats/badges row
│   ├── EmailCapture.tsx # Waitlist email form (Buttondown)
│   └── Footer.tsx       # Legal links, social, copyright
└── lib/
    └── constants.ts     # Copy, URLs, feature data
```
