'use client';

import { useEffect, useRef } from 'react';
import { BehaviorTracker } from '../behavior/tracker';
import { usePathname } from 'next/navigation';

interface BehaviorTrackingProps {
  variant: 'A' | 'B';
}

export function BehaviorTracking({ variant }: BehaviorTrackingProps) {
  const trackerRef = useRef<BehaviorTracker | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!trackerRef.current) {
      trackerRef.current = new BehaviorTracker(variant, pathname);
    } else {
      trackerRef.current.trackPageView(pathname);
    }

    return () => {
      if (trackerRef.current) {
        trackerRef.current.sendBehaviorData();
      }
    };
  }, [variant, pathname]);

  return null;
}

