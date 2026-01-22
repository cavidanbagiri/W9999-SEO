// import { getAllWordSlugs } from '@/lib/api';

// export async function GET() {
//   const slugs = await getAllWordSlugs();

//   const urls = slugs.map(
//     (s) => `
//   <url>
//     <loc>https://www.w9999.app/${s.lf}-${s.lt}/${s.word}</loc>
//     <changefreq>weekly</changefreq>
//     <priority>0.8</priority>
//   </url>`
//   );

//   const xml = `<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//   ${urls.join('')}
// </urlset>`;

//   return new Response(xml, {
//     headers: { 'Content-Type': 'application/xml' },
//   });
// }
import { getAllWordSlugs } from '@/lib/api';

export const dynamic = 'force-static'; // ← ADD THIS LINE

export async function GET() {
  const slugs = await getAllWordSlugs();

  const urls = (slugs || []).map(
    (s) => `
  <url>
    <loc>https://www.w9999.app/${s.lf}-${s.lt}/${s.word}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}