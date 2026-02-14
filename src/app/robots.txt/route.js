export const dynamic = "force-static";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SEO_DOMAIN || "https://www.w9999.tech";

  const content = `User-agent: *
Disallow: /en/
Disallow: /ru/
Disallow: /es/
Allow: /top/

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
