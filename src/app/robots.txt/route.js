export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SEO_DOMAIN;

  const content = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
