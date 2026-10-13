// After `vite build`: writes a static index.html per route with the correct <title>, description
// and canonical (helps crawlers, link previews and static hosts), plus sitemap.xml.
// Uses Node's built-in TypeScript type stripping to read the data files directly.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { routeMeta } from '../src/data/seo.ts';
import { products, seoName } from '../src/data/products.ts';
import { SITE_URL } from '../src/data/business.ts';

const dist = new URL('../dist/', import.meta.url);
const template = await readFile(new URL('index.html', dist), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const pages = [
  ...Object.values(routeMeta),
  ...products.map((p) => ({
    path: `/products/${p.slug}`,
    title: `${seoName(p)} in Erode | Zam Zam Pure Water System`,
    description: `${p.tagline} ${p.summary}`.slice(0, 158),
  })),
];

for (const page of pages) {
  const url = `${SITE_URL}${page.path === '/' ? '/' : page.path}`;
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${esc(page.description)}"`)
    .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`)
    .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${esc(page.title)}"`)
    .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${esc(page.description)}"`);
  if (page.path === '/') {
    await writeFile(new URL('index.html', dist), html);
  } else {
    const dir = new URL(`.${page.path}/`, dist);
    await mkdir(dir, { recursive: true });
    await writeFile(new URL('index.html', dir), html);
  }
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map((p) => `  <url><loc>${SITE_URL}${p.path === '/' ? '/' : p.path}</loc><lastmod>${today}</lastmod><priority>${p.path === '/' ? '1.0' : p.path.startsWith('/products/') ? '0.7' : '0.8'}</priority></url>`)
  .join('\n')}
</urlset>
`;
await writeFile(new URL('sitemap.xml', dist), sitemap);
// SPA fallback for Netlify-style hosts.
await writeFile(new URL('_redirects', dist), '/*  /index.html  200\n');
console.log(`SEO: ${pages.length} route pages + sitemap.xml written.`);
