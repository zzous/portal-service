import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { FeedbackData } from '../../app/behavior/types';
import { saveFeedbackToSupabase, getFeedbacksFromSupabase } from '../../app/lib/supabase-storage';

// In-memory 저장소 (서버리스 함수 간 공유 안 됨, Supabase 사용 권장)
const feedbackStore: FeedbackData[] = [];

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // CORS 헤더 설정
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    // POST 요청 처리
    if (event.httpMethod === 'POST') {
      const feedbackData: FeedbackData = JSON.parse(event.body || '{}');

      // 데이터 검증
      if (!feedbackData.sessionId || !feedbackData.variant) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid feedback data' }),
        };
      }

      // 피드백 데이터 저장
      feedbackStore.push(feedbackData);

      // Supabase에 저장 (환경 변수가 설정된 경우)
      try {
        await saveFeedbackToSupabase(feedbackData);
      } catch (error) {
        console.error('[API] Supabase 저장 실패:', error);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          feedbackCount: feedbackStore.length,
        }),
      };
    }

    // GET 요청 처리
    if (event.httpMethod === 'GET') {
      const variant = event.queryStringParameters?.variant as 'A' | 'B' | undefined;

      // Supabase에서 데이터 조회 시도
      try {
        const supabaseFeedbacks = await getFeedbacksFromSupabase(variant);
        
        if (supabaseFeedbacks.length > 0) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              feedbacks: supabaseFeedbacks,
              count: supabaseFeedbacks.length,
              source: 'supabase',
            }),
          };
        }
      } catch (error) {
        console.error('[API] Supabase 조회 실패, in-memory 저장소 사용:', error);
      }

      // In-memory 저장소에서 조회
      let filtered = feedbackStore;

      if (variant) {
        filtered = filtered.filter((f) => f.variant === variant);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          feedbacks: filtered,
          count: filtered.length,
          source: 'memory',
        }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

