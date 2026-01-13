import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/portal-service' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/portal-service' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
