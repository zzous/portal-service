'use client';

import { useState, useEffect } from 'react';
import { VariantAnalysis } from '../behavior/types';
import styles from './page.module.css';

export default function AnalysisPage() {
  const [analysisA, setAnalysisA] = useState<VariantAnalysis | null>(null);
  const [analysisB, setAnalysisB] = useState<VariantAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      // 먼저 localStorage에서 데이터 가져오기
      const { ClientStorage } = await import('../lib/client-storage');
      const behaviorsA = ClientStorage.getBehaviorsByVariant('A');
      const behaviorsB = ClientStorage.getBehaviorsByVariant('B');
      const feedbacksA = ClientStorage.getFeedbacksByVariant('A');
      const feedbacksB = ClientStorage.getFeedbacksByVariant('B');

      // localStorage 데이터로 분석 계산
      const calculateAnalysis = (
        variant: 'A' | 'B',
        behaviors: any[],
        feedbacks: any[]
      ): VariantAnalysis => {
        const ratings = feedbacks
          .map((f) => f.feedback?.rating)
          .filter((r): r is number => r !== undefined && r !== null);
        const avgRating =
          ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
            : 0;

        const timeOnPageValues = behaviors.map((b) => b.summary?.timeOnPage || 0);
        const avgTimeOnPage =
          timeOnPageValues.length > 0
            ? timeOnPageValues.reduce((sum, t) => sum + t, 0) / timeOnPageValues.length
            : 0;

        const conversions = behaviors.filter((b) =>
          b.events?.some((e: any) => e.type === 'conversion')
        );
        const conversionRate =
          behaviors.length > 0 ? (conversions.length / behaviors.length) * 100 : 0;

        const engagementScores = behaviors.map((b: any) => {
          const clickScore = (b.summary?.clickCount || 0) * 10;
          const scrollScore = b.summary?.scrollDepth || 0;
          return clickScore + scrollScore;
        });
        const engagementScore =
          engagementScores.length > 0
            ? engagementScores.reduce((sum, s) => sum + s, 0) / engagementScores.length
            : 0;

        return {
          variant,
          avgRating,
          behaviorMetrics: {
            avgTimeOnPage,
            conversionRate,
            engagementScore,
            totalSessions: behaviors.length,
          },
          feedbackCount: feedbacks.length,
        };
      };

      let dataA = calculateAnalysis('A', behaviorsA, feedbacksA);
      let dataB = calculateAnalysis('B', behaviorsB, feedbacksB);

      // API가 있으면 서버에서도 가져오기 (병합)
      try {
        const [resA, resB] = await Promise.all([
          fetch('/api/feedback/analysis?variant=A'),
          fetch('/api/feedback/analysis?variant=B'),
        ]);

        const contentTypeA = resA.headers.get('content-type');
        const contentTypeB = resB.headers.get('content-type');

        if (resA.ok && contentTypeA && contentTypeA.includes('application/json')) {
          try {
            const apiDataA = await resA.json();
            // 서버 데이터와 병합 (서버 데이터 우선)
            dataA = apiDataA;
          } catch (e) {
            // 파싱 실패 시 localStorage 데이터 사용
          }
        }

        if (resB.ok && contentTypeB && contentTypeB.includes('application/json')) {
          try {
            const apiDataB = await resB.json();
            // 서버 데이터와 병합 (서버 데이터 우선)
            dataB = apiDataB;
          } catch (e) {
            // 파싱 실패 시 localStorage 데이터 사용
          }
        }
      } catch (error) {
        // API 실패 시 localStorage 데이터만 사용
        console.log('[Analysis] API 없음, localStorage 데이터 사용');
      }

      setAnalysisA(dataA);
      setAnalysisB(dataB);
    } catch (error) {
      console.error('[Analysis] 분석 데이터 로드 실패:', error);
      // 에러 발생 시 기본값 설정
      setAnalysisA({
        variant: 'A',
        avgRating: 0,
        behaviorMetrics: {
          avgTimeOnPage: 0,
          conversionRate: 0,
          engagementScore: 0,
          totalSessions: 0,
        },
        feedbackCount: 0,
      });
      setAnalysisB({
        variant: 'B',
        avgRating: 0,
        behaviorMetrics: {
          avgTimeOnPage: 0,
          conversionRate: 0,
          engagementScore: 0,
          totalSessions: 0,
        },
        feedbackCount: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p>분석 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>A/B 테스트 분석 결과</h1>
        <p className={styles.subtitle}>
          행태감지 시스템과 피드백 수집 데이터를 기반으로 한 분석 결과입니다.
        </p>

        <div className={styles.grid}>
          {analysisA && <VariantCard variant="A" analysis={analysisA} />}
          {analysisB && <VariantCard variant="B" analysis={analysisB} />}
        </div>

        <div className={styles.comparison}>
          <h2>비교 분석</h2>
          {analysisA && analysisB && (
            <ComparisonTable analysisA={analysisA} analysisB={analysisB} />
          )}
        </div>

        <button className={styles.refreshButton} onClick={fetchAnalysis}>
          데이터 새로고침
        </button>
      </div>
    </div>
  );
}

function VariantCard({
  variant,
  analysis,
}: {
  variant: 'A' | 'B';
  analysis: VariantAnalysis;
}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>버전 {variant}</h2>
        <div className={styles.badge}>버전 {variant}</div>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>평균 평점</div>
          <div className={styles.metricValue}>
            {analysis.avgRating.toFixed(1)} / 5.0
          </div>
          <div className={styles.stars}>
            {'★'.repeat(Math.round(analysis.avgRating))}
            {'☆'.repeat(5 - Math.round(analysis.avgRating))}
          </div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricLabel}>평균 체류 시간</div>
          <div className={styles.metricValue}>
            {(analysis.behaviorMetrics.avgTimeOnPage / 1000).toFixed(1)}초
          </div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricLabel}>전환율</div>
          <div className={styles.metricValue}>
            {analysis.behaviorMetrics.conversionRate.toFixed(1)}%
          </div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricLabel}>참여도 점수</div>
          <div className={styles.metricValue}>
            {analysis.behaviorMetrics.engagementScore.toFixed(1)}
          </div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricLabel}>총 세션 수</div>
          <div className={styles.metricValue}>
            {analysis.behaviorMetrics.totalSessions}
          </div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricLabel}>피드백 수</div>
          <div className={styles.metricValue}>{analysis.feedbackCount}</div>
        </div>
      </div>
    </div>
  );
}

