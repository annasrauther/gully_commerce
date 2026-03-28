'use client';

import { usePathname } from 'next/navigation';
import BottomNav from "@/components/BottomNav";
import InstallPrompt from "@/components/InstallPrompt";
import { useMemo } from 'react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Immersive Landing Page stays full-width. Internal pages are mobile-fixed.
  const isLandingPage = pathname === '/';
  
  if (isLandingPage) {
    return (
      <div className="w-full relative min-h-screen overflow-x-hidden">
        {children}
        <InstallPrompt />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-100 flex justify-center overflow-x-hidden relative">
      <div className="w-full max-w-[480px] min-h-screen bg-p-bg relative shadow-[0_0_100px_rgba(0,0,0,0.05)] border-x border-p-charcoal/5 flex flex-col font-inter">
        <div className="flex-1 w-full relative">
           {children}
        </div>
        <BottomNav />
        <InstallPrompt />
      </div>
    </div>
  );
}
