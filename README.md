# Zam Zam Pure Water System — Website

React 19 + TypeScript + Vite + Tailwind CSS v4 + React Three Fiber + Motion.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ (+ per-route SEO HTML + sitemap.xml)
npm run images   # re-optimise images from /raw into /public/images
```

## Before launch — confirm with the owner
All in `src/data/business.ts` unless noted:
- `SITE_URL` — final domain (also update `index.html` and `public/robots.txt`)
- `hours` — real opening hours (hidden while empty)
- `googleReviewUrl` — "Ask for reviews" link from Google Business Profile
- `serviceAreas` — localities actually served
- `src/data/reviews.ts` — add genuine Google reviews only

## Google Business Profile checklist
- Name, address and phone exactly as on the site: Zam Zam Pure Water System · 125/2 Jeevanandham Street, Near N.R. Mahal, Poondurai Road, Erode 638002 · +91 81899 71717
- Primary category: Water purification company (add Water filter supplier, Battery store as relevant)
- Add each service from the Services page; upload real shop / installation photos
- Website link → home page; submit `sitemap.xml` in Google Search Console
