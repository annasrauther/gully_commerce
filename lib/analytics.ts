'use client';

import { supabase } from './supabase';

export type AnalyticsEvent = 
  | 'page_view' 
  | 'button_click' 
  | 'signup_started' 
  | 'signup_completed' 
  | 'store_visit' 
  | 'order_initiated' 
  | 'voice_listing_used';

export interface EventProperties {
  store_id?: string;
  product_id?: string;
  source?: string; // e.g. 'whatsapp', 'facebook', 'qr_code'
  path?: string;
  metadata?: Record<string, any>;
}

/**
 * Gully Analytics Service
 * Tracks both Product Growth (Owner) and Store Performance (Merchant)
 */
export const analytics = {
  /**
   * Track a generic event in Supabase
   * Note: In production, consider buffering these or using a service like PostHog
   */
  async track(event: AnalyticsEvent, props: EventProperties = {}) {
    try {
      // Get current session for user_id if available
      const session = typeof window !== 'undefined' ? localStorage.getItem('gully_mock_session') : null;
      const path = typeof window !== 'undefined' ? window.location.pathname : '';
      const search = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const source = props.source || search?.get('ref') || search?.get('utm_source') || 'direct';

      // Log to console for dev visibility
      console.log(`[Analytics] ${event}`, { ...props, source, path });

      // Persist to Supabase if the table exists
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_type: event,
          store_id: props.store_id,
          product_id: props.product_id,
          source: source,
          path: path,
          properties: props.metadata || {},
          session_id: session
        });

      if (error && error.code !== 'PGRST116') { // Ignore missing table errors for now
        console.warn('Analytics failed to persist (Table might not exist yet):', error.message);
      }
    } catch (err) {
      console.error('Analytics Error:', err);
    }
  },

  /**
   * Specifically track storefront visits
   */
  trackStoreVisit(storeId: string, productId?: string) {
    this.track('store_visit', { store_id: storeId, product_id: productId });
  },

  /**
   * Track Marketing Source (e.g. tracking the WhatsApp Group performance)
   */
  identifySource() {
    if (typeof window === 'undefined') return 'direct';
    const params = new URLSearchParams(window.location.search);
    return params.get('ref') || params.get('utm_source') || 'direct';
  }
};
