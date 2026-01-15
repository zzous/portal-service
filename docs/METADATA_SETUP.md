# Next.js 페이지별 메타데이터 설정 가이드

## 1. 메타데이터 설정 방법

### 1.1 정적 메타데이터 (서버 컴포넌트)

서버 컴포넌트에서는 `metadata` export를 사용합니다.

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '페이지 제목',
  description: '페이지 설명',
  keywords: ['키워드1', '키워드2'],
  openGraph: {
    title: 'OG 제목',
    description: 'OG 설명',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Twitter 제목',
    description: 'Twitter 설명',
  },
};
```

### 1.2 동적 메타데이터 (generateMetadata)

동적 데이터를 사용하는 경우 `generateMetadata` 함수를 사용합니다.

```typescript
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const data = await fetchData(params.id);
  
  return {
    title: data.title,
    description: data.description,
  };
}
```

### 1.3 클라이언트 컴포넌트에서 메타데이터 설정

클라이언트 컴포넌트에서는 직접 메타데이터를 export할 수 없으므로, 다음 방법을 사용합니다:

**방법 1: useEffect로 document.title 설정**
```typescript
'use client';

import { useEffect } from 'react';

export default function ClientPage() {
  useEffect(() => {
    document.title = '페이지 제목';
    
    // meta description 설정
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', '페이지 설명');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = '페이지 설명';
      document.head.appendChild(meta);
    }
  }, []);
  
  return <div>...</div>;
}
```

**방법 2: 서버 컴포넌트 래퍼 사용 (권장)**
```typescript
// app/demo/layout.tsx (서버 컴포넌트)
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'A/B 테스트 데모',
  description: 'A/B 테스트와 행태감지 시스템 데모 페이지',
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

## 2. Analytics 용도로 활용

### 2.1 페이지 추적을 위한 메타데이터

각 페이지에 고유한 메타데이터를 설정하여 Analytics에서 페이지를 구분할 수 있습니다.

```typescript
export const metadata: Metadata = {
  title: 'A/B 테스트 데모 | 행태감지 시스템',
  description: 'A/B 테스트와 행태감지 시스템 데모 페이지',
  // Analytics용 커스텀 메타데이터
  other: {
    'page-type': 'demo',
    'page-category': 'ab-test',
    'analytics-id': 'demo-page',
  },
};
```

### 2.2 BehaviorTracker와 연동

메타데이터를 BehaviorTracker에서 활용:

```typescript
// app/behavior/tracker.ts
trackPageView(pagePath: string): void {
  // 메타데이터에서 페이지 정보 추출
  const pageTitle = document.title;
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content');
  const pageType = document.querySelector('meta[name="page-type"]')?.getAttribute('content');
  
  // 이벤트에 메타데이터 포함
  const event: BehaviorEvent = {
    type: 'view',
    timestamp: 0,
    pagePath,
    metadata: {
      title: pageTitle,
      description: metaDescription,
      pageType,
    },
  };
  
  this.events.push(event);
}
```

## 3. 권장 구조

각 페이지에 `layout.tsx`를 만들어 메타데이터를 설정하는 것이 가장 깔끔합니다.

```
app/
├── layout.tsx          # 루트 레이아웃 (전역 메타데이터)
├── page.tsx            # 홈 페이지
├── demo/
│   ├── layout.tsx      # 데모 페이지 메타데이터
│   └── page.tsx        # 데모 페이지
├── analysis/
│   ├── layout.tsx      # 분석 페이지 메타데이터
│   └── page.tsx        # 분석 페이지
└── report/
    ├── layout.tsx      # 보고서 페이지 메타데이터
    └── page.tsx        # 보고서 페이지
```

