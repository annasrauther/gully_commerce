'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ShoppingBag, Zap, ShieldCheck, Smartphone, Share2 } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex-1 bg-white flex flex-col font-sans selection:bg-uber-green selection:text-white overflow-hidden">
      {/* Navbar */}
      <nav className="p-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-black">Gully</span>
        </div>
        <Link 
          href="/login" 
          className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-black/5"
        >
          Merchant Login
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-12 pb-20 flex flex-col gap-8 max-w-[420px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 bg-uber-green/10 text-uber-green text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
            Built for Indian Street Merchants
          </span>
          <h1 className="text-5xl font-black tracking-tighter leading-[1.05] mb-6 text-black">
            Your Shop,<br /><span className="text-uber-green">Online</span> in<br />60 Seconds.
          </h1>
          <p className="text-lg text-zinc-600 font-medium leading-relaxed mb-8">
            The Shopify competitor designed for the gully. List products with AI, share on WhatsApp, and get paid directly via UPI.
          </p>
          
          <div className="flex flex-col gap-4">
            <Link 
              href="/login" 
              className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.15)] active:scale-95 transition-all"
            >
              Start Selling Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-center text-[11px] font-bold text-zinc-500 uppercase tracking-widest leading-loose">
              Zero platform fees • No tech skills needed
            </p>
          </div>
        </motion.div>

        {/* Floating Preview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-8 bg-zinc-50 rounded-[40px] p-2 border border-zinc-100 shadow-2xl relative"
        >
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-zinc-50 overflow-hidden">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <div className="h-2.5 w-32 bg-zinc-100 rounded-full" />
                  <div className="h-2.5 w-20 bg-zinc-50 rounded-full" />
                </div>
             </div>
             <div className="space-y-4 mb-10">
                <div className="h-5 w-full bg-zinc-50 rounded-lg" />
                <div className="h-5 w-4/5 bg-zinc-50 rounded-lg" />
             </div>
             <div className="h-16 w-full bg-uber-green rounded-2xl flex items-center justify-center text-white text-sm font-black tracking-wide shadow-lg shadow-uber-green/20">
                PAY WITH UPI
             </div>
          </div>
          {/* Badge */}
          <div className="absolute -top-6 -right-4 bg-white p-5 rounded-2xl shadow-2xl border border-zinc-50 flex flex-col items-center">
             <div className="bg-uber-green/10 p-2 rounded-full mb-2">
               <Share2 className="w-6 h-6 text-uber-green" />
             </div>
             <span className="text-[11px] font-black tracking-tighter text-black">VIRAL</span>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="bg-zinc-50 px-6 py-24 flex flex-col gap-12">
        <div className="max-w-[420px] mx-auto w-full">
          <h2 className="text-3xl font-black mb-16 flex items-center gap-3 text-black">
            <Zap className="w-8 h-8 text-uber-green" fill="currentColor" />
            Why Gully?
          </h2>
          
          <div className="grid grid-cols-1 gap-14">
            <div className="flex gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white flex-shrink-0 flex items-center justify-center border border-zinc-100 shadow-md">
                <Zap className="w-7 h-7 text-uber-green" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3 text-black">Speed Lister</h3>
                <p className="text-zinc-600 text-base font-medium leading-relaxed">
                  Snap a photo, and our AI writes the description in Hinglish. Just add a price and you're live.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white flex-shrink-0 flex items-center justify-center border border-zinc-100 shadow-md">
                <Share2 className="w-7 h-7 text-uber-green" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3 text-black">WhatsApp Viral Loop</h3>
                <p className="text-zinc-600 text-base font-medium leading-relaxed">
                  Share beautiful product links directly to WhatsApp. Buyers can buy in 2 taps without downloading an app.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white flex-shrink-0 flex items-center justify-center border border-zinc-100 shadow-md">
                <ShieldCheck className="w-7 h-7 text-uber-green" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3 text-black">Zero Fee Payouts</h3>
                <p className="text-zinc-600 text-base font-medium leading-relaxed">
                  We don't take a cut. Money goes directly to your UPI ID (GPay, PhonePe, Paytm).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 py-28 text-center bg-white border-t border-zinc-50">
        <div className="max-w-[420px] mx-auto w-full flex flex-col gap-8">
          <h2 className="text-4xl font-black tracking-tight text-black leading-tight">Ready to join the revolution?</h2>
          <p className="text-zinc-500 font-medium text-lg">Join 500+ local merchants selling on Gully.</p>
          <Link 
            href="/login" 
            className="w-full bg-black text-white py-6 rounded-2xl font-bold text-xl mt-4 active:scale-95 transition-transform shadow-xl"
          >
            Create My Store
          </Link>
        </div>
      </section>

      <footer className="p-10 bg-white border-t border-zinc-50 text-center text-zinc-400 font-bold text-[11px] uppercase tracking-[0.25em]">
        © 2024 Gully Commerce • Empowering Bharat
      </footer>
    </div>
  )
}
