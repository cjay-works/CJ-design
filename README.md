# CJ Design

> Premium websites for businesses ready to look credible, get discovered, and move forward.

CJ Design creates modern, conversion-focused websites for ambitious local businesses, creators, and growing brands. Each project is shaped around the business, its customers, and the next action that matters.

## Website

- **Live website:** https://cjaydesign-qmuqbvus.manus.space/
- **Preview:** https://3000-ixe1o2kcozcw4hwl5ujqo-e59f67b4.sg2.manus.computer/
- **Vercel deployment:** https://cj-design.vercel.app/
- **Email:** cjaydesign063@gmail.com
- **Instagram:** https://www.instagram.com/cj_design00/?hl=en

## Services

CJ Design provides focused website solutions — no SaaS products:

- Customer landing page websites
- Portfolio websites
- Real estate websites
- E-commerce websites
- Gym and fitness studio websites
- Restaurant websites

## Starting prices

| Website type | Starting price | Optional maintenance |
| --- | ---: | ---: |
| Real Estate | ₹25,000 / $299 | ₹2,500/month |
| Gym / Fitness | ₹25,000 / $299 | ₹2,000/month |
| Restaurant | ₹25,000 / $299 | ₹2,000/month |
| E-Commerce / Portfolio | ₹40,000 / $499 | ₹3,000/month |

Prices are starting points. Custom requirements and advanced features are quoted separately.

## Included with every website

- Mobile responsive design
- Basic SEO setup
- Custom domain for one year
- Hosting for one year
- Contact and WhatsApp integration where applicable
- Clear enquiry or conversion paths
- Premium visual direction tailored to the business

## Website features by package

### Real Estate

Property listings, property detail pages, enquiry/contact form, WhatsApp CTA, responsive design, basic SEO, custom domain for one year, and hosting for one year.

### Gym / Fitness

Services and classes, membership enquiry, trainer section, gallery, contact form, responsive design, basic SEO, custom domain for one year, and hosting for one year.

### Restaurant

Menu, gallery, reservation or enquiry option, location/contact details, WhatsApp CTA, responsive design, basic SEO, custom domain for one year, and hosting for one year.

### E-Commerce / Portfolio

Product or portfolio showcase, shopping cart and checkout where applicable, payment gateway integration where applicable, contact form, responsive design, basic SEO, custom domain for one year, and hosting for one year.

## Why a CJ Design website helps a business grow

A strong digital front door helps a business:

1. Make a better first impression when prospects discover it.
2. Stay discoverable 24/7 through a clear online presence.
3. Build trust with polished design, structure, and useful information.
4. Generate more qualified enquiries by explaining the offer clearly.
5. Reduce friction with direct contact, WhatsApp, booking, menu, or checkout paths.

The goal is not simply to put pages online. It is to make the right next step feel obvious.

## Design system

- **Typography:** Outfit
- **Primary brand color:** CJ Cyan `#31d9ef`
- **Dark foundation:** Deep Ink `#080b14`
- **Visual direction:** Editorial luxury digital atelier
- **Brand mark:** Supplied CJ shield logo
- **Themes:** Dark mode and light mode with saved user preference

## Key website features

- Responsive single-page marketing website
- Dark/light theme toggle with `localStorage` persistence
- Supplied CJ shield logo used throughout the brand system
- Animated hero orb and ambient motion
- Scroll reveal interactions
- Responsive mobile navigation
- Gmail compose enquiry handoff
- Direct Gmail and Instagram CTAs
- Testimonial-ready trust section that avoids fabricated endorsements
- Browser favicon and Apple touch icon
- Backend lead capture through `POST /api/leads`
- Managed MySQL persistence for submitted enquiries
- Server-side validation, honeypot protection, and IP-based rate limiting
- Project-owner notification attempt for new leads
- Managed route manifest at `/manus-routes.json`

## Project structure

```text
.
├── app.config.ts
├── Dockerfile
├── README.md
├── package.json
├── plan.md
├── presentation-script.md
├── public/
│   ├── app.js
│   ├── index.html
│   ├── manus-routes.json
│   ├── manus-storage/
│   │   └── ChatGPTImageSep30,2026,04_35_50PM_d9705b1a.png
│   └── styles.css
├── server.js
├── vercel.json
└── package-lock.json
```

## Run locally

Requirements:

- Node.js 18+
- npm

Install and start the development server:

```bash
npm install
npm start
```

The website runs on [http://localhost:3000](http://localhost:3000).

Create a static build:

```bash
npm run build
```

The generated static site is written to `dist/`.

## Lead-generation backend

The contact form sends validated JSON to `POST /api/leads`. The server creates the managed MySQL `leads` table if needed and stores each enquiry with its name, email, website type, message, timestamp, and status. A server-side honeypot and rate limit help reduce automated submissions.

After a successful save, the browser opens a Gmail compose window addressed to `cjaydesign063@gmail.com` so the visitor can send a direct follow-up. The server also attempts a project-owner notification through the managed runtime. Direct server-to-Gmail delivery requires an enabled Gmail provider/connector; the current implementation does not expose credentials in the browser.

The server exposes `GET /health` for deployment readiness.

## Vercel deployment

The GitHub `main` branch is connected to the Vercel project `cj-design`, so pushes to `main` trigger a new deployment automatically. The `vercel.json` entrypoint runs the Node server as a Vercel function while preserving the same static site routes.

For the lead API to persist data on Vercel, configure the server-side `DATABASE_URL`, `MANUS_API_URL`, and `MANUS_API_KEY` environment variables in the Vercel project. Do not expose these values in browser code or commit them to Git.

## Enquiries

Use the website contact form or email **cjaydesign063@gmail.com** directly to discuss a new project.

## License

This repository contains the CJ Design website and brand assets. All CJ Design branding, logo artwork, copy, and visual assets remain the property of CJ Design unless otherwise stated.
