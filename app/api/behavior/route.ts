import { NextRequest, NextResponse } from 'next/server';
import { UserBehavior } from '@/app/behavior/types';

// 간단한 인메모리 저장소 (실제로는 DB 사용)
const behaviorStore: UserBehavior[] = [];

export async function POST(request: NextRequest) {
  try {
    const behavior: UserBehavior = await request.json();

    // 데이터 검증
    if (!behavior.sessionId || !behavior.variant) {
      return NextResponse.json(
        { error: 'Invalid behavior data' },
        { status: 400 }
      );
    }

    // 행동 데이터 저장
    behaviorStore.push(behavior);

    // 피드백 트리거 조건 확인
    const shouldRequestFeedback = checkFeedbackTriggers(behavior);

    return NextResponse.json({
      success: true,
      shouldRequestFeedback,
      storedCount: behaviorStore.length,
    });
  } catch (error) {
    console.error('Error processing behavior data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  const variant = searchParams.get('variant');

  let filtered = behaviorStore;

  if (sessionId) {
    filtered = filtered.filter((b) => b.sessionId === sessionId);
  }

  if (variant) {
    filtered = filtered.filter((b) => b.variant === variant);
  }

  return NextResponse.json({
    behaviors: filtered,
    count: filtered.length,
  });
}

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

