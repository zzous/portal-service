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

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });
    } catch (error) {
      console.error('Failed to send feedback:', error);
    }
  }

  async analyzeVariantFeedback(variant: 'A' | 'B'): Promise<VariantAnalysis> {
    try {
      const response = await fetch(`/api/feedback/analysis?variant=${variant}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to analyze variant feedback:', error);
      throw error;
    }
  }
}

