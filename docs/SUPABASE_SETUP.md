# Supabase 백엔드 연동 가이드

## 1. Supabase 프로젝트 설정

### 1.1 프로젝트 정보 확인
1. Supabase 대시보드 접속: https://app.supabase.com
2. 프로젝트 선택
3. **Settings** → **API Keys** 메뉴에서 다음 정보 확인:

**새로운 API 키 시스템 (권장):**
- **Project URL**: Settings → API → Project URL
- **Publishable key**: Settings → API Keys → "Publishable key" 섹션에서 복사
  - 예: `sb_publishable_qG1lfQqeWlT6DjojJIa0zQ_NkhbJ...`
- **Secret key**: Settings → API Keys → "Secret keys" 섹션에서 복사
  - 예: `sb_secret_4ufIJ...`

**레거시 API 키 (구버전):**
- Settings → API Keys → "Legacy anon, service_role API keys" 탭
- **anon public key**: 클라이언트 사이드용
- **service_role key**: 서버 사이드용

### 1.2 환경 변수 설정

`.env.local` 파일 생성 (프로젝트 루트에):

**새로운 API 키 사용 시:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxxxxxxxxxx
```

**레거시 API 키 사용 시:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **주의**: 
- `SUPABASE_SERVICE_ROLE_KEY`는 서버 사이드에서만 사용하고, 클라이언트에 노출하지 마세요.
- `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.

## 2. 데이터베이스 스키마 생성

### 2.1 Supabase SQL Editor에서 실행

Supabase 대시보드 → **SQL Editor** → **New query**에서 다음 SQL 실행:

```sql
-- 1. behaviors 테이블 생성
CREATE TABLE IF NOT EXISTS behaviors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id TEXT,
  variant TEXT NOT NULL CHECK (variant IN ('A', 'B')),
  events JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. feedbacks 테이블 생성
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  variant TEXT NOT NULL CHECK (variant IN ('A', 'B')),
  behavior_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  feedback JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_behaviors_session_id ON behaviors(session_id);
CREATE INDEX IF NOT EXISTS idx_behaviors_variant ON behaviors(variant);
CREATE INDEX IF NOT EXISTS idx_behaviors_created_at ON behaviors(created_at);
CREATE INDEX IF NOT EXISTS idx_feedbacks_session_id ON feedbacks(session_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_variant ON feedbacks(variant);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at);

-- 4. RLS (Row Level Security) 정책 설정
-- anon 사용자가 읽기/쓰기 가능하도록 설정 (필요에 따라 수정)
ALTER TABLE behaviors ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- behaviors 테이블 정책
CREATE POLICY "Allow public read access" ON behaviors
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON behaviors
  FOR INSERT WITH CHECK (true);

-- feedbacks 테이블 정책
CREATE POLICY "Allow public read access" ON feedbacks
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON feedbacks
  FOR INSERT WITH CHECK (true);

-- 5. updated_at 자동 업데이트 함수 (선택사항)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_behaviors_updated_at BEFORE UPDATE ON behaviors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedbacks_updated_at BEFORE UPDATE ON feedbacks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2.2 테이블 생성 확인

SQL 실행 후 **"Success. No rows returned"** 메시지가 나오면 **정상**입니다! 
(CREATE 문은 행을 반환하지 않기 때문에 이 메시지가 표시됩니다)

테이블이 제대로 생성되었는지 확인하려면 다음 SQL을 실행하세요:

```sql
-- 테이블 목록 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('behaviors', 'feedbacks');

-- 테이블 구조 확인
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'behaviors'
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'feedbacks'
ORDER BY ordinal_position;

-- 인덱스 확인
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename IN ('behaviors', 'feedbacks');

-- RLS 정책 확인
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('behaviors', 'feedbacks');
```

**예상 결과:**
- `behaviors`와 `feedbacks` 테이블이 보여야 합니다
- 각 테이블의 컬럼 정보가 표시되어야 합니다
- 인덱스들이 생성되어 있어야 합니다
- RLS 정책들이 활성화되어 있어야 합니다

## 3. 패키지 설치

```bash
npm install @supabase/supabase-js
```

## 4. Supabase 클라이언트 설정

### 4.1 클라이언트 사이드 클라이언트
`app/lib/supabase-client.ts` 생성

### 4.2 서버 사이드 클라이언트
`app/lib/supabase-server.ts` 생성

## 5. API 라우트 전환

기존 API 라우트를 Supabase를 사용하도록 수정:
- `app/api/behavior/route.ts`
- `app/api/feedback/route.ts`
- `app/api/feedback/analysis/route.ts`

## 6. 클라이언트 사이드 전환

- `app/behavior/tracker.ts` - Supabase에 저장
- `app/behavior/feedback-manager.ts` - Supabase에 저장
- `app/lib/mockapi.ts` - 삭제됨 (Supabase로 대체)

## 7. 마이그레이션 전략

1. **점진적 전환**: localStorage와 Supabase 병행 사용
2. **데이터 마이그레이션**: 기존 localStorage 데이터를 Supabase로 이전 (선택사항)
3. **폴백 전략**: Supabase 실패 시 localStorage 사용

## 8. 테스트

1. 로컬 환경에서 테스트
2. 데이터 저장 확인
3. 데이터 조회 확인
4. 분석 기능 확인

