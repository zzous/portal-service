import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/portal-service' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/portal-service' : '',
  images: {
    unoptimized: true,
  },
  // API 라우트는 정적 빌드에서 자동으로 제외됩니다
};

export default nextConfig;
