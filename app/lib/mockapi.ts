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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('[MockAPI] 행동 데이터 저장 성공:', result);
    return result;
  } catch (error) {
    console.error('[MockAPI] 행동 데이터 저장 실패:', error);
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error('[MockAPI] 행동 데이터 조회 실패:', error);
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('[MockAPI] 피드백 데이터 저장 성공:', result);
    return result;
  } catch (error) {
    console.error('[MockAPI] 피드백 데이터 저장 실패:', error);
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error('[MockAPI] 피드백 데이터 조회 실패:', error);
    return [];
  }
}

