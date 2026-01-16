import { UserBehavior, FeedbackTrigger, FeedbackData, VariantAnalysis } from './types';

export class FeedbackManager {
  private triggers: FeedbackTrigger[] = [
    { condition: 'time_on_page', threshold: 30000 }, // 30초 체류
    { condition: 'scroll_depth', threshold: 50 }, // 50% 스크롤
    { condition: 'exit_intent', threshold: 1 }, // 이탈 의도
    { condition: 'click_count', threshold: 5 }, // 5회 클릭
  ];

  checkFeedbackTriggers(behavior: UserBehavior): boolean {
    const { summary } = behavior;

    for (const trigger of this.triggers) {
      // 특정 버전에만 적용되는 트리거인 경우 체크
      if (trigger.variant && trigger.variant !== behavior.variant) {
        continue;
      }

      switch (trigger.condition) {
        case 'time_on_page':
          if (summary.timeOnPage >= trigger.threshold) {
            return true;
          }
          break;
        case 'scroll_depth':
          if (summary.scrollDepth >= trigger.threshold) {
            return true;
          }
          break;
        case 'click_count':
          if (summary.clickCount >= trigger.threshold) {
            return true;
          }
          break;
        case 'exit_intent':
          const hasExitIntent = behavior.events.some(
            (e) => e.type === 'exit' && e.timestamp >= trigger.threshold
          );
          if (hasExitIntent) {
            return true;
          }
          break;
        case 'conversion':
          const hasConversion = behavior.events.some((e) => e.type === 'conversion');
          if (hasConversion) {
            return true;
          }
          break;
      }
    }

    return false;
  }

  async collectFeedback(
    behavior: UserBehavior,
    feedback: { rating?: number; comment?: string; question?: string }
  ): Promise<void> {
    const feedbackData: FeedbackData = {
      sessionId: behavior.sessionId,
      variant: behavior.variant,
      behaviorSummary: behavior.summary,
      feedback: {
        ...feedback,
        timestamp: new Date(),
      },
    };

    // 먼저 localStorage에 저장 (항상 작동)
    if (typeof window !== 'undefined') {
      const { ClientStorage } = await import('../lib/client-storage');
      ClientStorage.saveFeedback(feedbackData);
    }

    // Supabase에 저장 (환경 변수가 설정된 경우)
    // Supabase는 클라이언트 사이드에서 직접 호출하므로 서버 API 불필요
    try {
      const { saveFeedbackToSupabase } = await import('../lib/supabase-storage');
      const result = await saveFeedbackToSupabase(feedbackData);
      if (result) {
        console.log('[Feedback] Supabase 저장 성공:', result.id);
      }
    } catch (error) {
      // Supabase 저장 실패는 조용히 처리 (localStorage는 이미 저장됨)
      console.log('[Feedback] Supabase 저장 건너뜀:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async analyzeVariantFeedback(variant: 'A' | 'B'): Promise<VariantAnalysis> {
    // GitHub Pages에서는 API 호출 건너뜀 (Netlify는 Functions 사용 가능)
    if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
      console.log('[Feedback] GitHub Pages 환경, 분석 API 호출 건너뜀');
      return {
        variant,
        avgRating: 0,
        behaviorMetrics: {
          avgTimeOnPage: 0,
          conversionRate: 0,
          engagementScore: 0,
          totalSessions: 0,
        },
        feedbackCount: 0,
      };
    }

    // 로컬 개발 환경 또는 Netlify에서 API 호출 시도
    if (typeof window !== 'undefined') {
      try {
        const response = await fetch(`/api/feedback/analysis?variant=${variant}`);
        
        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('text/html')) {
            // 정적 사이트 환경 - 기본값 반환
            return {
              variant,
              avgRating: 0,
              behaviorMetrics: {
                avgTimeOnPage: 0,
                conversionRate: 0,
                engagementScore: 0,
                totalSessions: 0,
              },
              feedbackCount: 0,
            };
          }
          // HTTP 에러는 조용히 처리하고 기본값 반환
          console.log(`[Feedback] 분석 API 실패 (${response.status})`);
          return {
            variant,
            avgRating: 0,
            behaviorMetrics: {
              avgTimeOnPage: 0,
              conversionRate: 0,
              engagementScore: 0,
              totalSessions: 0,
            },
            feedbackCount: 0,
          };
        }
        
        const data = await response.json();
        return data;
      } catch {
        console.log('[Feedback] 분석 API 호출 실패, 기본값 반환');
        return {
          variant,
          avgRating: 0,
          behaviorMetrics: {
            avgTimeOnPage: 0,
            conversionRate: 0,
            engagementScore: 0,
            totalSessions: 0,
          },
          feedbackCount: 0,
        };
      }
    }

    // 기본값 반환
    return {
      variant,
      avgRating: 0,
      behaviorMetrics: {
        avgTimeOnPage: 0,
        conversionRate: 0,
        engagementScore: 0,
        totalSessions: 0,
      },
      feedbackCount: 0,
    };
  }
}

