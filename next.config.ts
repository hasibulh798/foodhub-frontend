import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

async rewrites() {
  return [
    {
      source: "/api/auth/:path*",        // ✅ আগে specific route
      destination: `${BACKEND_URL}/api/auth/:path*`,
    },
    {
      source: "/api/:path*",             // এরপর general route
      destination: `${BACKEND_URL}/api/:path*`,
    },
  ];
},
};

export default nextConfig;