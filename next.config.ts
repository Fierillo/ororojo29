import type { NextConfig } from "next";
import path from "path";

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
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;