'use client';

import { useState, useEffect, useRef } from 'react';
import { FeedbackManager } from '../behavior/feedback-manager';
import { BehaviorTracker } from '../behavior/tracker';
import styles from './FeedbackCollector.module.css';

interface FeedbackCollectorProps {
  variant: 'A' | 'B';
  tracker: BehaviorTracker;
}

export function FeedbackCollector({ variant, tracker }: FeedbackCollectorProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ rating: 0, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const feedbackManagerRef = useRef<FeedbackManager | null>(null);

  useEffect(() => {
    if (!feedbackManagerRef.current) {
      feedbackManagerRef.current = new FeedbackManager();
    }

    const feedbackManager = feedbackManagerRef.current;

    // 행동 패턴 체크 (5초마다)
    const checkInterval = setInterval(() => {
      if (!showFeedback && !submitted) {
        const behavior = tracker.getCurrentBehavior();
        const shouldShow = feedbackManager.checkFeedbackTriggers(behavior);
        if (shouldShow) {
          console.log('[Feedback] 피드백 트리거 조건 충족:', {
            timeOnPage: behavior.summary.timeOnPage,
            scrollDepth: behavior.summary.scrollDepth,
            clickCount: behavior.summary.clickCount,
          });
          setShowFeedback(true);
        }
      }
    }, 5000);

    return () => clearInterval(checkInterval);
  }, [tracker, showFeedback, submitted]);

  const handleSubmit = async () => {
    if (!feedbackManagerRef.current) return;

    setIsSubmitting(true);
    const behavior = tracker.getCurrentBehavior();

    await feedbackManagerRef.current.collectFeedback(behavior, {
      rating: feedbackData.rating,
      comment: feedbackData.comment,
      question: `현재 ${variant} 버전에 대한 의견을 들려주세요`,
    });

    setIsSubmitting(false);
    setSubmitted(true);
    setShowFeedback(false);

    // 3초 후 완전히 숨김
    setTimeout(() => {
      setShowFeedback(false);
    }, 3000);
  };

  const handleClose = () => {
    setShowFeedback(false);
  };

  if (!showFeedback || submitted) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={handleClose}>
          ×
        </button>
        <h3 className={styles.title}>피드백을 들려주세요</h3>
        <p className={styles.subtitle}>
          현재 <strong>{variant}</strong> 버전을 보고 계십니다
        </p>

        <div className={styles.ratingSection}>
          <label>만족도</label>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`${styles.star} ${
                  star <= feedbackData.rating ? styles.active : ''
                }`}
                onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className={styles.commentSection}>
          <label htmlFor="comment">의견 (선택사항)</label>
          <textarea
            id="comment"
            className={styles.textarea}
            rows={4}
            placeholder="이 페이지에 대한 의견을 자유롭게 작성해주세요..."
            value={feedbackData.comment}
            onChange={(e) =>
              setFeedbackData({ ...feedbackData, comment: e.target.value })
            }
          />
        </div>

        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={isSubmitting || feedbackData.rating === 0}
        >
          {isSubmitting ? '제출 중...' : '제출하기'}
        </button>

        {submitted && (
          <p className={styles.successMessage}>피드백을 주셔서 감사합니다!</p>
        )}
      </div>
    </div>
  );
}

