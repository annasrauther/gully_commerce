'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Warehouse, PlusCircle, UserCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Home', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Stock', icon: Warehouse, href: '/warehouse' },
    { label: 'Create', icon: PlusCircle, href: '/create' },
    { label: 'Profile', icon: '/payouts', iconAlt: UserCircle, href: '/payouts' }
  ]

  // Only show on merchant routes
  const isMerchantRoute = pathname.startsWith('/dashboard') || 
                         pathname.startsWith('/warehouse') || 
                         pathname.startsWith('/create') || 
                         pathname.startsWith('/payouts')

  if (!isMerchantRoute) return null

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white/90 backdrop-blur-xl border-t border-zinc-200 px-6 py-3 flex items-center justify-between z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const Icon = typeof item.icon === 'string' ? item.iconAlt! : item.icon
        const isActive = pathname === item.href

        return (
          <Link 
            key={item.href} 
            href={item.href}
            className="flex flex-col items-center gap-1 group relative py-1 focus:outline-none"
          >
            <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-black text-white' : 'text-zinc-400 group-active:scale-90 group-hover:text-black'}`}>
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-[0.1em] transition-colors ${isActive ? 'text-black opacity-100' : 'text-zinc-400 opacity-60'}`}>
              {item.label}
            </span>
            {isActive && (
              <motion.div 
                layoutId="nav-glow"
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-black rounded-b-full shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
