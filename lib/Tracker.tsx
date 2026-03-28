'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analytics, AnalyticsEvent, EventProperties } from './analytics';

interface TrackerProps {
  event?: AnalyticsEvent;
  props?: EventProperties;
}

/**
 * A drop-in component to track page views or specific interactions
 * Use this in Server Components to trigger client-side tracking
 */
export default function GullyTracker({ event = 'page_view', props = {} }: TrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const source = searchParams.get('ref') || searchParams.get('utm_source') || 'direct';
    
    analytics.track(event, {
      ...props,
      source,
      path: pathname,
      metadata: { 
        ...props.metadata,
        full_url: window.location.href,
        referrer: document.referrer
      }
    });
  }, [pathname, searchParams]); // Re-track on path/param changes

  return null; // Invisible component
}