function ComparisonTable({
  analysisA,
  analysisB,
}: {
  analysisA: VariantAnalysis;
  analysisB: VariantAnalysis;
}) {
  const metrics = [
    {
      label: '평균 평점',
      valueA: analysisA.avgRating,
      valueB: analysisB.avgRating,
      format: (v: number) => v.toFixed(1),
    },
    {
      label: '평균 체류 시간',
      valueA: analysisA.behaviorMetrics.avgTimeOnPage / 1000,
      valueB: analysisB.behaviorMetrics.avgTimeOnPage / 1000,
      format: (v: number) => `${v.toFixed(1)}초`,
    },
    {
      label: '전환율',
      valueA: analysisA.behaviorMetrics.conversionRate,
      valueB: analysisB.behaviorMetrics.conversionRate,
      format: (v: number) => `${v.toFixed(1)}%`,
    },
    {
      label: '참여도 점수',
      valueA: analysisA.behaviorMetrics.engagementScore,
      valueB: analysisB.behaviorMetrics.engagementScore,
      format: (v: number) => v.toFixed(1),
    },
  ];

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>지표</th>
          <th>버전 A</th>
          <th>버전 B</th>
          <th>우위</th>
        </tr>
      </thead>
      <tbody>
        {metrics.map((metric) => {
          const winner = metric.valueA > metric.valueB ? 'A' : 'B';
          const diff = Math.abs(metric.valueA - metric.valueB);
          return (
            <tr key={metric.label}>
              <td>{metric.label}</td>
              <td>{metric.format(metric.valueA)}</td>
              <td>{metric.format(metric.valueB)}</td>
              <td>
                <span
                  className={
                    winner === 'A' ? styles.winnerA : styles.winnerB
                  }
                >
                  버전 {winner} ({diff.toFixed(1)} 차이)
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

