import type { NextConfig } from "next";

const nextConfig: NextConfig = {
     eslint: {
    ignoreDuringBuilds: true,  // 👈 this skips ESLint errors in production builds
  },
};

export default nextConfig;
