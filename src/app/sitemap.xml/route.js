


import { getAllWordSlugs } from '@/lib/api';
// import { BASE_URL } from '@/lib/config';
const BASE_URL = process.env.NEXT_PUBLIC_SEO_DOMAIN;

export const dynamic = 'force-static';

export async function GET() {
  const slugs = await getAllWordSlugs();

  // Word detail pages (~10,000)
  // ✅ CHANGE: Use lang code (en/es/ru) instead of lf-lt
  const wordUrls = (slugs || []).map(
    (s) => `
  <url>
    <loc>${BASE_URL}/${s.lang}/${encodeURIComponent(s.word)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  );

  // General vocabulary pages (12 pages: en/es/ru × 4 sizes)
  // ✅ CHANGE: New route structure
  const generalSizes = [100, 300, 500, 1000, 2000, 3000, 5000, 10000];
  const generalLanguages = ['en', 'es', 'ru'];
  
  const generalUrls = [];
  for (const lang of generalLanguages) {
    for (const size of generalSizes) {
      generalUrls.push(`
  <url>
    <loc>${BASE_URL}/${lang}/vocabulary/${size}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
    }
  }

  // POS category pages (36 pages: 3 languages × 3 types × 4 sizes)
  // ✅ CHANGE: New route structure
  const posSizes = [100, 300, 500, 1000, 2000, 3000, 5000, 10000];
  const posTypes = ['verb', 'noun', 'adjective'];
  const posLanguages = ['en', 'es', 'ru'];

  const posUrls = [];
  for (const lang of posLanguages) {
    for (const pos of posTypes) {
      for (const size of posSizes) {
        posUrls.push(`
          <url>
            <loc>${BASE_URL}/${lang}/${pos}/${size}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.9</priority>
          </url>`);
        }
      }
    }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${wordUrls.join('')}
      ${generalUrls.join('')}
      ${posUrls.join('')}
    </urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
