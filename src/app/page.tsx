'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ShoppingBag, Zap, ShieldCheck, Smartphone, Share2, ChartBar, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const HERO_IMAGE = "/images/hero.png"
const SPEED_LISTER_IMAGE = "/images/speed_lister.png"
const WHATSAPP_SHARE_IMAGE = "/images/whatsapp_share.png"
const UPI_PAYMENT_IMAGE = "/images/upi_payment.png"
const HOW_IT_WORKS_STEPS_IMAGE = "/images/how_it_works.png"

export default function LandingPage() {
  return (
    <div className="flex-1 bg-white flex flex-col font-sans selection:bg-black selection:text-white transition-colors duration-300">
      {/* Premium Navbar (Uber Stark Style) */}
      <nav className="px-6 py-6 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-black tracking-tighter text-black uppercase">Gully Commerce</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="hidden sm:block text-[10px] font-black tracking-[0.25em] text-zinc-500 hover:text-black transition-colors">Merchant Login</Link>
          <Link 
            href="/login" 
            className="bg-black text-white px-8 py-3 rounded-full text-[13px] font-black tracking-tight hover:bg-zinc-800 transition-all active:scale-95 shadow-2xl shadow-black/20"
          >
            Start Selling
          </Link>
        </div>
      </nav>

      {/* Modern Hero Section (Uber Layout) */}
      <section className="relative overflow-hidden bg-white px-6 pt-16 pb-24 sm:pt-32 lg:px-20">
        <div className="max-w-[1240px] mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-8 z-10"
          >
            <h1 className="text-[64px] sm:text-[92px] font-black tracking-[-0.07em] leading-[0.85] text-black">
              Your shop,<br />
              <span className="text-zinc-300">Online.</span><br />
              <span className="text-black">No apps.</span>
            </h1>
            <p className="text-2xl font-medium text-zinc-500 max-w-[500px] tracking-tight leading-snug">
              Listing your goods shouldn't be hard. Upload photos, share on WhatsApp, and get paid directly via UPI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link 
                href="/login" 
                className="bg-black text-white px-10 py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-4 shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all group"
              >
                Start Selling Now
                <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-zinc-100" />)}
               </div>
               <p className="text-sm font-black uppercase tracking-widest text-zinc-400">Join 12,000+ local sellers</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }} 
            animate={{ opacity: 1, scale: 1, rotate: 0 }} 
            transition={{ duration: 1, delay: 0.2 }}
            className="relative lg:h-[700px] flex items-center justify-center"
          >
            <img 
              src={HERO_IMAGE} 
              alt="Gully Commerce Street Merchant" 
              className="w-full h-full object-contain drop-shadow-[0_45px_100px_rgba(0,0,0,0.1)]"
            />
          </motion.div>
        </div>
      </section>

      {/* Feature Grid (Uber Gray Cards Style) */}
      <section className="bg-zinc-50 px-6 py-32 lg:px-20">
        <div className="max-w-[1240px] mx-auto flex flex-col gap-16">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-black uppercase tracking-[0.4em] text-zinc-400">Features</p>
            <h2 className="text-[56px] font-black tracking-tighter text-black leading-none">Built for the street.</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Speed Lister */}
            <div className="bg-[#F6F6F6] p-10 rounded-[40px] border border-zinc-100 flex flex-col gap-10 hover:shadow-xl transition-all duration-500 group overflow-hidden">
               <div className="flex flex-col gap-4">
                  <h3 className="text-3xl font-black tracking-tight text-black">Speed Lister</h3>
                  <p className="text-zinc-500 font-bold leading-relaxed">Snap a photo. Artificial Intelligence writes your description. Just add price and go live.</p>
                  <Link href="/login" className="text-sm font-black tracking-tight border-b-2 border-black w-fit pb-1 mt-2">Details</Link>
               </div>
               <img src={SPEED_LISTER_IMAGE} className="w-full h-48 object-contain mt-auto group-hover:scale-110 transition-transform duration-500" />
            </div>

            {/* WhatsApp Viral Loop */}
            <div className="bg-[#F6F6F6] p-10 rounded-[40px] border border-zinc-100 flex flex-col gap-10 hover:shadow-xl transition-all duration-500 group overflow-hidden">
               <div className="flex flex-col gap-4">
                  <h3 className="text-3xl font-black tracking-tight text-black">WhatsApp Loop</h3>
                  <p className="text-zinc-500 font-bold leading-relaxed">Share beautiful links. No app download for buyers. Seamless 2-tap buying experience.</p>
                  <Link href="/login" className="text-sm font-black tracking-tight border-b-2 border-black w-fit pb-1 mt-2">Details</Link>
               </div>
               <img src={WHATSAPP_SHARE_IMAGE} className="w-full h-48 object-contain mt-auto group-hover:scale-110 transition-transform duration-500" />
            </div>

            {/* Zero Fee Payouts */}
            <div className="bg-[#F6F6F6] p-10 rounded-[40px] border border-zinc-100 flex flex-col gap-10 hover:shadow-xl transition-all duration-500 group overflow-hidden">
               <div className="flex flex-col gap-4">
                  <h3 className="text-3xl font-black tracking-tight text-black">Direct Payouts</h3>
                  <p className="text-zinc-500 font-bold leading-relaxed">No commissions. Money flows directly from buyer to your UPI ID via GPay or PhonePe.</p>
                  <Link href="/login" className="text-sm font-black tracking-tight border-b-2 border-black w-fit pb-1 mt-2">Details</Link>
               </div>
               <img src={UPI_PAYMENT_IMAGE} className="w-full h-48 object-contain mt-auto group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works (Uber Style Vertical Timeline) */}
      <section className="bg-white px-6 py-32 lg:px-20 overflow-hidden">
        <div className="max-w-[1240px] mx-auto flex flex-col gap-24">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-black uppercase tracking-[0.4em] text-zinc-400">Process</p>
            <h2 className="text-[56px] font-black tracking-tighter text-black leading-none">A quick guide to Gully.</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-32 items-start">
             <div className="w-full lg:w-1/2 rounded-[48px] overflow-hidden bg-zinc-50 border border-zinc-100 p-2 shadow-2xl">
                <img src={HOW_IT_WORKS_STEPS_IMAGE} className="w-full h-full object-cover rounded-[40px]" />
             </div>

             <div className="w-full lg:w-1/2 flex flex-col gap-16 py-10">
                {[
                  { step: "1", title: "Getting started", desc: "Sign up with your phone number and shop name. No KYC, no waiting time." },
                  { step: "2", title: "Upload products", desc: "Snap a photo of any item. Our AI generates the product name and viral description automatically." },
                  { step: "3", title: "Share on WhatsApp", desc: "Copy your magic link and share it with your existing customers or on social media." },
                  { step: "4", title: "Receive orders", desc: "Customers order instantly. You get notified on WhatsApp with the buyer's address." },
                  { step: "5", title: "Direct payment", desc: "Buyers pay you directly via UPI. We take zero cut from your hard-earned money." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-10 items-start group">
                    <div className="relative flex flex-col items-center">
                       <div className="w-4 h-4 rounded-full bg-black z-10" />
                       {i !== 4 && <div className="absolute top-4 w-0.5 h-[120px] bg-zinc-100 group-hover:bg-zinc-200 transition-colors" />}
                    </div>
                    <div className="flex flex-col gap-4">
                       <h4 className="text-3xl font-black tracking-tight text-black leading-none">{item.step}. {item.title}</h4>
                       <p className="text-lg font-medium text-zinc-500 leading-relaxed max-w-[400px]">{item.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Footer CTA (Uber Black Section) */}
      <section className="px-6 py-40 mb-10 mx-6 bg-black rounded-[60px] text-center text-white relative overflow-hidden">
        <div className="max-w-[800px] mx-auto flex flex-col gap-12 relative z-10">
          <h2 className="text-[64px] sm:text-[84px] font-black tracking-[-0.05em] leading-[0.9]">Ready to list your shop?</h2>
          <p className="text-2xl font-medium text-zinc-400 max-w-[600px] mx-auto leading-relaxed">
            Join the digital revolution in Bharat. Start selling on Gully Commerce today for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 mt-6 justify-center">
            <Link 
              href="/login" 
              className="bg-white text-black px-12 py-7 rounded-2xl font-black text-2xl active:scale-95 transition-all shadow-2xl"
            >
              Start Selling
            </Link>
            <Link 
              href="/login" 
              className="bg-zinc-900 text-white px-12 py-7 rounded-2xl font-black text-2xl border border-zinc-800 active:scale-95 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
        
        {/* Modernist Geometric Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-800/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-zinc-800/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]" />
      </section>

      <footer className="px-10 py-20 bg-white border-t border-zinc-50 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-4">
          <span className="text-lg font-black tracking-tighter text-black uppercase">Gully Commerce</span>
        </div>
        
        <div className="flex gap-10">
          {["Privacy", "Terms", "Support", "Careers"].map(link => (
            <Link key={link} href="#" className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 hover:text-black transition-colors">{link}</Link>
          ))}
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-300">© 2024 EMPOWERING BHARAT</p>
      </footer>
    </div>
  )
}
