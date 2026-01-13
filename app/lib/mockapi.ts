// MockAPI.io 연동 유틸리티

const MOCKAPI_BASE_URL = 
  process.env.NEXT_PUBLIC_MOCKAPI_BASE_URL || 
  'https://6965d095f6de16bde44b2dbc.mockapi.io/api/v1';

export interface MockAPIResponse {
  id?: string;
  createdAt?: string;
  [key: string]: unknown;
}

/**
 * MockAPI.io에 행동 데이터 저장
 */
export async function saveBehaviorToMockAPI(data: unknown): Promise<MockAPIResponse | null> {
  if (!MOCKAPI_BASE_URL) {
    console.warn('[MockAPI] API URL이 설정되지 않았습니다.');
    return null;
  }

  try {
    const response = await fetch(`${MOCKAPI_BASE_URL}/behaviors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // 404는 리소스가 없는 것으로 간주 (조용히 처리)
      if (response.status === 404) {
        console.warn('[MockAPI] behaviors 리소스를 찾을 수 없습니다. MockAPI.io에서 리소스를 생성해주세요.');
        return null;
      }
      // 기타 HTTP 에러는 상세 정보와 함께 로그만 남기고 null 반환
      const errorText = await response.text().catch(() => '');
      console.warn(`[MockAPI] 행동 데이터 저장 실패 (${response.status}):`, errorText || response.statusText);
      return null;
    }

    const result = await response.json();
    console.log('[MockAPI] 행동 데이터 저장 성공:', result);
    return result;
  } catch (error) {
    // 네트워크 에러 등은 조용히 처리
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('[MockAPI] 네트워크 오류 또는 CORS 문제가 발생했습니다.');
    } else {
      console.warn('[MockAPI] 행동 데이터 저장 실패:', error instanceof Error ? error.message : error);
    }
    return null;
  }
}

/**
 * MockAPI.io에서 행동 데이터 조회
 */
export async function getBehaviorsFromMockAPI(
  variant?: 'A' | 'B'
): Promise<unknown[]> {
  if (!MOCKAPI_BASE_URL) {
    console.warn('[MockAPI] API URL이 설정되지 않았습니다.');
    return [];
  }

  try {
    const url = variant
      ? `${MOCKAPI_BASE_URL}/behaviors?variant=${variant}`
      : `${MOCKAPI_BASE_URL}/behaviors`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // 404는 리소스가 없는 것으로 간주 (빈 배열 반환)
      if (response.status === 404) {
        console.warn('[MockAPI] behaviors 리소스를 찾을 수 없습니다. MockAPI.io에서 리소스를 생성해주세요.');
        return [];
      }
      // 기타 HTTP 에러는 로그만 남기고 빈 배열 반환
      const errorText = await response.text().catch(() => '');
      console.warn(`[MockAPI] 행동 데이터 조회 실패 (${response.status}):`, errorText || response.statusText);
      return [];
    }

    const result = await response.json();
    return Array.isArray(result) ? result : [];
  } catch (error) {
    // 네트워크 에러 등은 조용히 처리
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('[MockAPI] 네트워크 오류 또는 CORS 문제가 발생했습니다.');
    } else {
      console.warn('[MockAPI] 행동 데이터 조회 실패:', error instanceof Error ? error.message : error);
    }
    return [];
  }
}

/**
 * MockAPI.io에 피드백 데이터 저장
 */
export async function saveFeedbackToMockAPI(data: unknown): Promise<MockAPIResponse | null> {
  if (!MOCKAPI_BASE_URL) {
    console.warn('[MockAPI] API URL이 설정되지 않았습니다.');
    return null;
  }

  try {
    const response = await fetch(`${MOCKAPI_BASE_URL}/feedbacks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // 404는 리소스가 없는 것으로 간주 (조용히 처리)
      if (response.status === 404) {
        console.warn('[MockAPI] feedbacks 리소스를 찾을 수 없습니다. MockAPI.io에서 리소스를 생성해주세요.');
        return null;
      }
      // 기타 HTTP 에러는 상세 정보와 함께 로그만 남기고 null 반환
      const errorText = await response.text().catch(() => '');
      console.warn(`[MockAPI] 피드백 데이터 저장 실패 (${response.status}):`, errorText || response.statusText);
      return null;
    }

    const result = await response.json();
    console.log('[MockAPI] 피드백 데이터 저장 성공:', result);
    return result;
  } catch (error) {
    // 네트워크 에러 등은 조용히 처리
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('[MockAPI] 네트워크 오류 또는 CORS 문제가 발생했습니다.');
    } else {
      console.warn('[MockAPI] 피드백 데이터 저장 실패:', error instanceof Error ? error.message : error);
    }
    return null;
  }
}

/**
 * MockAPI.io에서 피드백 데이터 조회
 */
export async function getFeedbacksFromMockAPI(
  variant?: 'A' | 'B'
): Promise<unknown[]> {
  if (!MOCKAPI_BASE_URL) {
    console.warn('[MockAPI] API URL이 설정되지 않았습니다.');
    return [];
  }

  try {
    const url = variant
      ? `${MOCKAPI_BASE_URL}/feedbacks?variant=${variant}`
      : `${MOCKAPI_BASE_URL}/feedbacks`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // 404는 리소스가 없는 것으로 간주 (빈 배열 반환)
      if (response.status === 404) {
        console.warn('[MockAPI] feedbacks 리소스를 찾을 수 없습니다. MockAPI.io에서 리소스를 생성해주세요.');
        return [];
      }
      // 기타 HTTP 에러는 로그만 남기고 빈 배열 반환
      const errorText = await response.text().catch(() => '');
      console.warn(`[MockAPI] 피드백 데이터 조회 실패 (${response.status}):`, errorText || response.statusText);
      return [];
    }

    const result = await response.json();
    return Array.isArray(result) ? result : [];
  } catch (error) {
    // 네트워크 에러 등은 조용히 처리
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('[MockAPI] 네트워크 오류 또는 CORS 문제가 발생했습니다.');
    } else {
      console.warn('[MockAPI] 피드백 데이터 조회 실패:', error instanceof Error ? error.message : error);
    }
    return [];
  }
}

