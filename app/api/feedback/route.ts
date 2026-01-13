import { NextRequest, NextResponse } from 'next/server';
import { FeedbackData, VariantAnalysis } from '@/app/behavior/types';
import { feedbackStore } from '@/app/lib/storage';

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
  const variant = searchParams.get('variant');

  let filtered = feedbackStore;

  if (variant) {
    filtered = filtered.filter((f) => f.variant === variant);
  }

  return NextResponse.json({
    feedbacks: filtered,
    count: filtered.length,
  });
}

