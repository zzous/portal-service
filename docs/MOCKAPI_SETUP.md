# MockAPI.io 설정 가이드

## 생성해야 할 Resource (리소스)

MockAPI.io에서 다음 **2개의 Resource**를 생성하세요:

### 1. `behaviors` (행동 데이터)

**생성 방법:**
1. https://mockapi.io 접속
2. 프로젝트 선택 (또는 새 프로젝트 생성)
3. "New Resource" 클릭
4. Resource 이름: **`behaviors`** 입력
5. "Create" 클릭

**자동 생성되는 API:**
- `POST https://6965d095f6de16bde44b2dbc.mockapi.io/api/v1/behaviors` - 데이터 저장
- `GET https://6965d095f6de16bde44b2dbc.mockapi.io/api/v1/behaviors` - 전체 조회
- `GET https://6965d095f6de16bde44b2dbc.mockapi.io/api/v1/behaviors/:id` - 단일 조회
- `GET https://6965d095f6de16bde44b2dbc.mockapi.io/api/v1/behaviors?variant=A` - 필터링 조회

**저장되는 데이터 구조:**
```json
{
  "sessionId": "string",
  "variant": "A" | "B",
  "events": [...],
  "metadata": {...},
  "summary": {...}
}
```

### 2. `feedbacks` (피드백 데이터)

**생성 방법:**
1. 같은 프로젝트에서
2. "New Resource" 클릭
3. Resource 이름: **`feedbacks`** 입력
4. "Create" 클릭

**자동 생성되는 API:**
- `POST https://6965d095f6de16bde44b2dbc.mockapi.io/api/v1/feedbacks` - 데이터 저장
- `GET https://6965d095f6de16bde44b2dbc.mockapi.io/api/v1/feedbacks` - 전체 조회
- `GET https://6965d095f6de16bde44b2dbc.mockapi.io/api/v1/feedbacks/:id` - 단일 조회
- `GET https://6965d095f6de16bde44b2dbc.mockapi.io/api/v1/feedbacks?variant=A` - 필터링 조회

**저장되는 데이터 구조:**
```json
{
  "sessionId": "string",
  "variant": "A" | "B",
  "behaviorSummary": {...},
  "feedback": {
    "rating": 1-5,
    "comment": "string",
    "timestamp": "Date"
  }
}
```

## 중요 사항

✅ **Resource 이름은 정확히 `behaviors`와 `feedbacks`로 입력해야 합니다!**
- 대소문자 구분
- 복수형 사용 (behavior ❌, behaviors ✅)

✅ **별도로 스키마나 필드를 정의할 필요 없습니다**
- MockAPI.io가 자동으로 JSON 데이터를 받아서 저장합니다
- 어떤 필드든 자유롭게 저장 가능

✅ **분석 API는 MockAPI.io에 만들 필요 없습니다**
- `/api/feedback/analysis`는 로컬에서 `behaviors`와 `feedbacks` 데이터를 가져와서 계산합니다

## 확인 방법

Resource 생성 후:
1. MockAPI.io 대시보드에서 `behaviors`와 `feedbacks` 리소스가 보이는지 확인
2. `/demo` 페이지에서 행동을 하면 `behaviors`에 데이터가 저장되는지 확인
3. 피드백을 제출하면 `feedbacks`에 데이터가 저장되는지 확인

## 테스트

브라우저 콘솔에서 다음 메시지를 확인:
- `[MockAPI] 행동 데이터 저장 성공` ✅
- `[MockAPI] 피드백 데이터 저장 성공` ✅

