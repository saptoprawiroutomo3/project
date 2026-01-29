/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  // Enable server-side features for API routes
  serverExternalPackages: ['mongoose'],
};

module.exports = nextConfig;
