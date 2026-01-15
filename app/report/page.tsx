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

          <h3>4.1 이중 저장 구조</h3>
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
              <h4>Supabase (예정)</h4>
              <p><strong>목적:</strong> 프로덕션 환경에서 영구 저장</p>
              <p><strong>위치:</strong> <code>app/lib/supabase-storage.ts</code></p>
              <p><strong>특징:</strong> PostgreSQL 기반, 영구 저장 및 실시간 동기화</p>
            </div>
          </div>

          <h3>4.2 데이터 흐름</h3>
          <div className={styles.flow}>
            <div className={styles.flowStep}>사용자 행동</div>
            <div className={styles.flowArrow}>↓</div>
            <div className={styles.flowStep}>BehaviorTracker (추적)</div>
            <div className={styles.flowArrow}>↓</div>
            <div className={styles.flowParallel}>
              <div className={styles.flowStep}>localStorage<br />(항상 저장)</div>
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
          <h2>10. 행태감지 시스템 구현 방식 비교</h2>

          <h3>10.1 일반적인 행태감지 시스템 구현 방식</h3>
          
          <div className={styles.approachGrid}>
            <div className={styles.approachCard}>
              <h4>클라이언트 사이드 추적 (현재 방식)</h4>
              <p><strong>대표 사례:</strong> Google Analytics, Mixpanel, Amplitude, Hotjar</p>
              <div className={styles.approachDetails}>
                <p><strong>구현 방식:</strong></p>
                <ul>
                  <li>JavaScript SDK를 클라이언트에 삽입</li>
                  <li>이벤트 리스너로 사용자 행동 추적</li>
                  <li>배치 전송 (30초~5분 간격)</li>
                  <li>실시간 전송 (중요 이벤트)</li>
                </ul>
                <p><strong>장점:</strong></p>
                <ul>
                  <li>✅ 실시간 데이터 수집</li>
                  <li>✅ 사용자 경험에 영향 최소화</li>
                  <li>✅ 서버 부하 분산</li>
                </ul>
                <p><strong>단점:</strong></p>
                <ul>
                  <li>❌ 브라우저 확장 프로그램으로 차단 가능</li>
                  <li>❌ 네트워크 오류 시 데이터 손실 가능</li>
                </ul>
              </div>
            </div>

            <div className={styles.approachCard}>
              <h4>서버 사이드 추적</h4>
              <p><strong>대표 사례:</strong> 로그 분석 시스템, 백엔드 이벤트 추적</p>
              <div className={styles.approachDetails}>
                <p><strong>구현 방식:</strong></p>
                <ul>
                  <li>서버 로그 수집</li>
                  <li>API 엔드포인트에서 이벤트 기록</li>
                  <li>서버 측 세션 관리</li>
                </ul>
                <p><strong>장점:</strong></p>
                <ul>
                  <li>✅ 데이터 조작 불가능</li>
                  <li>✅ 보안성 높음</li>
                  <li>✅ 모든 요청 추적 가능</li>
                </ul>
                <p><strong>단점:</strong></p>
                <ul>
                  <li>❌ 클라이언트 측 상호작용 추적 어려움</li>
                  <li>❌ 서버 부하 증가</li>
                </ul>
              </div>
            </div>

            <div className={styles.approachCard}>
              <h4>하이브리드 방식</h4>
              <p><strong>대표 사례:</strong> Adobe Analytics, Segment</p>
              <div className={styles.approachDetails}>
                <p><strong>구현 방식:</strong></p>
                <ul>
                  <li>클라이언트에서 이벤트 수집</li>
                  <li>서버로 전송하여 검증 및 저장</li>
                  <li>양쪽 데이터 병합 분석</li>
                </ul>
                <p><strong>장점:</strong></p>
                <ul>
                  <li>✅ 데이터 정확성 향상</li>
                  <li>✅ 보안성과 실시간성 균형</li>
                </ul>
                <p><strong>단점:</strong></p>
                <ul>
                  <li>❌ 구현 복잡도 증가</li>
                  <li>❌ 인프라 비용 증가</li>
                </ul>
              </div>
            </div>
          </div>

          <h3>10.2 현재 프로젝트의 구현 방식</h3>
          
          <div className={styles.currentApproach}>
            <div className={styles.currentMethod}>
              <h4>클라이언트 사이드 추적</h4>
              <p><strong>일반적인 방식과의 비교:</strong></p>
              <ul>
                <li>✅ 표준적인 클라이언트 사이드 추적 방식</li>
                <li>✅ 배치 전송으로 네트워크 효율성 확보</li>
                <li>✅ localStorage로 오프라인 지원</li>
              </ul>
            </div>

            <div className={styles.currentMethod}>
              <h4>빌드 스크립트 처리 (특수한 경우)</h4>
              <p><strong>이 방식이 필요한 이유:</strong></p>
              <ul>
                <li>Next.js <code>output: &apos;export&apos;</code> (정적 사이트 생성) 사용</li>
                <li>GitHub Pages는 정적 호스팅만 지원</li>
                <li>API 라우트는 서버가 필요하므로 정적 빌드와 충돌</li>
              </ul>
              <p><strong>일반적인 프로젝트에서는:</strong></p>
              <ul>
                <li>❌ 이런 스크립트가 필요 없음</li>
                <li>✅ 서버가 있는 환경에서는 API 라우트 그대로 사용</li>
                <li>✅ Vercel, Netlify 등 서버리스 플랫폼 사용 시 자동 처리</li>
              </ul>
            </div>
          </div>

          <h3>10.3 업계 표준 방식</h3>
          
          <div className={styles.standardFlow}>
            <div className={styles.flowItem}>
              <h4>대규모 서비스</h4>
              <p>Google Analytics, Mixpanel</p>
              <div className={styles.flowDiagram}>
                클라이언트 SDK → 배치 전송 → 서버 수집 → 데이터베이스 → 분석
              </div>
            </div>
            <div className={styles.flowItem}>
              <h4>중소규모 서비스</h4>
              <p>직접 구현</p>
              <div className={styles.flowDiagram}>
                클라이언트 추적 → 직접 API 호출 → 데이터베이스 → 대시보드
              </div>
            </div>
            <div className={styles.flowItem}>
              <h4>현재 프로젝트</h4>
              <p>프로토타입/데모</p>
              <div className={styles.flowDiagram}>
                클라이언트 추적 → localStorage + 로컬 API → 분석
              </div>
            </div>
          </div>

          <h3>10.4 프로덕션 환경 권장 사항</h3>
          
          <div className={styles.recommendations}>
            <div className={styles.recommendationCard}>
              <h4>전용 분석 서비스 사용</h4>
              <p>Google Analytics, Mixpanel 등</p>
              <ul>
                <li>검증된 인프라</li>
                <li>자동 확장</li>
                <li>풍부한 분석 기능</li>
              </ul>
            </div>
            <div className={styles.recommendationCard}>
              <h4>하이브리드 클라우드 서비스</h4>
              <ul>
                <li>Segment (이벤트 수집)</li>
                <li>Amplitude (행동 분석)</li>
                <li>Hotjar (세션 리플레이)</li>
              </ul>
            </div>
          </div>

          <h3>10.5 현재 방식의 평가</h3>
          
          <div className={styles.evaluation}>
            <div className={styles.evalItem}>
              <h4>✅ 행동 추적 로직</h4>
              <p>업계 표준 방식과 유사 (클라이언트 사이드)</p>
            </div>
            <div className={styles.evalItem}>
              <h4>⚠️ 빌드 스크립트</h4>
              <p>특수한 환경(GitHub Pages) 때문에 필요한 임시 방편</p>
            </div>
            <div className={styles.evalItem}>
              <h4>✅ 데이터 저장</h4>
              <p>다중 저장소 전략은 좋은 접근</p>
            </div>
          </div>

          <div className={styles.improvement}>
            <h4>개선이 필요한 부분</h4>
            <ul>
              <li><strong>데이터베이스 연동:</strong> localStorage (임시) → PostgreSQL/MongoDB 연동</li>
              <li><strong>빌드 스크립트 제거:</strong> Vercel/Netlify 사용 또는 서버 환경 구축</li>
              <li><strong>데이터 검증 및 정제:</strong> 서버 측 검증 추가</li>
              <li><strong>실시간 분석:</strong> WebSocket 또는 Server-Sent Events</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2>11. 결론</h2>
          <p className={styles.conclusion}>
            본 행태감지 시스템은 사용자의 행동 패턴을 실시간으로 추적하고 분석하여, A/B 테스트 결과를 도출하고 데이터 기반 의사결정을 지원합니다. 
            클라이언트 사이드와 서버 사이드를 모두 활용한 이중 저장 구조로 다양한 배포 환경에서 안정적으로 작동하며, 
            향후 데이터베이스 연동을 통한 확장이 가능한 구조로 설계되었습니다.
            <br /><br />
            현재 구현 방식은 프로토타입/데모 목적에는 적합하며, 학습 및 개념 검증에는 우수합니다. 
            프로덕션 환경에서는 전용 데이터베이스 연동, 서버 측 검증, 실시간 분석 파이프라인 구축 등의 개선이 필요합니다.
          </p>
        </section>
      </div>
    </div>
  );
}

