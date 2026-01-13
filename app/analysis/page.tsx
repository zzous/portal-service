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
      const [resA, resB] = await Promise.all([
        fetch('/api/feedback/analysis?variant=A'),
        fetch('/api/feedback/analysis?variant=B'),
      ]);

      const dataA = await resA.json();
      const dataB = await resB.json();

      setAnalysisA(dataA);
      setAnalysisB(dataB);
    } catch (error) {
      console.error('Failed to fetch analysis:', error);
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

