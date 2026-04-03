import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    localPatterns: [
      {
        pathname: '/api/images/**',
      },
      {
        pathname: '/logo.png',
      },
      {
        pathname: '/favicon.ico',
      },
      {
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;