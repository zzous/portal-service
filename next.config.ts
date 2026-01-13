import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 개발 모드에서는 API 라우트를 사용할 수 있도록 output: 'export' 제거
  // 빌드 시에만 정적 사이트로 생성
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  basePath: process.env.NODE_ENV === 'production' ? '/portal-service' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/portal-service' : '',
  images: {
    unoptimized: true,
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

export default nextConfig;
