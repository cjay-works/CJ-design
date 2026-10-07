# CJ Design Website Plan

## Product scope
A premium single-page marketing website for CJ Design, a modern website studio offering customer landing pages, portfolio websites, real estate websites, e-commerce websites, gym studio websites, restaurant websites, and financial advisor websites. The page must present exact pricing, explain business growth outcomes, and drive enquiries through Gmail, Instagram, WhatsApp-oriented CTAs, and a responsive contact form UI. It intentionally does not offer SaaS products.

## Design direction
- **Design movement:** Editorial luxury digital atelier — dark cinematic surfaces, electric cyan accents, large confident typography, and a restrained art-directed composition rather than a generic SaaS dashboard.
- **Core principles:** (1) make the brand feel crafted, not templated; (2) keep every section tied to client growth or conversion; (3) use negative space and asymmetry to create premium rhythm; (4) make contact actions obvious without becoming noisy.
- **Color philosophy:** Near-black blue surfaces create depth and focus. CJ cyan is the signature ownable color, used like light catching polished glass. Soft ice text carries clarity; muted lavender and slate support hierarchy without competing with the logo.
- **Layout paradigm:** A vertical editorial scroll with a floating glass navigation bar, offset section headers, a hero split between proof-led copy and a framed logo orb, and pricing arranged as a staggered service menu rather than a rigid SaaS grid.
- **Signature elements:** (1) a floating cyan halo/orb around the supplied CJ shield logo; (2) fine-line blueprint grid and orbital rings; (3) oversized section numerals and metallic gradient text.
- **Interaction philosophy:** Every interaction should feel like a precise physical object: cards lift subtly, buttons magnetize on hover, and the contact flow stays one scroll or one click away.
- **Animation:** Use slow orbital movement and ambient pulse in the hero; reveal sections on scroll with small translate/fade transitions; use hover lift and glow only on actionable cards. Respect `prefers-reduced-motion`.
- **Typography system:** Outfit throughout, with 800-weight display headlines, 600-weight labels, 400–500 body copy, tight tracking on eyebrow labels, and generous line-height for explanatory copy.
- **Brand essence:** Premium websites for ambitious local businesses that want to look credible, get discovered, and convert attention into enquiries. Personality: assured, sharp, warm.
- **Brand voice:** Direct, intelligent, outcome-led. Example lines: “Your next customer is already looking for you.” and “A sharper website makes the whole business feel sharper.”
- **Wordmark & logo:** Use the supplied CJ shield as the hero mark, paired with a custom-spaced `CJ DESIGN` wordmark in Outfit with a small `DIGITAL ATELIER` descriptor.
- **Signature brand color:** CJ Cyan `#31d9ef`, backed by deep ink `#080b14` and electric blue `#4f6bff` as a restrained secondary glow.

## Implementation approach
- Static HTML/CSS/JS served by a tiny Node HTTP server on port 3000.
- Keep the application dependency-free for reliable preview and simple static deployment.
- Support an accessible dark/light theme toggle with a dark default and localStorage persistence.
- Use the uploaded logo at `/manus-storage/ChatGPTImageSep30,2026,04_35_50PM_d9705b1a.png`.
- Use a Gmail compose URL form handoff so enquiries open a Gmail composition addressed to `cjaydesign063@gmail.com`, with direct Gmail and Instagram links throughout.
- Include an honest, testimonial-ready trust section: show the outcomes the experience is designed to earn, and clearly reserve verified client quotes for approved future proof.
- Persist contact-form leads in a managed MySQL `leads` table through `POST /api/leads`, with server-side validation, a honeypot, rate limiting, and project-owner notifications; the browser retains Gmail compose as a direct follow-up fallback.
- Provide `public/manus-routes.json` with the single `/` route.

## Project structure
- `public/index.html` — page structure, copy, service/pricing content, contact UI.
- `public/styles.css` — design tokens, responsive layout, floating motion, hover/reveal states.
- `public/app.js` — scroll reveal, pointer parallax, nav state, menu toggle, form-to-Gmail-compose behavior.
- `server.js` — static serving, `/api/leads` persistence and notifications, and `/health` readiness endpoint.
- `Dockerfile` — production container for the server-enabled deployment.
- `public/manus-routes.json` — managed route manifest.
- `server.js` — dependency-free static file server.
- `app.config.ts` — platform logo metadata.
