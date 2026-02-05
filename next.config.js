/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  // Helps avoid issues on static hosts (Render) when using next/image
  images: {
    unoptimized: true,
  },

  // Optional: make builds less likely to fail on lint/type errors (remove if you want strict)
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

// module.exports = nextConfig;
export default nextConfig;
