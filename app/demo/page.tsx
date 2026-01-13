'use client';

import { useState, useEffect } from 'react';
import { ABTestWrapper } from '../components/ABTestWrapper';
import styles from './page.module.css';

// A 버전 컴포넌트
function VariantA() {
  return (
    <div className={styles.container}>
      <div className={styles.variantBadge}>버전 A</div>
      <h1 className={styles.title}>환영합니다!</h1>
      <p className={styles.description}>
        이것은 A 버전의 랜딩 페이지입니다. 더 밝고 친근한 디자인을 사용하고 있습니다.
      </p>
      <div className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>✨</div>
          <h3>간편한 사용</h3>
          <p>직관적인 인터페이스로 쉽게 이용하세요</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🔒</div>
          <h3>안전한 서비스</h3>
          <p>최고 수준의 보안으로 정보를 보호합니다</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>⚡</div>
          <h3>빠른 처리</h3>
          <p>실시간으로 빠르게 처리됩니다</p>
        </div>
      </div>
      <button 
        className={styles.ctaButton}
        onClick={() => {
          if (typeof window !== 'undefined') {
            alert('버전 A의 시작하기 버튼을 클릭하셨습니다!');
          }
        }}
      >
        시작하기
      </button>
    </div>
  );
}

// B 버전 컴포넌트
function VariantB() {
  return (
    <div className={styles.container}>
      <div className={styles.variantBadge}>버전 B</div>
      <h1 className={styles.title}>Welcome!</h1>
      <p className={styles.description}>
        이것은 B 버전의 랜딩 페이지입니다. 더 전문적이고 세련된 디자인을 사용하고 있습니다.
      </p>
      <div className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🎯</div>
          <h3>정확한 분석</h3>
          <p>데이터 기반으로 정확한 정보를 제공합니다</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🛡️</div>
          <h3>강력한 보안</h3>
          <p>엔터프라이즈급 보안 시스템을 갖추고 있습니다</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🚀</div>
          <h3>고성능</h3>
          <p>최적화된 시스템으로 빠른 성능을 제공합니다</p>
        </div>
      </div>
      <button 
        className={styles.ctaButton}
        onClick={() => {
          if (typeof window !== 'undefined') {
            alert('버전 B의 Get Started 버튼을 클릭하셨습니다!');
          }
        }}
      >
        Get Started
      </button>
    </div>
  );
}

export default function DemoPage() {
  const [currentVariant, setCurrentVariant] = useState<string>('로딩 중...');
  const [forceVariant, setForceVariant] = useState<'A' | 'B' | null>(null);

  useEffect(() => {
    const variant = sessionStorage.getItem('ab-test-landing-page') || '할당 중...';
    setCurrentVariant(variant);
    
    // URL 파라미터에서 버전 확인
    const urlParams = new URLSearchParams(window.location.search);
    const urlVariant = urlParams.get('variant') as 'A' | 'B' | null;
    if (urlVariant && (urlVariant === 'A' || urlVariant === 'B')) {
      setForceVariant(urlVariant);
      sessionStorage.setItem('ab-test-landing-page', urlVariant);
      setCurrentVariant(urlVariant);
    }
  }, []);

  const handleVariantChange = (variant: 'A' | 'B') => {
    sessionStorage.setItem('ab-test-landing-page', variant);
    setForceVariant(variant);
    setCurrentVariant(variant);
    window.location.reload();
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>A/B 테스트 데모</h2>
        <p>페이지를 탐색하고 행동을 보여주세요. 특정 조건을 만족하면 피드백 요청이 나타납니다.</p>
        <div className={styles.status}>
          <p>현재 할당된 버전: <strong>{currentVariant}</strong></p>
          <div className={styles.variantSelector}>
            <button
              className={`${styles.variantButton} ${currentVariant === 'A' ? styles.active : ''}`}
              onClick={() => handleVariantChange('A')}
            >
              버전 A 보기
            </button>
            <button
              className={`${styles.variantButton} ${currentVariant === 'B' ? styles.active : ''}`}
              onClick={() => handleVariantChange('B')}
            >
              버전 B 보기
            </button>
          </div>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
            브라우저 콘솔(F12)에서 상세 로그를 확인할 수 있습니다.
          </p>
        </div>
        <div className={styles.info}>
          <p>💡 <strong>피드백 트리거 조건:</strong></p>
          <ul>
            <li>30초 이상 페이지에 머무르기</li>
            <li>50% 이상 스크롤하기</li>
            <li>5회 이상 클릭하기</li>
            <li>이탈 의도 감지 (마우스를 브라우저 상단으로 이동)</li>
          </ul>
        </div>
      </div>

      <ABTestWrapper 
        variantA={<VariantA />} 
        variantB={<VariantB />} 
        testName="landing-page"
        forceVariant={forceVariant}
      />
    </div>
  );
}

