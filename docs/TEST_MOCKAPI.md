# MockAPI.io 테스트 가이드

## 현재 상태 확인

이미지에서 보니 `behaviors`와 `feedbacks` Resource가 생성되어 있습니다!
- `behaviors`: 0개 데이터
- `feedbacks`: 0개 데이터

이것은 **정상**입니다. API는 이미 생성되어 있고, 데이터는 코드에서 API를 호출할 때 저장됩니다.

## 테스트 방법

### 1. 브라우저에서 직접 테스트

브라우저 개발자 도구 콘솔(F12)에서 실행:

```javascript
// behaviors에 테스트 데이터 저장
fetch('https://6965d095f6de16bde44b2dbc.mockapi.io/api/v1/behaviors', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'test-123',
    variant: 'A',
    test: true
  })
})
.then(res => res.json())
.then(data => console.log('저장 성공:', data))
.catch(err => console.error('에러:', err));
```

성공하면 MockAPI.io 대시보드에서 `behaviors`의 숫자가 0 → 1로 변경됩니다.

### 2. 실제 앱에서 테스트

1. `/demo` 페이지 접속
2. 페이지에서 클릭, 스크롤 등 행동 수행
3. 브라우저 콘솔 확인:
   - `[MockAPI] 행동 데이터 저장 성공` 메시지 확인
4. MockAPI.io 대시보드 새로고침
5. `behaviors` 숫자가 증가하는지 확인

## 문제 해결

### API가 작동하지 않는다면:

1. **CORS 에러 확인**
   - 브라우저 콘솔에서 CORS 관련 에러가 있는지 확인
   - MockAPI.io는 기본적으로 CORS를 지원합니다

2. **네트워크 탭 확인**
   - 개발자 도구 → Network 탭
   - `behaviors` 또는 `feedbacks`로 필터링
   - 요청이 전송되는지, 응답 상태 코드 확인

3. **코드 확인**
   - `app/lib/mockapi.ts`의 URL이 정확한지 확인
   - 현재: `https://6965d095f6de16bde44b2dbc.mockapi.io/api/v1`

## 확인 체크리스트

- [ ] `behaviors` Resource 생성됨
- [ ] `feedbacks` Resource 생성됨  
- [ ] 브라우저 콘솔에서 직접 테스트 성공
- [ ] `/demo` 페이지에서 행동 시 데이터 저장됨
- [ ] MockAPI.io 대시보드에서 데이터 확인 가능

