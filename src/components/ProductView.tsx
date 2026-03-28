'use client'

import { useState } from 'react'
import { MapPin, ArrowRight, X, Loader2, Check, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface ProductViewProps {
  product: any
  slug: string
}

export default function ProductView({ product, slug }: ProductViewProps) {
  const [pincode, setPincode] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'serviceable' | 'unserviceable'>('idle')
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll for sticky header treatment
  if (typeof window !== 'undefined') {
    window.onscroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
  }

  const checkPincode = async (val: string) => {
    const code = val.replace(/\D/g, '').slice(0, 6)
    setPincode(code)
    
    if (code.length === 6 && product) {
      setStatus('checking')
      const { data } = await supabase
        .from('service_pincodes')
        .select('pincode')
        .match({ merchant_id: product.merchant_id, pincode: code })
        .maybeSingle()

      setStatus(data ? 'serviceable' : 'unserviceable')
    } else {
      setStatus('idle')
    }
  }

  return (
    <div className="flex-1 bg-white max-w-[420px] mx-auto w-full min-h-screen flex flex-col pb-32 font-sans selection:bg-black selection:text-white">
      {/* Premium Sticky Header */}
      <header className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between ${isScrolled ? 'bg-white/90 backdrop-blur-xl border-b border-zinc-200 shadow-sm' : 'bg-transparent'}`}>
        <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl transition-all active:scale-95 group">
          <X className={`w-5 h-5 transition-colors ${isScrolled ? 'text-black' : 'text-white'}`} />
        </Link>
        <div className={`flex items-center gap-2 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-xs font-black tracking-tighter uppercase">Gully Commerce</p>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* Hero Image Section */}
      <section className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          src={product.image_url} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </section>

      {/* Content Section (Uber Stark Styling) */}
      <main className="px-6 -mt-12 mb-auto bg-white rounded-t-[40px] pt-12 flex flex-col gap-10 relative z-10">
        {/* Title & Price Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-black text-[10px] font-black uppercase tracking-[0.2em] text-white rounded-md shadow-lg shadow-black/10">
              Verified Merchant
            </span>
          </div>
          <h1 className="text-[48px] font-black tracking-[-0.05em] leading-[0.9] text-black mb-3">
            {product.title}
          </h1>
          <p className="text-[40px] font-black text-uber-green tracking-[-0.05em]">
            ₹{product.price}
          </p>
        </div>

        {/* Uber Low-Friction Delivery Check */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-600">
              Delivery Availability
            </p>
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="relative group">
            <input 
              type="tel" 
              className={`w-full h-18 px-6 bg-white border-2 rounded-2xl text-xl font-black outline-none transition-all placeholder:text-zinc-400 text-black shadow-sm ${
                status === 'serviceable' ? 'border-uber-green' : 
                status === 'unserviceable' ? 'border-red-500' : 
                'border-zinc-200 focus:border-black'
              }`}
              placeholder="Enter 6-digit pincode" 
              value={pincode} 
              onChange={e => checkPincode(e.target.value)} 
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
              {status === 'checking' && <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />}
              {status === 'serviceable' && <div className="w-6 h-6 bg-[#06c167] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#06c167]/20"><Check className="w-4 h-4" /></div>}
              {status === 'unserviceable' && <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white rotate-180"><AlertCircle className="w-4 h-4" /></div>}
            </div>
          </div>
          <AnimatePresence>
            {status === 'serviceable' && (
              <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-[#06c167] text-xs font-black uppercase tracking-widest pl-1">
                ⚡ Standard Delivery Available
              </motion.p>
            )}
            {status === 'unserviceable' && (
              <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-xs font-black uppercase tracking-widest pl-1">
                Out of delivery range
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Description Section */}
        <div className="flex flex-col gap-4 pb-12">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-600 px-1">
            Product Details
          </p>
          <p className="text-[17px] leading-[1.4] font-medium text-zinc-800 tracking-tight">
            {product.description || "No description provided."}
          </p>
        </div>
      </main>

      {/* Floating Uber Master Button */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-6 bg-white/80 backdrop-blur-xl border-t border-zinc-200 z-50">
        <Link 
          href={`/${slug}/checkout`} 
          className={`w-full h-18 rounded-full flex items-center justify-between px-8 font-black text-xl transition-all active:scale-[0.97] group shadow-2xl ${
            status === 'unserviceable' ? 'bg-zinc-100 text-zinc-400 pointer-events-none' : 'bg-black text-white shadow-black/20'
          }`}
        >
          <span className="group-active:translate-x-1 transition-transform">Buy Now</span>
          <div className="flex items-center gap-3">
            <span className="text-base opacity-60">₹{product.price}</span>
            <ArrowRight className="w-7 h-7" />
          </div>
        </Link>
      </footer>
    </div>
  )
}
