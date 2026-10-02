# Daiviksatva — website

One-page site for Daiviksatva Holistic Health & Ayurveda Clinic, Sector 78, Mohali.

Built with Vite, React, Tailwind CSS v4, GSAP (ScrollTrigger) and Lenis smooth scrolling.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # serves the production build
```

## Deploy on Vercel

Import the repo in Vercel. It detects Vite automatically: the build command is `npm run build` and the output directory is `dist`.

Link previews (WhatsApp, Facebook, LinkedIn, X) need absolute URLs. The build fills them in from Vercel's production domain. After adding a custom domain, either redeploy or set a `SITE_URL` environment variable, for example `https://daiviksatva.com`.

## Link preview image

`public/og-image.jpg` (1200×630) and `public/apple-touch-icon.png` are generated from `design/og-image.html` and `public/favicon.svg`:

```bash
npm run og   # needs Google Chrome (macOS path by default, or set CHROME=/path/to/chrome)
```

WhatsApp caches previews per URL. After changing the image, bump `?v=` on the `og:image` tags in `index.html`.

## Structure

- `src/components/`: page sections (Hero, Treatments, Journey, Doctors, Reviews, Visit, Footer) plus shared primitives
- `src/lib/motion.js`: Lenis + GSAP setup, the image helper and the photo list
- `src/lib/hours.js`: clinic hours, live open/closed status (India time) and the booking-day list

## Before launch

- Replace the Unsplash photos with the clinic's own photos.
- Replace the sample reviews with real Google reviews, with the clinic's permission.
- Confirm doctor roles and bios, and add portraits.
