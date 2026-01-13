# 행태감지 시스템 구현 보고서

## 1. 개요

본 프로젝트는 A/B 테스트와 피드백 수집을 연계한 행태감지 시스템을 구현하였습니다. 사용자의 행동 패턴을 실시간으로 분석하고, 적절한 시점에 피드백을 수집하여 A/B 테스트 결과를 도출하는 시스템입니다.

### 1.1 목적
- 사용자 행동 패턴 실시간 추적 및 분석
- A/B 테스트 버전별 사용자 반응 비교 분석
- 행동 패턴 기반 자동 피드백 수집
- 데이터 기반 의사결정 지원

## 2. 시스템 아키텍처

### 2.1 전체 구조

```
┌─────────────────────────────────────────────────────────┐
│                    클라이언트 사이드                      │
├─────────────────────────────────────────────────────────┤
│  BehaviorTracker  │  FeedbackManager  │  ABTestWrapper  │
│  (행동 추적)      │  (피드백 관리)    │  (A/B 테스트)    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    데이터 저장 계층                       │
├─────────────────────────────────────────────────────────┤
│  localStorage (클라이언트)  │  서버 메모리 (개발 환경)   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    분석 및 시각화                         │
├─────────────────────────────────────────────────────────┤
│  Analysis Dashboard (A/B 테스트 결과 분석)                │
└─────────────────────────────────────────────────────────┘
```

### 2.2 주요 구성 요소

#### 2.2.1 행동 추적 시스템 (BehaviorTracker)
- **위치**: `app/behavior/tracker.ts`
- **기능**:
  - 클릭 이벤트 추적
  - 스크롤 깊이 측정
  - 페이지 체류 시간 계산
  - 이탈 의도 감지 (마우스 상단 이동)
  - 전환 이벤트 추적
- **데이터 수집 주기**: 실시간 + 30초마다 배치 전송

#### 2.2.2 피드백 관리 시스템 (FeedbackManager)
- **위치**: `app/behavior/feedback-manager.ts`
- **기능**:
  - 행동 패턴 기반 피드백 트리거 조건 확인
  - 피드백 데이터 수집 및 저장
  - A/B 테스트 버전별 피드백 분석

#### 2.2.3 A/B 테스트 래퍼 (ABTestWrapper)
- **위치**: `app/components/ABTestWrapper.tsx`
- **기능**:
  - 세션 기반 일관된 버전 할당 (A 또는 B)
  - 버전별 컴포넌트 렌더링
  - 행동 추적 및 피드백 수집 통합

## 3. 핵심 기능

### 3.1 행동 추적 기능

#### 3.1.1 추적 이벤트 유형
1. **클릭 이벤트**
   - 클릭된 요소 정보
   - 클릭 좌표 (x, y)
   - 클릭 시간

2. **스크롤 이벤트**
   - 스크롤 깊이 (백분율)
   - 최대 스크롤 깊이 추적

3. **페이지뷰**
   - 페이지 경로
   - 방문 시간

4. **이탈 의도**
   - 마우스가 브라우저 상단으로 이동 시 감지

5. **전환 이벤트**
   - 목표 달성 이벤트 (예: 버튼 클릭)

#### 3.1.2 수집 데이터 구조
```typescript
interface UserBehavior {
  sessionId: string;
  variant: 'A' | 'B';
  events: BehaviorEvent[];
  metadata: {
    pagePath: string;
    deviceType: 'mobile' | 'desktop' | 'tablet';
    userAgent: string;
    timestamp: Date;
  };
  summary: {
    timeOnPage: number;
    scrollDepth: number;
    clickCount: number;
    pagesVisited: string[];
  };
}
```

### 3.2 피드백 수집 시스템

#### 3.2.1 피드백 트리거 조건
시스템은 다음 조건 중 하나를 만족하면 자동으로 피드백 요청을 표시합니다:

1. **체류 시간**: 30초 이상 페이지에 머무름
2. **스크롤 깊이**: 50% 이상 스크롤
3. **클릭 횟수**: 5회 이상 클릭
4. **이탈 의도**: 마우스를 브라우저 상단으로 이동
5. **전환 이벤트**: 목표 달성 이벤트 발생

#### 3.2.2 피드백 데이터 구조
```typescript
interface FeedbackData {
  sessionId: string;
  variant: 'A' | 'B';
  behaviorSummary: {
    timeOnPage: number;
    scrollDepth: number;
    clickCount: number;
    pagesVisited: string[];
  };
  feedback: {
    rating?: number; // 1-5점
    comment?: string;
    question?: string;
    timestamp: Date;
  };
}
```

### 3.3 A/B 테스트 연계

#### 3.3.1 버전 할당 방식
- 세션 기반 할당: 동일 세션에서는 일관된 버전 유지
- 랜덤 할당: 새 세션 시 50:50 비율로 A/B 버전 할당
- 수동 선택: 개발/테스트를 위한 버전 강제 선택 기능 제공

