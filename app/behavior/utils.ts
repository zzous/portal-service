export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export function getVariant(sessionId: string): 'A' | 'B' {
  // 세션 ID 기반으로 일관된 버전 할당
  const hash = sessionId.split('-')[0];
  return parseInt(hash) % 2 === 0 ? 'A' : 'B';
}

