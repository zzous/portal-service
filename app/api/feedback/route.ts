import { NextRequest, NextResponse } from 'next/server';
import { FeedbackData, VariantAnalysis } from '@/app/behavior/types';
import { feedbackStore } from '@/app/lib/storage';
import { saveFeedbackToSupabase } from '@/app/lib/supabase-storage';

// 정적 사이트 빌드에서 제외 (output: 'export' 사용 시)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = false;

export async function POST(request: NextRequest) {
  try {
    const feedbackData: FeedbackData = await request.json();

    // 데이터 검증
    if (!feedbackData.sessionId || !feedbackData.variant) {
      return NextResponse.json(
        { error: 'Invalid feedback data' },
        { status: 400 }
      );
    }

    // 피드백 데이터 저장
    feedbackStore.push(feedbackData);

    // Supabase에 저장 (환경 변수가 설정된 경우)
    try {
      await saveFeedbackToSupabase(feedbackData);
    } catch (error) {
      // Supabase 저장 실패는 조용히 처리 (in-memory 저장은 이미 완료)
      console.error('[API] Supabase 저장 실패:', error);
    }

    return NextResponse.json({
      success: true,
      feedbackCount: feedbackStore.length,
    });
  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const variant = searchParams.get('variant') as 'A' | 'B' | null;

  // Supabase에서 데이터 조회 시도
  try {
    const { getFeedbacksFromSupabase } = await import('@/app/lib/supabase-storage');
    const supabaseFeedbacks = await getFeedbacksFromSupabase(variant || undefined);
    
    // Supabase 데이터가 있으면 우선 사용
    if (supabaseFeedbacks.length > 0) {
      return NextResponse.json({
        feedbacks: supabaseFeedbacks,
        count: supabaseFeedbacks.length,
        source: 'supabase',
      });
    }
  } catch (error) {
    // Supabase 조회 실패 시 in-memory 저장소 사용
    console.error('[API] Supabase 조회 실패, in-memory 저장소 사용:', error);
  }

  // In-memory 저장소에서 조회
  let filtered = feedbackStore;

  if (variant) {
    filtered = filtered.filter((f) => f.variant === variant);
  }

  return NextResponse.json({
    feedbacks: filtered,
    count: filtered.length,
    source: 'memory',
  });
}

