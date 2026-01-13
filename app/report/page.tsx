import React from 'react';
import styles from './page.module.css';

export default function ReportPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>행태감지 시스템 구현 보고서</h1>

        <section className={styles.section}>
          <h2>1. 개요</h2>
          <p>
            본 프로젝트는 A/B 테스트와 피드백 수집을 연계한 행태감지 시스템을 구현하였습니다. 
            사용자의 행동 패턴을 실시간으로 분석하고, 적절한 시점에 피드백을 수집하여 A/B 테스트 결과를 도출하는 시스템입니다.
          </p>

          <h3>1.1 목적</h3>
          <ul>
            <li>사용자 행동 패턴 실시간 추적 및 분석</li>
            <li>A/B 테스트 버전별 사용자 반응 비교 분석</li>
            <li>행동 패턴 기반 자동 피드백 수집</li>
            <li>데이터 기반 의사결정 지원</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>2. 시스템 아키텍처</h2>
          
          <h3>2.1 전체 구조</h3>
          <div className={styles.architecture}>
            <div className={styles.layer}>
              <h4>클라이언트 사이드</h4>
              <ul>
                <li>BehaviorTracker (행동 추적)</li>
                <li>FeedbackManager (피드백 관리)</li>
                <li>ABTestWrapper (A/B 테스트)</li>
              </ul>
            </div>
            <div className={styles.arrow}>↓</div>
            <div className={styles.layer}>
              <h4>분석 및 시각화</h4>
              <ul>
                <li>Analysis Dashboard</li>
                <li>A/B 테스트 결과 분석</li>
              </ul>
            </div>
          </div>

          <h3>2.2 주요 구성 요소</h3>
          
          <div className={styles.component}>
            <h4>행동 추적 시스템 (BehaviorTracker)</h4>
            <p><strong>위치:</strong> <code>app/behavior/tracker.ts</code></p>
            <p><strong>기능:</strong></p>
            <ul>
              <li>클릭 이벤트 추적</li>
              <li>스크롤 깊이 측정</li>
              <li>페이지 체류 시간 계산</li>
              <li>이탈 의도 감지 (마우스 상단 이동)</li>
              <li>전환 이벤트 추적</li>
            </ul>
            <p><strong>데이터 수집 주기:</strong> 실시간 + 30초마다 배치 전송</p>
          </div>

          <div className={styles.component}>
            <h4>피드백 관리 시스템 (FeedbackManager)</h4>
            <p><strong>위치:</strong> <code>app/behavior/feedback-manager.ts</code></p>
            <p><strong>기능:</strong></p>
            <ul>
              <li>행동 패턴 기반 피드백 트리거 조건 확인</li>
              <li>피드백 데이터 수집 및 저장</li>
              <li>A/B 테스트 버전별 피드백 분석</li>
            </ul>
          </div>

          <div className={styles.component}>
            <h4>A/B 테스트 래퍼 (ABTestWrapper)</h4>
            <p><strong>위치:</strong> <code>app/components/ABTestWrapper.tsx</code></p>
            <p><strong>기능:</strong></p>
            <ul>
              <li>세션 기반 일관된 버전 할당 (A 또는 B)</li>
              <li>버전별 컴포넌트 렌더링</li>
              <li>행동 추적 및 피드백 수집 통합</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2>3. 핵심 기능</h2>

          <h3>3.1 행동 추적 기능</h3>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h4>클릭 이벤트</h4>
              <ul>
                <li>클릭된 요소 정보</li>
                <li>클릭 좌표 (x, y)</li>
                <li>클릭 시간</li>
              </ul>
            </div>
            <div className={styles.featureCard}>
              <h4>스크롤 이벤트</h4>
              <ul>
                <li>스크롤 깊이 (백분율)</li>
                <li>최대 스크롤 깊이 추적</li>
              </ul>
            </div>
            <div className={styles.featureCard}>
              <h4>페이지뷰</h4>
              <ul>
                <li>페이지 경로</li>
                <li>방문 시간</li>
              </ul>
            </div>
            <div className={styles.featureCard}>
              <h4>이탈 의도</h4>
              <ul>
                <li>마우스가 브라우저 상단으로 이동 시 감지</li>
              </ul>
            </div>
            <div className={styles.featureCard}>
              <h4>전환 이벤트</h4>
              <ul>
                <li>목표 달성 이벤트 (예: 버튼 클릭)</li>
              </ul>
            </div>
          </div>

          <h3>3.2 피드백 수집 시스템</h3>
          <div className={styles.triggerList}>
            <h4>피드백 트리거 조건</h4>
            <p>다음 조건 중 하나를 만족하면 자동으로 피드백 요청을 표시합니다:</p>
            <ul>
              <li><strong>체류 시간:</strong> 30초 이상 페이지에 머무름</li>
              <li><strong>스크롤 깊이:</strong> 50% 이상 스크롤</li>
              <li><strong>클릭 횟수:</strong> 5회 이상 클릭</li>
              <li><strong>이탈 의도:</strong> 마우스를 브라우저 상단으로 이동</li>
              <li><strong>전환 이벤트:</strong> 목표 달성 이벤트 발생</li>
            </ul>
          </div>

          <h3>3.3 A/B 테스트 연계</h3>
          <div className={styles.abtestInfo}>
            <div>
              <h4>버전 할당 방식</h4>
              <ul>
                <li>세션 기반 할당: 동일 세션에서는 일관된 버전 유지</li>
                <li>랜덤 할당: 새 세션 시 50:50 비율로 A/B 버전 할당</li>
                <li>수동 선택: 개발/테스트를 위한 버전 강제 선택 기능 제공</li>
              </ul>
            </div>
            <div>
              <h4>분석 지표</h4>
              <ul>
                <li>평균 평점</li>
                <li>평균 체류 시간</li>
                <li>전환율</li>
                <li>참여도 점수 (클릭 수 + 스크롤 깊이 기반)</li>
                <li>총 세션 수</li>
                <li>피드백 수</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>4. 데이터 저장 전략</h2>

          {/* <h3>4.1 이중 저장 구조</h3>
          <div className={styles.storageGrid}>
            <div className={styles.storageCard}>
              <h4>localStorage</h4>
              <p><strong>목적:</strong> 정적 사이트 배포 환경에서도 데이터 보존</p>
              <p><strong>위치:</strong> <code>app/lib/client-storage.ts</code></p>
              <p><strong>특징:</strong> 브라우저에 영구 저장, 서버 재시작과 무관</p>
            </div>
            <div className={styles.storageCard}>
              <h4>서버 메모리</h4>
              <p><strong>목적:</strong> 개발 환경에서 빠른 데이터 접근</p>
              <p><strong>위치:</strong> <code>app/lib/storage.ts</code></p>
              <p><strong>특징:</strong> 서버 재시작 시 초기화</p>
            </div>
            <div className={styles.storageCard}>
              <h4>MockAPI.io</h4>
              <p><strong>목적:</strong> 외부 API를 통한 영구 저장</p>
              <p><strong>위치:</strong> <code>app/lib/mockapi.ts</code></p>
              <p><strong>특징:</strong> 실제 데이터베이스처럼 작동, 영구 저장</p>
            </div>
          </div> */}

          <h3>4.1 데이터 흐름</h3>
          <div className={styles.flow}>
            <div className={styles.flowStep}>사용자 행동</div>
            <div className={styles.flowArrow}>↓</div>
            <div className={styles.flowStep}>BehaviorTracker (추적)</div>
            <div className={styles.flowArrow}>↓</div>
            <div className={styles.flowParallel}>
              <div className={styles.flowStep}>localStorage<br />(항상 저장)</div>
              <div className={styles.flowStep}>MockAPI.io<br />(항상 저장)</div>
              <div className={styles.flowStep}>로컬 API<br />(개발 환경)</div>
            </div>
            <div className={styles.flowArrow}>↓</div>
            <div className={styles.flowStep}>분석 시스템</div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>5. 구현 상세</h2>

          <h3>5.1 파일 구조</h3>
          <div className={styles.fileTree}>
            <div className={styles.treeItem}><strong>app/</strong></div>
            <div className={styles.treeItem} style={{ marginLeft: '20px' }}><strong>behavior/</strong></div>
            <div className={styles.treeItem} style={{ marginLeft: '40px' }}>types.ts - 타입 정의</div>
            <div className={styles.treeItem} style={{ marginLeft: '40px' }}>tracker.ts - 행동 추적 클래스</div>
            <div className={styles.treeItem} style={{ marginLeft: '40px' }}>feedback-manager.ts - 피드백 관리 클래스</div>
            <div className={styles.treeItem} style={{ marginLeft: '40px' }}>utils.ts - 유틸리티 함수</div>
            <div className={styles.treeItem} style={{ marginLeft: '20px' }}><strong>components/</strong></div>
            <div className={styles.treeItem} style={{ marginLeft: '40px' }}>BehaviorTracking.tsx - 행동 추적 컴포넌트</div>
            <div className={styles.treeItem} style={{ marginLeft: '40px' }}>FeedbackCollector.tsx - 피드백 수집 UI</div>
            <div className={styles.treeItem} style={{ marginLeft: '40px' }}>ABTestWrapper.tsx - A/B 테스트 래퍼</div>
            <div className={styles.treeItem} style={{ marginLeft: '20px' }}><strong>lib/</strong></div>
            <div className={styles.treeItem} style={{ marginLeft: '40px' }}>storage.ts - 서버 사이드 저장소</div>
            <div className={styles.treeItem} style={{ marginLeft: '40px' }}>client-storage.ts - 클라이언트 사이드 저장소</div>
            <div className={styles.treeItem} style={{ marginLeft: '40px' }}>mockapi.ts - MockAPI.io 연동</div>
            <div className={styles.treeItem} style={{ marginLeft: '20px' }}><strong>api/</strong></div>
            <div className={styles.treeItem} style={{ marginLeft: '40px' }}>behavior/route.ts - 행동 데이터 API</div>
            <div className={styles.treeItem} style={{ marginLeft: '40px' }}>feedback/route.ts - 피드백 API</div>
            <div className={styles.treeItem} style={{ marginLeft: '40px' }}>feedback/analysis/route.ts - 분석 API</div>
            <div className={styles.treeItem} style={{ marginLeft: '20px' }}><strong>demo/</strong></div>
            <div className={styles.treeItem} style={{ marginLeft: '40px' }}>page.tsx - A/B 테스트 데모 페이지</div>
            <div className={styles.treeItem} style={{ marginLeft: '20px' }}><strong>analysis/</strong></div>
            <div className={styles.treeItem} style={{ marginLeft: '40px' }}>page.tsx - 분석 결과 대시보드</div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>6. 사용자 인터페이스</h2>

          <div className={styles.uiGrid}>
            <div className={styles.uiCard}>
              <h3>데모 페이지 (`/demo`)</h3>
              <ul>
                <li>A/B 테스트 버전 선택 기능</li>
                <li>실시간 행동 추적 표시</li>
                <li>피드백 트리거 조건 안내</li>
                <li>버전별 UI 차이 시연</li>
              </ul>
            </div>
            <div className={styles.uiCard}>
              <h3>분석 대시보드 (`/analysis`)</h3>
              <ul>
                <li>버전별 지표 비교</li>
                <li>평균 평점, 체류 시간, 전환율 등 시각화</li>
                <li>실시간 데이터 새로고침</li>
                <li>버전 우위 분석</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>7. 기술 스택</h2>
          <div className={styles.techStack}>
            <div className={styles.techItem}>
              <strong>프레임워크:</strong> Next.js 16.1.1 (App Router)
            </div>
            <div className={styles.techItem}>
              <strong>언어:</strong> TypeScript 5
            </div>
            <div className={styles.techItem}>
              <strong>UI:</strong> React 19.2.3
            </div>
            <div className={styles.techItem}>
              <strong>스타일링:</strong> CSS Modules
            </div>
            <div className={styles.techItem}>
              <strong>배포:</strong> GitHub Pages
            </div>
            <div className={styles.techItem}>
              <strong>CI/CD:</strong> GitHub Actions
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>8. 주요 특징</h2>

          <h3>8.1 장점</h3>
          <div className={styles.advantages}>
            <div className={styles.advantageCard}>
              <h4>비침습적 추적</h4>
              <p>사용자 경험을 방해하지 않는 자동 추적</p>
            </div>
            <div className={styles.advantageCard}>
              <h4>실시간 분석</h4>
              <p>즉시 피드백 및 분석 결과 확인</p>
            </div>
            <div className={styles.advantageCard}>
              <h4>확장 가능</h4>
              <p>새로운 이벤트 타입 및 트리거 조건 추가 용이</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>9. 향후 개선 방향</h2>
          <div className={styles.future}>
            <ul>
              <li><strong>실시간 대시보드:</strong> WebSocket을 통한 실시간 데이터 업데이트</li>
              <li><strong>고급 분석:</strong> 머신러닝 기반 이상 행동 탐지</li>
              <li><strong>다중 테스트:</strong> 동시에 여러 A/B 테스트 실행 지원</li>
              <li><strong>데이터 내보내기:</strong> CSV/JSON 형식으로 데이터 내보내기 기능</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2>10. 결론</h2>
          <p className={styles.conclusion}>
            본 행태감지 시스템은 사용자의 행동 패턴을 실시간으로 추적하고 분석하여, A/B 테스트 결과를 도출하고 데이터 기반 의사결정을 지원합니다. 
          </p>
        </section>
      </div>
    </div>
  );
}

