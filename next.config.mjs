// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // send humans to the SPA while keeping HTML for Google
  async rewrites() {
    return [
      {
        source: '/app/:path*',
        destination: 'https://app.w9999.app/:path*',
      },
    ];
  },
};

module.exports = nextConfig;