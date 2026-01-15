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
    let supabaseSaved = false;
    try {
      const { saveFeedbackToSupabase } = await import('../lib/supabase-storage');
      const result = await saveFeedbackToSupabase(feedbackData);
      if (result) {
        console.log('[Feedback] Supabase 저장 성공:', result.id);
        supabaseSaved = true;
      }
    } catch (error) {
      // Supabase 저장 실패는 조용히 처리 (localStorage는 이미 저장됨)
      console.log('[Feedback] Supabase 저장 건너뜀:', error instanceof Error ? error.message : 'Unknown error');
    }

    // Supabase 저장이 실패했거나 설정되지 않은 경우에만 로컬 API 호출
    // (Supabase가 있으면 API는 건너뛰고, Supabase가 없으면 API 사용)
    // GitHub Pages에서는 API 호출 건너뜀 (Netlify는 Functions 사용 가능)
    if (!supabaseSaved && typeof window !== 'undefined' && !window.location.hostname.includes('github.io')) {
      try {
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(feedbackData),
        });
        
        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('text/html')) {
            console.log('[Feedback] 로컬 API 없음, localStorage에 저장됨');
          } else {
            console.log('[Feedback] 피드백 전송 실패:', response.status);
          }
        } else {
          console.log('[Feedback] 로컬 API 전송 성공');
        }
      } catch (error) {
        console.log('[Feedback] 로컬 API 없음, localStorage에 저장됨');
      }
    } else if (supabaseSaved) {
      console.log('[Feedback] Supabase 저장 완료, 로컬 API 호출 건너뜀');
    } else {
      console.log('[Feedback] 정적 사이트 환경, 로컬 API 호출 건너뜀');
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

