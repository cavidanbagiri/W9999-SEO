import { getTopWords } from '@/lib/api';

const BASE_URL = process.env.NEXT_PUBLIC_SEO_DOMAIN;

export const dynamic = 'force-static';

export async function GET() {
  // Static pages
  const staticUrls = `
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  // Top category pages (96 pages: 12 categories × 8 sizes)
  const categories = [
    'english-words', 'spanish-words', 'russian-words',
    'english-verbs', 'spanish-verbs', 'russian-verbs',
    'english-nouns', 'spanish-nouns', 'russian-nouns',
    'english-adjectives', 'spanish-adjectives', 'russian-adjectives'
  ];
  const sizes = [100, 300, 500, 1000, 2000, 3000, 5000, 10000];

  const topUrls = [];
  for (const category of categories) {
    for (const size of sizes) {
      topUrls.push(`
  <url>
    <loc>${BASE_URL}/top/${category}/${size}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${topUrls.join('')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}

