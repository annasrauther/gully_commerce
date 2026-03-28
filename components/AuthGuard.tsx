'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const PUBLIC_ROUTES = ['/', '/login', '/checkout', '/order-confirmed'];
    
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setLoading(false);

      const isPublicRoute = PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/p/');
      const isMockSession = localStorage.getItem('gully_mock_session') === 'true';

      if (!user && !isPublicRoute && !isMockSession) {
        router.push('/login');
      }

      // If logged in, check if they have a store
      if (user && !isPublicRoute) {
        const { data: store } = await supabase
          .from('stores')
          .select('id')
          .eq('seller_id', user.id)
          .single();

        if (!store && pathname !== '/onboarding') {
          router.push('/onboarding');
        }
      }
    };

    checkUser();
    
    // ... rest of the logic

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const isMockSession = localStorage.getItem('gully_mock_session') === 'true';
      if (!session?.user && !isMockSession && pathname !== '/' && !pathname.startsWith('/p/')) {
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wa-bg">
        <div className="w-8 h-8 border-4 border-wa-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
