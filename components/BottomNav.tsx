'use client';

import { Home, Package, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: Package, label: 'Inventory', href: '/dashboard/inventory' },
  { icon: ShoppingBag, label: 'Orders', href: '/dashboard/orders' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Only show bottom nav on app-like pages (dashboard-prefixed)
  const isAppPage = pathname.startsWith('/dashboard') || 
                    pathname === '/onboarding';

  if (!isAppPage) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-p-bg px-6 pb-4 pt-2 md:hidden shadow-lg">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 transition-all active:scale-90 relative ${isActive ? 'text-p-indigo' : 'text-p-slate'
                }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'fill-p-indigo/10 transition-all' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-p-indigo rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
