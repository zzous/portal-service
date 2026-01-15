import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { VariantAnalysis, FeedbackData, UserBehavior } from '../../app/behavior/types';
import { getBehaviorsFromSupabase, getFeedbacksFromSupabase } from '../../app/lib/supabase-storage';

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // CORS 헤더 설정
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    const variant = event.queryStringParameters?.variant as 'A' | 'B';

    if (!variant || (variant !== 'A' && variant !== 'B')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid variant. Must be A or B' }),
      };
    }

    // Supabase에서 데이터 조회 시도
    let variantFeedbacks: FeedbackData[] = [];
    let variantBehaviors: UserBehavior[] = [];

    try {
      const [supabaseFeedbacks, supabaseBehaviors] = await Promise.all([
        getFeedbacksFromSupabase(variant),
        getBehaviorsFromSupabase(variant),
      ]);

      if (supabaseFeedbacks.length > 0 || supabaseBehaviors.length > 0) {
        variantFeedbacks = supabaseFeedbacks;
        variantBehaviors = supabaseBehaviors;
      }
    } catch (error) {
      console.error('[API] Supabase 조회 실패:', error);
    }

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(analysis),
    };
  } catch (error) {
    console.error('Error analyzing variant feedback:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

