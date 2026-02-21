// export const dynamic = "force-static";

// export async function GET() {
//   const baseUrl = process.env.NEXT_PUBLIC_SEO_DOMAIN || "https://www.w9999.tech";

//   const content = `User-agent: *
// Disallow: /en/
// Disallow: /ru/
// Disallow: /es/
// Allow: /top/

// Sitemap: ${baseUrl}/sitemap.xml
// `;

//   return new Response(content, {
//     headers: { "Content-Type": "text/plain; charset=utf-8" },
//   });
// }


// app/robots.txt/route.js
export const dynamic = "force-static";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SEO_DOMAIN || "https://www.w9999.tech";

  const content = `# robots.txt for w9999.tech
# Last updated: 2024

# Allow all search engines
User-agent: *

# BLOCK individual word pages (29,000+ pages) - IMPORTANT!
Disallow: /en/*/
Disallow: /ru/*/
Disallow: /es/*/

# ALLOW top word lists (these are your money pages)
Allow: /top/

# Optional: Also allow the language root pages if they exist
# Allow: /en/
# Allow: /ru/
# Allow: /es/

# Tell search engines where your sitemap is
Sitemap: ${baseUrl}/sitemap.xml

# Yandex-specific directives
Host: ${baseUrl}
Clean-param: utm_source&utm_medium&utm_campaign
`;

  return new Response(content, {
    headers: { 
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    },
  });
}