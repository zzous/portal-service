'use client';

import { useEffect, useRef, useState } from 'react';
import { BehaviorTracker } from '../behavior/tracker';
import { FeedbackCollector } from './FeedbackCollector';
import { usePathname } from 'next/navigation';

interface ABTestWrapperProps {
  variantA: React.ReactNode;
  variantB: React.ReactNode;
  testName?: string;
  forceVariant?: 'A' | 'B' | null;
}

export function ABTestWrapper({
  variantA,
  variantB,
  testName = 'default',
  forceVariant,
}: ABTestWrapperProps) {
  const [variant, setVariant] = useState<'A' | 'B' | null>(null);
  const [isClient, setIsClient] = useState(false);
  const trackerRef = useRef<BehaviorTracker | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    
    // 세션 스토리지에서 버전 확인 (일관성 유지)
    const storageKey = `ab-test-${testName}`;
    const storedVariant = sessionStorage.getItem(storageKey) as 'A' | 'B' | null;

    let currentVariant: 'A' | 'B';
    // 강제 버전이 있으면 우선 사용
    if (forceVariant) {
      currentVariant = forceVariant;
      sessionStorage.setItem(storageKey, currentVariant);
    } else if (storedVariant) {
      currentVariant = storedVariant;
    } else {
      // 새 세션이면 랜덤 할당
      currentVariant = Math.random() < 0.5 ? 'A' : 'B';
      sessionStorage.setItem(storageKey, currentVariant);
    }

    setVariant(currentVariant);
    console.log(`[ABTest] 버전 할당: ${currentVariant}`);

    // 트래커 초기화 (한 번만)
    if (!trackerRef.current) {
      trackerRef.current = new BehaviorTracker(currentVariant, pathname);
      console.log(`[ABTest] 트래커 초기화 완료: ${trackerRef.current.getSessionId()}`);
    } else {
      // 페이지 변경 시 업데이트
      trackerRef.current.trackPageView(pathname);
    }

    // 언마운트 시 데이터 전송
    return () => {
      if (trackerRef.current) {
        trackerRef.current.sendBehaviorData();
      }
    };
  }, [testName, pathname, forceVariant]);

  // 클라이언트 사이드에서만 렌더링
  if (!isClient || variant === null || !trackerRef.current) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>;
  }

  return (
    <>
      {variant === 'A' ? variantA : variantB}
      <FeedbackCollector variant={variant} tracker={trackerRef.current} />
    </>
  );
}

