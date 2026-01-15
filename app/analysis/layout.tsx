import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '분석 결과',
  description: 'A/B 테스트 분석 결과를 확인할 수 있는 대시보드. 버전별 지표 비교 및 통계를 제공합니다.',
  keywords: ['분석', 'A/B 테스트', '통계', '대시보드', '데이터 분석'],
  openGraph: {
    title: '분석 결과 | 행태감지 시스템',
    description: 'A/B 테스트 분석 결과 대시보드',
    type: 'website',
  },
};

export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

