import { BehaviorEvent, UserBehavior } from './types';
import { generateSessionId, getDeviceType } from './utils';

export class BehaviorTracker {
  private events: BehaviorEvent[] = [];
  private sessionId: string;
  private variant: 'A' | 'B';
  private pageStartTime: number;
  private currentPagePath: string;
  private maxScrollDepth: number = 0;
  private clickCount: number = 0;
  private pagesVisited: Set<string> = new Set();
  private autoSendInterval: NodeJS.Timeout | null = null;
  private isSending: boolean = false;

  constructor(variant: 'A' | 'B', pagePath: string = '/') {
    this.variant = variant;
    this.sessionId = generateSessionId();
    this.pageStartTime = Date.now();
    this.currentPagePath = pagePath;
    this.pagesVisited.add(pagePath);
    this.initializeTracking();
  }

  private initializeTracking(): void {
    if (typeof window === 'undefined') return;

    // 페이지뷰 추적
    this.trackPageView(this.currentPagePath);

    // 전역 클릭 추적
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const element = target.id || target.className || target.tagName;
      this.trackClick(element, {
        x: e.clientX,
        y: e.clientY,
      });
    };

    // 스크롤 추적
    const handleScroll = () => {
      const scrollDepth =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      this.trackScroll(scrollDepth);
    };

    // 이탈 의도 추적
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        this.trackExitIntent();
      }
    };

    // 페이지 언로드 시 데이터 전송
    const handleBeforeUnload = () => {
      this.sendBehaviorData();
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 주기적으로 데이터 전송 (30초마다)
    this.autoSendInterval = setInterval(() => {
      this.sendBehaviorData();
    }, 30000);
  }

  // 이벤트 리스너 정리 및 interval 정리
  cleanup(): void {
    if (this.autoSendInterval) {
      clearInterval(this.autoSendInterval);
      this.autoSendInterval = null;
    }
  }

  trackClick(element: string, metadata?: { x?: number; y?: number; [key: string]: unknown }): void {
    const event: BehaviorEvent = {
      type: 'click',
      element,
      timestamp: Date.now() - this.pageStartTime,
      value: metadata,
      pagePath: this.currentPagePath,
    };
    this.events.push(event);
    this.clickCount++;
  }

  trackScroll(depth: number): void {
    if (depth > this.maxScrollDepth) {
      this.maxScrollDepth = depth;
    }
    const event: BehaviorEvent = {
      type: 'scroll',
      timestamp: Date.now() - this.pageStartTime,
      value: depth,
      pagePath: this.currentPagePath,
    };
    this.events.push(event);
  }

  trackPageView(pagePath: string): void {
    this.currentPagePath = pagePath;
    this.pagesVisited.add(pagePath);
    this.pageStartTime = Date.now();
    this.maxScrollDepth = 0;
    this.clickCount = 0;

    // 메타데이터에서 페이지 정보 추출 (Analytics 용도)
    let pageTitle = '';
    let pageDescription = '';
    if (typeof window !== 'undefined') {
      pageTitle = document.title;
      const metaDescription = document.querySelector('meta[name="description"]');
      pageDescription = metaDescription?.getAttribute('content') || '';
    }

    const event: BehaviorEvent = {
      type: 'view',
      timestamp: 0,
      pagePath,
      value: JSON.stringify({
        title: pageTitle,
        description: pageDescription,
      }),
    };
    this.events.push(event);
  }

  trackExitIntent(): void {
    const event: BehaviorEvent = {
      type: 'exit',
      timestamp: Date.now() - this.pageStartTime,
      pagePath: this.currentPagePath,
    };
    this.events.push(event);
  }

  trackConversion(goal: string): void {
    const event: BehaviorEvent = {
      type: 'conversion',
      timestamp: Date.now() - this.pageStartTime,
      value: goal,
      pagePath: this.currentPagePath,
    };
    this.events.push(event);
  }

  getCurrentBehavior(): UserBehavior {
    const timeOnPage = Date.now() - this.pageStartTime;

    return {
      sessionId: this.sessionId,
      variant: this.variant,
      events: this.events,
      metadata: {
        pagePath: this.currentPagePath,
        deviceType: getDeviceType(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        timestamp: new Date(),
      },
      summary: {
        timeOnPage,
        scrollDepth: this.maxScrollDepth,
        clickCount: this.clickCount,
        pagesVisited: Array.from(this.pagesVisited),
      },
    };
  }

  async sendBehaviorData(): Promise<void> {
    // 중복 호출 방지
    if (this.isSending) {
      console.log('[Tracker] 이미 전송 중입니다. 중복 호출 무시.');
      return;
    }

    this.isSending = true;
    const behavior = this.getCurrentBehavior();
    
    try {
      // 먼저 localStorage에 저장 (항상 작동)
      if (typeof window !== 'undefined') {
        const { ClientStorage } = await import('../lib/client-storage');
        ClientStorage.saveBehavior(behavior);
      }
      
      // Supabase에 저장 (환경 변수가 설정된 경우)
      // Supabase는 클라이언트 사이드에서 직접 호출하므로 서버 API 불필요
      try {
        const { saveBehaviorToSupabase } = await import('../lib/supabase-storage');
        const result = await saveBehaviorToSupabase(behavior);
        if (result) {
          console.log('[Tracker] Supabase 저장 성공:', result.id);
        }
      } catch (error) {
        // Supabase 저장 실패는 조용히 처리 (localStorage는 이미 저장됨)
        console.log('[Tracker] Supabase 저장 건너뜀:', error instanceof Error ? error.message : 'Unknown error');
      }
    } finally {
      this.isSending = false;
    }
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getVariant(): 'A' | 'B' {
    return this.variant;
  }
}

