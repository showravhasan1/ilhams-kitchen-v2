import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
    inlineCss: true,
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