#### 3.3.2 분석 지표
각 버전별로 다음 지표를 분석합니다:
- 평균 평점
- 평균 체류 시간
- 전환율
- 참여도 점수 (클릭 수 + 스크롤 깊이 기반)
- 총 세션 수
- 피드백 수

## 4. 데이터 저장 전략

### 4.1 이중 저장 구조

시스템은 두 가지 저장소를 병행 사용합니다:

1. **localStorage (클라이언트 사이드)**
   - 목적: 정적 사이트 배포 환경에서도 데이터 보존
   - 위치: `app/lib/client-storage.ts`
   - 특징: 브라우저에 영구 저장, 서버 재시작과 무관

2. **서버 메모리 (개발 환경)**
   - 목적: 개발 환경에서 빠른 데이터 접근
   - 위치: `app/lib/storage.ts`
   - 특징: 서버 재시작 시 초기화

### 4.2 데이터 흐름

```
사용자 행동
    ↓
BehaviorTracker (추적)
    ↓
┌─────────────┬─────────────┐
│ localStorage│  API 호출   │
│  (항상 저장)│ (가능시 전송)│
└─────────────┴─────────────┘
    ↓
분석 시스템
```

## 5. 구현 상세

### 5.1 파일 구조

```
app/
├── behavior/
│   ├── types.ts              # 타입 정의
│   ├── tracker.ts            # 행동 추적 클래스
│   ├── feedback-manager.ts   # 피드백 관리 클래스
│   └── utils.ts              # 유틸리티 함수
├── components/
│   ├── BehaviorTracking.tsx  # 행동 추적 컴포넌트
│   ├── FeedbackCollector.tsx # 피드백 수집 UI
│   └── ABTestWrapper.tsx    # A/B 테스트 래퍼
├── lib/
│   ├── storage.ts            # 서버 사이드 저장소
│   └── client-storage.ts     # 클라이언트 사이드 저장소
├── api/
│   ├── behavior/route.ts     # 행동 데이터 API
│   └── feedback/
│       ├── route.ts          # 피드백 API
│       └── analysis/route.ts # 분석 API
├── demo/
│   └── page.tsx              # A/B 테스트 데모 페이지
└── analysis/
    └── page.tsx              # 분석 결과 대시보드
```

### 5.2 주요 클래스 및 함수

#### BehaviorTracker
```typescript
class BehaviorTracker {
  // 행동 추적 메서드
  trackClick(element: string, metadata?: ClickMetadata): void
  trackScroll(depth: number): void
  trackPageView(pagePath: string): void
  trackExitIntent(): void
  trackConversion(goal: string): void
  
  // 데이터 전송
  sendBehaviorData(): Promise<void>
  getCurrentBehavior(): UserBehavior
}
```

#### FeedbackManager
```typescript
class FeedbackManager {
  // 피드백 트리거 확인
  checkFeedbackTriggers(behavior: UserBehavior): boolean
  
  // 피드백 수집
  collectFeedback(behavior: UserBehavior, feedback: FeedbackInput): Promise<void>
  
  // 분석
  analyzeVariantFeedback(variant: 'A' | 'B'): Promise<VariantAnalysis>
}
```

## 6. 사용자 인터페이스

### 6.1 데모 페이지 (`/demo`)
- A/B 테스트 버전 선택 기능
- 실시간 행동 추적 표시
- 피드백 트리거 조건 안내
- 버전별 UI 차이 시연

### 6.2 분석 대시보드 (`/analysis`)
- 버전별 지표 비교
- 평균 평점, 체류 시간, 전환율 등 시각화
- 실시간 데이터 새로고침
- 버전 우위 분석

## 7. 기술 스택

- **프레임워크**: Next.js 16.1.1 (App Router)
- **언어**: TypeScript 5
- **UI**: React 19.2.3
- **스타일링**: CSS Modules
- **배포**: GitHub Pages
- **CI/CD**: GitHub Actions

## 8. 주요 특징

### 8.1 장점
1. **비침습적 추적**: 사용자 경험을 방해하지 않는 자동 추적
2. **이중 저장 구조**: 다양한 배포 환경에서 작동
3. **실시간 분석**: 즉시 피드백 및 분석 결과 확인
4. **확장 가능**: 새로운 이벤트 타입 및 트리거 조건 추가 용이

## 9. 결론

본 행태감지 시스템은 사용자의 행동 패턴을 실시간으로 추적하고 분석하여, A/B 테스트 결과를 도출하고 데이터 기반 의사결정을 지원합니다. 클라이언트 사이드와 서버 사이드를 모두 활용한 이중 저장 구조로 다양한 배포 환경에서 안정적으로 작동하며, 향후 데이터베이스 연동을 통한 확장이 가능한 구조로 설계되었습니다.

