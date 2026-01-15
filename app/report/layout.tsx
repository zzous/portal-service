import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '구현 보고서',
  description: '행태감지 시스템 구현 보고서. 시스템 아키텍처, 구현 방식, 업계 표준과의 비교를 포함합니다.',
  keywords: ['보고서', '구현', '아키텍처', '문서', '기술 문서'],
  openGraph: {
    title: '구현 보고서 | 행태감지 시스템',
    description: '행태감지 시스템 구현 보고서',
    type: 'website',
  },
};

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

