import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'A/B 테스트 데모',
  description: 'A/B 테스트와 행태감지 시스템 데모 페이지. 두 가지 버전을 비교하고 사용자 행동을 추적합니다.',
  keywords: ['A/B 테스트', '데모', '행태감지', '사용자 행동 추적'],
  openGraph: {
    title: 'A/B 테스트 데모 | 행태감지 시스템',
    description: 'A/B 테스트와 행태감지 시스템 데모 페이지',
    type: 'website',
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

