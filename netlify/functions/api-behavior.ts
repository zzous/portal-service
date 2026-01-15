import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { UserBehavior } from '../../app/behavior/types';
import { saveBehaviorToSupabase } from '../../app/lib/supabase-storage';
import { getBehaviorsFromSupabase } from '../../app/lib/supabase-storage';

// In-memory 저장소 (서버리스 함수 간 공유 안 됨, Supabase 사용 권장)
const behaviorStore: UserBehavior[] = [];

function checkFeedbackTriggers(behavior: UserBehavior): boolean {
  const { summary } = behavior;

  // 30초 이상 체류
  if (summary.timeOnPage >= 30000) {
    return true;
  }

  // 50% 이상 스크롤
  if (summary.scrollDepth >= 50) {
    return true;
  }

  // 5회 이상 클릭
  if (summary.clickCount >= 5) {
    return true;
  }

  // 이탈 의도 감지
  const hasExitIntent = behavior.events.some((e) => e.type === 'exit');
  if (hasExitIntent) {
    return true;
  }

  // 전환 이벤트
  const hasConversion = behavior.events.some((e) => e.type === 'conversion');
  if (hasConversion) {
    return true;
  }

  return false;
}

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
      const behavior: UserBehavior = JSON.parse(event.body || '{}');

      // 데이터 검증
      if (!behavior.sessionId || !behavior.variant) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid behavior data' }),
        };
      }

      // 행동 데이터 저장
      behaviorStore.push(behavior);

      // Supabase에 저장 (환경 변수가 설정된 경우)
      try {
        await saveBehaviorToSupabase(behavior);
      } catch (error) {
        console.error('[API] Supabase 저장 실패:', error);
      }

      // 피드백 트리거 조건 확인
      const shouldRequestFeedback = checkFeedbackTriggers(behavior);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          shouldRequestFeedback,
          storedCount: behaviorStore.length,
        }),
      };
    }

    // GET 요청 처리
    if (event.httpMethod === 'GET') {
      const sessionId = event.queryStringParameters?.sessionId;
      const variant = event.queryStringParameters?.variant as 'A' | 'B' | undefined;

      // Supabase에서 데이터 조회 시도
      try {
        const supabaseBehaviors = await getBehaviorsFromSupabase(variant);
        
        if (supabaseBehaviors.length > 0) {
          let filtered = supabaseBehaviors;
          
          if (sessionId) {
            filtered = filtered.filter((b) => b.sessionId === sessionId);
          }
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              behaviors: filtered,
              count: filtered.length,
              source: 'supabase',
            }),
          };
        }
      } catch (error) {
        console.error('[API] Supabase 조회 실패, in-memory 저장소 사용:', error);
      }

      // In-memory 저장소에서 조회
      let filtered = behaviorStore;

      if (sessionId) {
        filtered = filtered.filter((b) => b.sessionId === sessionId);
      }

      if (variant) {
        filtered = filtered.filter((b) => b.variant === variant);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          behaviors: filtered,
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

