# Netlify 환경 변수 설정 가이드

## 문제
Netlify에서 "[Supabase] Supabase가 설정되지 않아 저장을 건너뜁니다." 메시지가 나타나는 경우

## 해결 방법

### 1. Netlify 대시보드에서 환경 변수 설정

1. Netlify 대시보드 접속: https://app.netlify.com
2. 사이트 선택
3. **Site settings** → **Environment variables** 메뉴로 이동
4. **"Add a variable"** 또는 **"Add environment variable"** 버튼 클릭
5. 다음 환경 변수를 하나씩 추가:

#### 첫 번째 환경 변수: NEXT_PUBLIC_SUPABASE_URL
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://your-project-id.supabase.co` (Supabase 프로젝트 URL)
- **Scopes**: "All scopes" 선택
- **Values**: "Same value for all deploy contexts" 선택 (또는 각 환경별로 다르게 설정 가능)
- **Save** 클릭

#### 두 번째 환경 변수: NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `sb_publishable_...` 또는 `eyJhbGci...` (Supabase Publishable key 또는 anon key)
- **Scopes**: "All scopes" 선택
- **Values**: "Same value for all deploy contexts" 선택
- **Save** 클릭

6. 환경 변수 추가 완료 후:

#### 필수 환경 변수 (각각 별도로 추가)

**환경 변수 1:**
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://your-project-id.supabase.co` (Supabase 프로젝트 URL)

**환경 변수 2:**
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `sb_publishable_...` 또는 `eyJhbGci...` (Supabase Publishable key 또는 anon key)

#### 선택적 환경 변수 (서버 사이드 Functions 사용 시)

| 변수 이름 | 값 | 설명 |
|---------|-----|------|
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_...` 또는 `eyJhbGci...` | Supabase Service role key (서버 사이드용) |

### 2. 환경 변수 확인 방법

#### Supabase 대시보드에서 확인
1. Supabase 대시보드 접속: https://app.supabase.com
2. 프로젝트 선택
3. **Settings** → **API Keys** 메뉴
4. 다음 정보 복사:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`에 설정
   - **Publishable key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 설정
   - **Secret key** (선택): `SUPABASE_SERVICE_ROLE_KEY`에 설정

### 3. 환경 변수 설정 후

1. **Redeploy** 클릭하여 사이트 재배포
   - 또는 Git에 푸시하면 자동 재배포

2. 브라우저 콘솔에서 확인
   - `[Supabase] 클라이언트 초기화 완료` 메시지가 보이면 성공
   - `[Supabase] 환경 변수가 설정되지 않았습니다.` 메시지가 보이면 환경 변수 미설정

### 4. 환경 변수 스코프 설정

Netlify에서 환경 변수 스코프를 설정할 수 있습니다:
- **All scopes**: 모든 환경에서 사용
- **Production**: 프로덕션 환경에서만 사용
- **Deploy previews**: 프리뷰 환경에서만 사용
- **Branch deploys**: 브랜치 배포에서만 사용

**권장**: `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY`는 **All scopes**로 설정

### 5. 문제 해결

#### 환경 변수가 설정되었는데도 작동하지 않는 경우

1. **재배포 확인**
   - 환경 변수는 배포 시점에 주입됩니다
   - 환경 변수 변경 후 반드시 재배포 필요

2. **변수 이름 확인**
   - `NEXT_PUBLIC_` 접두사가 정확한지 확인
   - 대소문자 구분 확인

3. **값 확인**
   - 공백이나 특수문자가 포함되지 않았는지 확인
   - 따옴표 없이 값만 입력

4. **브라우저 콘솔 확인**
   - 개발자 도구 → Console 탭
   - `[Supabase]` 관련 메시지 확인

### 6. 로컬 개발 환경

로컬에서 테스트하려면 `.env.local` 파일에 환경 변수를 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

⚠️ **주의**: `.env.local` 파일은 Git에 커밋하지 마세요 (`.gitignore`에 포함되어 있음)

## 참고

- Next.js에서 `NEXT_PUBLIC_` 접두사가 있는 환경 변수는 클라이언트 번들에 포함됩니다
- 빌드 시점에 환경 변수가 주입되므로, 배포 후에는 변경해도 재배포가 필요합니다
- 환경 변수는 빌드 로그에 표시되지 않습니다 (보안상의 이유)

