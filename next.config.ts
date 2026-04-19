import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: 'https',
        hostname: 'moho.com.vn',
      },
    ],
  },
  allowedDevOrigins: ['26.179.93.209', 'localhost:3000'],
};

export default nextConfig;
