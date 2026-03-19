import { supabase } from './supabase-client';
import { UserBehavior, FeedbackData } from '../behavior/types';
import type { BehaviorEvent } from '../behavior/types';

/** behaviors 테이블 insert용 행 타입 (snake_case) */
type BehaviorRowInsert = {
  session_id: string;
  user_id: string | null;
  variant: 'A' | 'B';
  events: unknown;
  metadata: {
    pagePath: string;
    referrer: string | null;
    deviceType: string;
    userAgent: string | null;
    timestamp: string;
  };
  summary: unknown;
};

/** feedbacks 테이블 insert용 행 타입 (snake_case) */
type FeedbackRowInsert = {
  session_id: string;
  variant: 'A' | 'B';
  behavior_summary: unknown;
  feedback: {
    rating: number | null;
    comment: string | null;
    question: string | null;
    timestamp: string;
  };
};

/** behaviors 테이블 select 시 반환 행 (snake_case) */
interface BehaviorRowSelect extends BehaviorRowInsert {
  id: string;
  created_at?: string;
}

/** feedbacks 테이블 select 시 반환 행 (snake_case) */
interface FeedbackRowSelect extends FeedbackRowInsert {
  id: string;
  created_at?: string;
}

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

  // 타입 가드: supabase가 null이 아님을 확인
  const client = supabase;
  if (!client) {
    return null;
  }

  try {
    const row: BehaviorRowInsert = {
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
    };
    // 스키마 미정의 시 insert가 never를 기대하므로 타입 단언 사용
    const { data, error } = await client
      .from('behaviors')
      .insert(row as never)
      .select('id')
      .single();

    if (error) {
      console.log('[Supabase] 행동 데이터 저장 실패:', error);
      return null;
    }

    const result = data as { id: string } | null;
    if (!result) {
      return null;
    }

    console.log('[Supabase] 행동 데이터 저장 성공:', result.id);
    return { id: result.id };
  } catch (error) {
    console.log('[Supabase] 행동 데이터 저장 오류:', error);
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

  const client = supabase;

  try {
    let query = client.from('behaviors').select('*').order('created_at', { ascending: false });

    if (variant) {
      query = query.eq('variant', variant);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Supabase] 행동 데이터 조회 실패:', error);
      return [];
    }

    if (!data) return [];

    const defaultSummary: UserBehavior['summary'] = {
      timeOnPage: 0,
      scrollDepth: 0,
      clickCount: 0,
      pagesVisited: [],
    };
    return (data as BehaviorRowSelect[]).map((row: BehaviorRowSelect): UserBehavior => ({
      sessionId: row.session_id,
      userId: row.user_id ?? undefined,
      variant: row.variant as 'A' | 'B',
      events: (row.events ?? []) as BehaviorEvent[],
      metadata: {
        pagePath: row.metadata?.pagePath ?? '',
        referrer: row.metadata?.referrer ?? undefined,
        deviceType: (row.metadata?.deviceType ?? 'desktop') as UserBehavior['metadata']['deviceType'],
        userAgent: row.metadata?.userAgent ?? undefined,
        timestamp: new Date(row.metadata?.timestamp ?? row.created_at ?? Date.now()),
      },
      summary: (row.summary ?? defaultSummary) as UserBehavior['summary'],
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

  const client = supabase;

  try {
    const row: FeedbackRowInsert = {
      session_id: feedback.sessionId,
      variant: feedback.variant,
      behavior_summary: feedback.behaviorSummary,
      feedback: {
        rating: feedback.feedback.rating ?? null,
        comment: feedback.feedback.comment ?? null,
        question: feedback.feedback.question ?? null,
        timestamp: feedback.feedback.timestamp.toISOString(),
      },
    };
    // 스키마 미정의 시 insert가 never를 기대하므로 타입 단언 사용
    const { data, error } = await client
      .from('feedbacks')
      .insert(row as never)
      .select('id')
      .single();

    if (error) {
      console.error('[Supabase] 피드백 데이터 저장 실패:', error);
      return null;
    }

    const result = data as { id: string } | null;
    if (!result) {
      return null;
    }

    console.log('[Supabase] 피드백 데이터 저장 성공:', result.id);
    return { id: result.id };
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

  const client = supabase;

  try {
    let query = client.from('feedbacks').select('*').order('created_at', { ascending: false });

    if (variant) {
      query = query.eq('variant', variant);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Supabase] 피드백 데이터 조회 실패:', error);
      return [];
    }

    if (!data) return [];

    const defaultBehaviorSummary: FeedbackData['behaviorSummary'] = {
      timeOnPage: 0,
      scrollDepth: 0,
      clickCount: 0,
      pagesVisited: [],
    };
    return (data as FeedbackRowSelect[]).map((row: FeedbackRowSelect): FeedbackData => ({
      sessionId: row.session_id,
      variant: row.variant as 'A' | 'B',
      behaviorSummary: (row.behavior_summary ?? defaultBehaviorSummary) as FeedbackData['behaviorSummary'],
      feedback: {
        rating: row.feedback?.rating ?? undefined,
        comment: row.feedback?.comment ?? undefined,
        question: row.feedback?.question ?? undefined,
        timestamp: new Date(row.feedback?.timestamp ?? row.created_at ?? Date.now()),
      },
    }));
  } catch (error) {
    console.error('[Supabase] 피드백 데이터 조회 오류:', error);
    return [];
  }
}

