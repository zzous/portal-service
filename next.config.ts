import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 개발 모드에서는 API 라우트를 사용할 수 있도록 output: 'export' 제거
  // 빌드 시에만 정적 사이트로 생성
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  // GitHub Pages는 basePath 필요, Netlify는 루트 경로 사용
  // GITHUB_PAGES 환경 변수가 설정되어 있으면 basePath 사용
  basePath: process.env.GITHUB_PAGES === 'true' ? '/portal-service' : '',
  assetPrefix: process.env.GITHUB_PAGES === 'true' ? '/portal-service' : '',
  images: {
    unoptimized: true,
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

export default nextConfig;
