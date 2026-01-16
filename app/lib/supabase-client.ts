import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 환경 변수 디버깅 (개발 환경에서만)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('[Supabase] 환경 변수 체크:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlLength: supabaseUrl?.length || 0,
    keyLength: supabaseAnonKey?.length || 0,
  });
}

// 환경 변수가 없으면 null 반환 (선택적 사용)
let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // 세션 저장 안 함 (현재는 인증 미사용)
    },
  });
  if (typeof window !== 'undefined') {
    console.log('[Supabase] 클라이언트 초기화 완료');
  }
} else {
  if (typeof window !== 'undefined') {
    console.warn('[Supabase] 환경 변수가 설정되지 않았습니다. Supabase 기능이 비활성화됩니다.');
    console.warn('[Supabase] Netlify 환경 변수 설정 필요:');
    console.warn('  - NEXT_PUBLIC_SUPABASE_URL');
    console.warn('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
}

// 클라이언트 사이드에서 사용하는 Supabase 클라이언트
export { supabase };

