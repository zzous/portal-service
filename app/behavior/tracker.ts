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
    setInterval(() => {
      this.sendBehaviorData();
    }, 30000);
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

    const event: BehaviorEvent = {
      type: 'view',
      timestamp: 0,
      pagePath,
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
    const behavior = this.getCurrentBehavior();
    
    // 먼저 localStorage에 저장 (항상 작동)
    if (typeof window !== 'undefined') {
      const { ClientStorage } = await import('../lib/client-storage');
      ClientStorage.saveBehavior(behavior);
    }
    
    // MockAPI.io에 전송 (환경 변수 설정 시)
    if (typeof window !== 'undefined') {
      try {
        const { saveBehaviorToMockAPI } = await import('../lib/mockapi');
        await saveBehaviorToMockAPI(behavior);
      } catch (error) {
        // MockAPI 실패해도 계속 진행
        console.warn('[Tracker] MockAPI 전송 실패:', error);
      }
    }
    
    // 로컬 API가 있으면 서버에도 전송
    try {
      const response = await fetch('/api/behavior', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(behavior),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('[Tracker] 로컬 API 전송 성공:', {
          sessionId: behavior.sessionId,
          variant: behavior.variant,
          events: behavior.events.length,
          shouldRequestFeedback: data.shouldRequestFeedback,
        });
      } else {
        // API가 사용 불가능한 경우 - localStorage에만 저장됨
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          console.log('[Tracker] 로컬 API 없음, localStorage에 저장됨');
        } else {
          console.error('[Tracker] 로컬 API 전송 실패:', response.status);
        }
      }
    } catch (error) {
      // 네트워크 오류 등 - localStorage에만 저장됨
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.log('[Tracker] 로컬 API 없음, localStorage에 저장됨');
      } else {
        console.error('[Tracker] 로컬 API 전송 오류:', error);
      }
    }
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getVariant(): 'A' | 'B' {
    return this.variant;
  }
}

