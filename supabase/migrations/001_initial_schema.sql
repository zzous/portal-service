-- 행태감지 시스템 초기 스키마

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
CREATE INDEX IF NOT EXISTS idx_behaviors_created_at ON behaviors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedbacks_session_id ON feedbacks(session_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_variant ON feedbacks(variant);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at DESC);

-- 4. RLS (Row Level Security) 정책 설정
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

-- 5. updated_at 자동 업데이트 함수
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

