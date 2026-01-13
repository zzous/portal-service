# 더미 API 연동 가이드

## 추천 더미 API 서비스

### 1. MockAPI.io (추천) ⭐
- **URL**: https://mockapi.io
- **장점**:
  - 무료로 REST API 생성 가능
  - 실제 데이터 저장 및 조회 가능
  - CORS 지원
  - 커스텀 엔드포인트 생성 가능
- **사용법**: 
  1. https://mockapi.io 회원가입
  2. 새 프로젝트 생성
  3. Resource 생성 (예: `behaviors`, `feedbacks`)
  4. 자동으로 API 엔드포인트 생성됨

### 2. JSONPlaceholder
- **URL**: https://jsonplaceholder.typicode.com
- **장점**: 간단하고 빠름
- **단점**: 구조가 고정되어 있고 실제 저장 안됨

### 3. httpbin.org
- **URL**: https://httpbin.org
- **용도**: HTTP 테스트용

## MockAPI.io 연동 방법

### 1. MockAPI.io 설정

1. https://mockapi.io 접속 및 회원가입
2. 새 프로젝트 생성
3. 다음 Resource 생성:
   - `behaviors` (행동 데이터)
   - `feedbacks` (피드백 데이터)

### 2. API 엔드포인트 예시

생성되면 다음과 같은 엔드포인트가 자동 생성됩니다:
```
POST   https://[your-project-id].mockapi.io/api/v1/behaviors
GET    https://[your-project-id].mockapi.io/api/v1/behaviors
GET    https://[your-project-id].mockapi.io/api/v1/behaviors/:id

POST   https://[your-project-id].mockapi.io/api/v1/feedbacks
GET    https://[your-project-id].mockapi.io/api/v1/feedbacks
```

### 3. 환경 변수 설정

`.env.local` 파일 생성:
```env
NEXT_PUBLIC_MOCKAPI_BASE_URL=https://[your-project-id].mockapi.io/api/v1
```

### 4. 코드 수정

`app/behavior/tracker.ts`에서 API URL 변경:
```typescript
const MOCKAPI_URL = process.env.NEXT_PUBLIC_MOCKAPI_BASE_URL || '';

async sendBehaviorData(): Promise<void> {
  const behavior = this.getCurrentBehavior();
  
  // localStorage 저장
  if (typeof window !== 'undefined') {
    const { ClientStorage } = await import('../lib/client-storage');
    ClientStorage.saveBehavior(behavior);
  }
  
  // MockAPI.io로 전송
  if (MOCKAPI_URL) {
    try {
      const response = await fetch(`${MOCKAPI_URL}/behaviors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(behavior),
      });
      
      if (response.ok) {
        console.log('[Tracker] MockAPI.io에 데이터 저장 성공');
      }
    } catch (error) {
      console.error('[Tracker] MockAPI.io 전송 실패:', error);
    }
  }
}
```

