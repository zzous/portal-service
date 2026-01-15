import { supabase } from './supabase-client';
import { UserBehavior, FeedbackData } from '../behavior/types';

/**
 * Supabase에 행동 데이터 저장
 */
export async function saveBehaviorToSupabase(
  behavior: UserBehavior
): Promise<{ id: string } | null> {
  if (!supabase) {
    console.log('[Supabase] Supabase가 설정되지 않아 저장을 건너뜁니다.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('behaviors')
      .insert({
        session_id: behavior.sessionId,
        user_id: behavior.userId || null,
        variant: behavior.variant,
        events: behavior.events,
        metadata: {
          pagePath: behavior.metadata.pagePath,
          referrer: behavior.metadata.referrer || null,
          deviceType: behavior.metadata.deviceType,
          userAgent: behavior.metadata.userAgent || null,
          timestamp: behavior.metadata.timestamp.toISOString(),
        },
        summary: behavior.summary,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[Supabase] 행동 데이터 저장 실패:', error);
      return null;
    }

    console.log('[Supabase] 행동 데이터 저장 성공:', data.id);
    return { id: data.id };
  } catch (error) {
    console.error('[Supabase] 행동 데이터 저장 오류:', error);
    return null;
  }
}

/**
 * Supabase에서 행동 데이터 조회
 */
export async function getBehaviorsFromSupabase(
  variant?: 'A' | 'B'
): Promise<UserBehavior[]> {
  if (!supabase) {
    console.log('[Supabase] Supabase가 설정되지 않아 조회를 건너뜁니다.');
    return [];
  }

  try {
    let query = supabase.from('behaviors').select('*').order('created_at', { ascending: false });

    if (variant) {
      query = query.eq('variant', variant);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Supabase] 행동 데이터 조회 실패:', error);
      return [];
    }

    if (!data) return [];

    // Supabase 데이터를 UserBehavior 형식으로 변환
    return data.map((row) => ({
      sessionId: row.session_id,
      userId: row.user_id || undefined,
      variant: row.variant as 'A' | 'B',
      events: row.events || [],
      metadata: {
        pagePath: row.metadata?.pagePath || '',
        referrer: row.metadata?.referrer,
        deviceType: row.metadata?.deviceType || 'desktop',
        userAgent: row.metadata?.userAgent,
        timestamp: new Date(row.metadata?.timestamp || row.created_at),
      },
      summary: row.summary || {
        timeOnPage: 0,
        scrollDepth: 0,
        clickCount: 0,
        pagesVisited: [],
      },
    }));
  } catch (error) {
    console.error('[Supabase] 행동 데이터 조회 오류:', error);
    return [];
  }
}

/**
 * Supabase에 피드백 데이터 저장
 */
export async function saveFeedbackToSupabase(
  feedback: FeedbackData
): Promise<{ id: string } | null> {
  if (!supabase) {
    console.log('[Supabase] Supabase가 설정되지 않아 저장을 건너뜁니다.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .insert({
        session_id: feedback.sessionId,
        variant: feedback.variant,
        behavior_summary: feedback.behaviorSummary,
        feedback: {
          rating: feedback.feedback.rating || null,
          comment: feedback.feedback.comment || null,
          question: feedback.feedback.question || null,
          timestamp: feedback.feedback.timestamp.toISOString(),
        },
      })
      .select('id')
      .single();

    if (error) {
      console.error('[Supabase] 피드백 데이터 저장 실패:', error);
      return null;
    }

    console.log('[Supabase] 피드백 데이터 저장 성공:', data.id);
    return { id: data.id };
  } catch (error) {
    console.error('[Supabase] 피드백 데이터 저장 오류:', error);
    return null;
  }
}

/**
 * Supabase에서 피드백 데이터 조회
 */
export async function getFeedbacksFromSupabase(
  variant?: 'A' | 'B'
): Promise<FeedbackData[]> {
  if (!supabase) {
    console.log('[Supabase] Supabase가 설정되지 않아 조회를 건너뜁니다.');
    return [];
  }

  try {
    let query = supabase.from('feedbacks').select('*').order('created_at', { ascending: false });

    if (variant) {
      query = query.eq('variant', variant);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Supabase] 피드백 데이터 조회 실패:', error);
      return [];
    }

    if (!data) return [];

    // Supabase 데이터를 FeedbackData 형식으로 변환
    return data.map((row) => ({
      sessionId: row.session_id,
      variant: row.variant as 'A' | 'B',
      behaviorSummary: row.behavior_summary || {
        timeOnPage: 0,
        scrollDepth: 0,
        clickCount: 0,
        pagesVisited: [],
      },
      feedback: {
        rating: row.feedback?.rating,
        comment: row.feedback?.comment,
        question: row.feedback?.question,
        timestamp: new Date(row.feedback?.timestamp || row.created_at),
      },
    }));
  } catch (error) {
    console.error('[Supabase] 피드백 데이터 조회 오류:', error);
    return [];
  }
}

