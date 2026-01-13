import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>행태감지 시스템</h1>
          <p>
            A/B 테스트와 피드백 수집을 연계한 행태감지 시스템 데모입니다.
            사용자의 행동 패턴을 분석하고 적절한 시점에 피드백을 수집합니다.
          </p>
        </div>
        <div className={styles.ctas}>
          <Link href="/demo" className={styles.primary}>
            <span>📊</span>
            A/B 테스트 데모
          </Link>
          <Link href="/analysis" className={styles.secondary}>
            <span>📈</span>
            분석 결과 보기
          </Link>
        </div>
        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>행동 추적</h3>
            <p>클릭, 스크롤, 체류시간 등 사용자 행동을 실시간으로 추적합니다</p>
          </div>
          <div className={styles.feature}>
            <h3>A/B 테스트</h3>
            <p>두 가지 버전을 비교하여 더 나은 사용자 경험을 찾습니다</p>
          </div>
          <div className={styles.feature}>
            <h3>피드백 수집</h3>
            <p>행동 패턴 기반으로 적절한 시점에 피드백을 요청합니다</p>
          </div>
        </div>
      </main>
    </div>
  );
}
