import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb'
    },
    proxyTimeout: 120000,
    proxyClientMaxBodySize: '500mb'
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ai-interview.jiwamu.de/api";
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
