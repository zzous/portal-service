import { UserBehavior, FeedbackData } from '../behavior/types';

const BEHAVIOR_STORAGE_KEY = 'portal-service-behaviors';
const FEEDBACK_STORAGE_KEY = 'portal-service-feedbacks';

// 클라이언트 사이드 저장소 (localStorage)
export class ClientStorage {
  static saveBehavior(behavior: UserBehavior): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = this.getBehaviors();
      stored.push(behavior);
      localStorage.setItem(BEHAVIOR_STORAGE_KEY, JSON.stringify(stored));
    } catch (error) {
      console.error('[ClientStorage] 행동 데이터 저장 실패:', error);
    }
  }

  static getBehaviors(): UserBehavior[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(BEHAVIOR_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('[ClientStorage] 행동 데이터 로드 실패:', error);
      return [];
    }
  }

  static getBehaviorsByVariant(variant: 'A' | 'B'): UserBehavior[] {
    return this.getBehaviors().filter((b) => b.variant === variant);
  }

  static saveFeedback(feedback: FeedbackData): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = this.getFeedbacks();
      stored.push(feedback);
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(stored));
    } catch (error) {
      console.error('[ClientStorage] 피드백 데이터 저장 실패:', error);
    }
  }

  static getFeedbacks(): FeedbackData[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('[ClientStorage] 피드백 데이터 로드 실패:', error);
      return [];
    }
  }

  static getFeedbacksByVariant(variant: 'A' | 'B'): FeedbackData[] {
    return this.getFeedbacks().filter((f) => f.variant === variant);
  }

  static clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(BEHAVIOR_STORAGE_KEY);
    localStorage.removeItem(FEEDBACK_STORAGE_KEY);
  }
}

