'use client';

import { useState } from 'react';
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

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>서비스 소개</h2>
        <p className={styles.longText}>
          스타뱅킹 포털은 고객님의 금융 생활을 더욱 편리하게 만들어 드립니다.
          언제 어디서나 스마트폰 하나로 계좌 조회, 이체, 결제까지 한 번에 처리할 수 있어요.
          복잡한 절차 없이 간단한 인증만으로 안전하게 이용하실 수 있습니다.
        </p>
        <p className={styles.longText}>
          우리는 사용자 경험을 최우선으로 생각합니다. 불필요한 단계를 줄이고,
          자주 쓰는 기능은 한 화면에서 바로 실행할 수 있도록 설계했습니다.
          고객센터 역시 24시간 채팅과 전화로 연결되어 있어 궁금한 점을 빠르게 해결할 수 있습니다.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>이용 방법</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNum}>1</span>
            <h4>회원가입</h4>
            <p>이메일 또는 간편 가입으로 1분 만에 시작하세요.</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNum}>2</span>
            <h4>본인 인증</h4>
            <p>휴대폰 인증으로 안전하게 본인 확인을 완료합니다.</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNum}>3</span>
            <h4>서비스 이용</h4>
            <p>계좌 개설 후 바로 모든 금융 서비스를 이용할 수 있습니다.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>자주 묻는 질문</h2>
        <div className={styles.faqList}>
          <div className={styles.faqItem}>
            <h4 className={styles.faqQ}>수수료는 얼마인가요?</h4>
            <p className={styles.faqA}>기본 계좌 이용 및 이체는 무료입니다. 해외송금 등 일부 서비스에만 수수료가 부과됩니다.</p>
          </div>
          <div className={styles.faqItem}>
            <h4 className={styles.faqQ}>보안은 어떻게 되나요?</h4>
            <p className={styles.faqA}>금융권 수준의 암호화와 이중 인증을 적용하여 고객 자산과 정보를 안전하게 보호합니다.</p>
          </div>
          <div className={styles.faqItem}>
            <h4 className={styles.faqQ}>해지 방법은?</h4>
            <p className={styles.faqA}>앱 내 설정에서 언제든지 해지할 수 있으며, 잔액이 있으면 전액 출금 후 처리됩니다.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>고객 후기</h2>
        <p className={styles.longText}>
          &ldquo;이전에 쓰던 뱅킹 앱보다 훨씬 직관적이에요. 부모님께도 추천했더니 금방 적응하시더라고요.&rdquo;
          — 김○○ 님
        </p>
        <p className={styles.longText}>
          &ldquo;해외송금 수수료가 저렴해서 해외 거주 자녀에게 용돈 보낼 때 자주 씁니다.&rdquo;
          — 이○○ 님
        </p>
      </section>

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

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>About Our Service</h2>
        <p className={styles.longText}>
          Star Banking Portal delivers a professional banking experience for modern users.
          Manage accounts, transfers, and payments from a single dashboard with enterprise-grade security.
          We minimize friction through clear workflows and one-tap access to frequently used actions.
        </p>
        <p className={styles.longText}>
          Our platform is built for reliability and scale. Every transaction is encrypted end-to-end,
          and we offer 24/7 support via chat and phone. Whether you are an individual or a business,
          you can tailor the experience to your needs and stay in control of your finances.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNum}>1</span>
            <h4>Sign Up</h4>
            <p>Register with email or a social account in under a minute.</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNum}>2</span>
            <h4>Verify Identity</h4>
            <p>Complete secure verification with your mobile device.</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNum}>3</span>
            <h4>Start Using</h4>
            <p>Open an account and access all financial services immediately.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>FAQ</h2>
        <div className={styles.faqList}>
          <div className={styles.faqItem}>
            <h4 className={styles.faqQ}>What are the fees?</h4>
            <p className={styles.faqA}>Standard accounts and domestic transfers are free. Fees apply only to selected services such as international transfers.</p>
          </div>
          <div className={styles.faqItem}>
            <h4 className={styles.faqQ}>How is my data protected?</h4>
            <p className={styles.faqA}>We use bank-level encryption and multi-factor authentication to safeguard your assets and personal information.</p>
          </div>
          <div className={styles.faqItem}>
            <h4 className={styles.faqQ}>How do I close my account?</h4>
            <p className={styles.faqA}>You can close your account at any time from Settings. Withdraw any remaining balance before completing the process.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
        <p className={styles.longText}>
          &ldquo;Cleaner and easier to use than my previous bank app. I recommended it to my family and they got started right away.&rdquo;
          — Customer A
        </p>
        <p className={styles.longText}>
          &ldquo;Low fees on international transfers—I use it often to send money to my children abroad.&rdquo;
          — Customer B
        </p>
      </section>

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

function getInitialVariant() {
  if (typeof window === 'undefined') return '할당 중...';
  const urlParams = new URLSearchParams(window.location.search);
  const v = urlParams.get('variant');
  if (v === 'A' || v === 'B') {
    sessionStorage.setItem('ab-test-landing-page', v);
    return v;
  }
  return sessionStorage.getItem('ab-test-landing-page') || '할당 중...';
}

function getInitialForceVariant(): 'A' | 'B' | null {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  const v = urlParams.get('variant');
  return v === 'A' || v === 'B' ? v : null;
}

export default function DemoPage() {
  const [currentVariant, setCurrentVariant] = useState<string>(getInitialVariant);
  const [forceVariant, setForceVariant] = useState<'A' | 'B' | null>(getInitialForceVariant);

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

