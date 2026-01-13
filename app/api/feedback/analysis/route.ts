import { NextRequest, NextResponse } from 'next/server';
import { VariantAnalysis } from '@/app/behavior/types';

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

    // 다른 API에서 데이터 가져오기
    const [behaviorRes, feedbackRes] = await Promise.all([
      fetch(`${request.nextUrl.origin}/api/behavior?variant=${variant}`),
      fetch(`${request.nextUrl.origin}/api/feedback?variant=${variant}`),
    ]);

    const behaviorData = await behaviorRes.json();
    const feedbackData = await feedbackRes.json();

    const variantFeedbacks = feedbackData.feedbacks || [];
    const variantBehaviors = behaviorData.behaviors || [];

    // 평균 평점 계산
    const ratings = variantFeedbacks
      .map((f) => f.feedback?.rating)
      .filter((r) => r !== undefined && r !== null);
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : 0;

    // 평균 체류 시간
    const timeOnPageValues = variantBehaviors.map((b) => b.summary?.timeOnPage || 0);
    const avgTimeOnPage =
      timeOnPageValues.length > 0
        ? timeOnPageValues.reduce((sum, t) => sum + t, 0) / timeOnPageValues.length
        : 0;

    // 전환율
    const conversions = variantBehaviors.filter((b) =>
      b.events?.some((e: any) => e.type === 'conversion')
    );
    const conversionRate =
      variantBehaviors.length > 0
        ? (conversions.length / variantBehaviors.length) * 100
        : 0;

    // 참여도 점수 (클릭 수 + 스크롤 깊이 기반)
    const engagementScores = variantBehaviors.map((b) => {
      const clickScore = (b.summary?.clickCount || 0) * 10;
      const scrollScore = b.summary?.scrollDepth || 0;
      return clickScore + scrollScore;
    });
    const engagementScore =
      engagementScores.length > 0
        ? engagementScores.reduce((sum, s) => sum + s, 0) / engagementScores.length
        : 0;

    const analysis: VariantAnalysis = {
      variant,
      avgRating,
      behaviorMetrics: {
        avgTimeOnPage,
        conversionRate,
        engagementScore,
        totalSessions: variantBehaviors.length,
      },
      feedbackCount: variantFeedbacks.length,
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing variant feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

