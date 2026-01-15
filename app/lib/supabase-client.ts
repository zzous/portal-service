import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 환경 변수가 없으면 null 반환 (선택적 사용)
let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // 세션 저장 안 함 (현재는 인증 미사용)
    },
  });
} else {
  console.warn('[Supabase] 환경 변수가 설정되지 않았습니다. Supabase 기능이 비활성화됩니다.');
}

// 클라이언트 사이드에서 사용하는 Supabase 클라이언트
export { supabase };

