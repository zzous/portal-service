import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/portal-service' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/portal-service' : '',
  images: {
    unoptimized: true,
  },
  // API 라우트는 빌드 전에 제외됩니다
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

export default nextConfig;
