
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   output: 'export',
//   images: { unoptimized: true },
// };

// module.exports = nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ SEO optimization
  compress: true,
  poweredByHeader: false,

  // // ✅ Image optimization
  // images: {
  //   domains: ['www.YOUR-DOMAIN.com'],
  //   formats: ['image/avif', 'image/webp'],
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.w9999.tech',
      },
      {
        protocol: 'https',
        hostname: '**.cdn.w9999.tech', // wildcard
      },
    ],
  },

  // ✅ Security headers
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
    ];
  },

  // ✅ Redirects (if needed)
  redirects: async () => {
    return [
      {
        source: '/top-words/:lang',
        destination: '/top/:lang-words/100',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
