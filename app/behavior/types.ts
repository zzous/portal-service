export interface BehaviorEvent {
  type: 'click' | 'scroll' | 'view' | 'hover' | 'exit' | 'conversion';
  element?: string; // 선택자 또는 요소 ID
  timestamp: number; // 상대 시간 (페이지 로드 후 ms)
  value?: any; // 추가 데이터 (스크롤 위치, 클릭 좌표 등)
  pagePath: string;
}

export interface UserBehavior {
  sessionId: string;
  userId?: string;
  variant: 'A' | 'B'; // A/B 테스트 버전
  events: BehaviorEvent[];
  metadata: {
    pagePath: string;
    referrer?: string;
    deviceType: 'mobile' | 'desktop' | 'tablet';
    userAgent?: string;
    timestamp: Date;
  };
  summary: {
    timeOnPage: number;
    scrollDepth: number;
    clickCount: number;
    pagesVisited: string[];
  };
}

export interface FeedbackTrigger {
  condition: 'time_on_page' | 'scroll_depth' | 'click_count' | 'exit_intent' | 'conversion';
  threshold: number;
  variant?: 'A' | 'B'; // 특정 버전에만 적용
}

export interface FeedbackData {
  sessionId: string;
  variant: 'A' | 'B';
  behaviorSummary: {
    timeOnPage: number;
    scrollDepth: number;
    clickCount: number;
    pagesVisited: string[];
  };
  feedback: {
    rating?: number;
    comment?: string;
    question?: string;
    timestamp: Date;
  };
}

export interface VariantAnalysis {
  variant: 'A' | 'B';
  avgRating: number;
  behaviorMetrics: {
    avgTimeOnPage: number;
    conversionRate: number;
    engagementScore: number;
    totalSessions: number;
  };
  feedbackCount: number;
}

