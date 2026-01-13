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

    // MockAPI.io에 전송 (환경 변수 설정 시)
    if (typeof window !== 'undefined') {
      try {
        const { saveFeedbackToMockAPI } = await import('../lib/mockapi');
        await saveFeedbackToMockAPI(feedbackData);
      } catch (error) {
        console.warn('[Feedback] MockAPI 전송 실패:', error);
      }
    }

    // 로컬 API가 있으면 서버에도 전송
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
          console.error('[Feedback] 피드백 전송 실패:', response.status);
        }
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.log('[Feedback] 로컬 API 없음, localStorage에 저장됨');
      } else {
        console.error('[Feedback] 피드백 전송 오류:', error);
      }
    }
  }

  async analyzeVariantFeedback(variant: 'A' | 'B'): Promise<VariantAnalysis> {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.warn('[Feedback] API를 사용할 수 없습니다');
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
      console.error('[Feedback] 분석 실패:', error);
      throw error;
    }
  }
}

