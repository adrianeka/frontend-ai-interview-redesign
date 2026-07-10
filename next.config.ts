import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
  edit start
  by: Zahra Hilyatul J
  date: 2026-06-29
  description: Added bodySizeLimit, proxyTimeout and proxyClientMaxBodySize to support uploading large video files
  */
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb'
    },
    proxyTimeout: 120000,
    proxyClientMaxBodySize: '500mb'
  },
  /*
  edit end
  */
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
