import { NextRequest, NextResponse } from 'next/server';
import { VariantAnalysis, FeedbackData, UserBehavior } from '@/app/behavior/types';
import { behaviorStore, feedbackStore } from '@/app/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const variant = searchParams.get('variant') as 'A' | 'B';

    if (!variant || (variant !== 'A' && variant !== 'B')) {
      return NextResponse.json(
        { error: 'Invalid variant. Must be A or B' },
        { status: 400 }
      );
    }

    // 공유 저장소에서 직접 데이터 가져오기
    const variantFeedbacks: FeedbackData[] = (feedbackStore || []).filter(
      (f) => f && f.variant === variant
    );
    const variantBehaviors: UserBehavior[] = (behaviorStore || []).filter(
      (b) => b && b.variant === variant
    );

    // 평균 평점 계산
    const ratings = variantFeedbacks
      .map((f: FeedbackData) => f?.feedback?.rating)
      .filter((r): r is number => typeof r === 'number' && !isNaN(r));
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : 0;

    // 평균 체류 시간
    const timeOnPageValues = variantBehaviors
      .map((b: UserBehavior) => b?.summary?.timeOnPage || 0)
      .filter((t) => typeof t === 'number' && !isNaN(t));
    const avgTimeOnPage =
      timeOnPageValues.length > 0
        ? timeOnPageValues.reduce((sum, t) => sum + t, 0) / timeOnPageValues.length
        : 0;

    // 전환율
    const conversions = variantBehaviors.filter((b: UserBehavior) =>
      b?.events?.some((e) => e?.type === 'conversion')
    );
    const conversionRate =
      variantBehaviors.length > 0
        ? (conversions.length / variantBehaviors.length) * 100
        : 0;

    // 참여도 점수 (클릭 수 + 스크롤 깊이 기반)
    const engagementScores = variantBehaviors
      .map((b: UserBehavior) => {
        const clickScore = ((b?.summary?.clickCount || 0) as number) * 10;
        const scrollScore = (b?.summary?.scrollDepth || 0) as number;
        return clickScore + scrollScore;
      })
      .filter((s) => typeof s === 'number' && !isNaN(s));
    const engagementScore =
      engagementScores.length > 0
        ? engagementScores.reduce((sum, s) => sum + s, 0) / engagementScores.length
        : 0;

    const analysis: VariantAnalysis = {
      variant,
      avgRating: isNaN(avgRating) ? 0 : avgRating,
      behaviorMetrics: {
        avgTimeOnPage: isNaN(avgTimeOnPage) ? 0 : avgTimeOnPage,
        conversionRate: isNaN(conversionRate) ? 0 : conversionRate,
        engagementScore: isNaN(engagementScore) ? 0 : engagementScore,
        totalSessions: variantBehaviors.length || 0,
      },
      feedbackCount: variantFeedbacks.length || 0,
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing variant feedback:', error);
    // 에러 상세 정보 포함 (개발 환경에서만)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

