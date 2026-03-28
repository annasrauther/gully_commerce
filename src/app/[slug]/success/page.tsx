'use client'

import { use, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Share2, ArrowRight, ShoppingBag, Rocket } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function SuccessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [product, setProduct] = useState<any>(null)
  
  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', slug)
        .single()
      if (data) setProduct(data)
    }
    fetchProduct()
  }, [slug])

  const shareVirally = () => {
    const text = `I just bought this amazing ${product?.title || 'item'} on Gully Commerce! 🛍️ Check it out here: ${window.location.origin}/${slug}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="flex-1 bg-white max-w-[420px] mx-auto w-full min-h-screen flex flex-col items-center justify-center p-8 text-center font-sans">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12 }}
        className="w-24 h-24 bg-uber-green rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-uber-green/20"
      >
        <CheckCircle className="w-12 h-12 text-white" />
      </motion.div>

      <h1 className="text-[40px] font-black tracking-[-0.05em] leading-[0.9] text-black mb-4">
        Order<br />Initiated!
      </h1>
      
      <p className="text-zinc-500 font-bold text-lg mb-10 tracking-tight">
        Redirecting to your payment app...
      </p>

      {product && (
        <div className="w-full bg-zinc-50 border border-zinc-200 rounded-[32px] p-6 mb-12 flex items-center gap-5 shadow-sm">
          <img src={product.image_url} className="w-20 h-20 rounded-2xl object-cover shadow-md" />
          <div className="flex flex-col items-start text-start">
            <h3 className="font-black text-lg text-black tracking-tight leading-tight">{product.title}</h3>
            <p className="text-xl font-black text-uber-green tracking-tight">₹{product.price}</p>
          </div>
        </div>
      )}

      {/* Virality Section */}
      <section className="w-full mb-12">
        <p className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-600 mb-4 px-1">
          Tell Your Friends
        </p>
        <button 
          onClick={shareVirally}
          className="w-full h-16 bg-black text-white rounded-full font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-black/20"
        >
          <Share2 className="w-5 h-5" />
          Share On WhatsApp
        </button>
      </section>

      {/* Motivation Section */}
      <section className="w-full bg-zinc-900 rounded-[32px] p-8 mb-12 text-start flex flex-col gap-5 shadow-2xl shadow-black/10">
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
          <Rocket className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
            Others buy, be the one who builds.
          </h2>
          <p className="text-zinc-400 font-medium text-sm">
            Start your own digital store on Gully in 60 seconds. It's free.
          </p>
        </div>
        <Link 
          href="/" 
          className="w-fit bg-white text-black px-6 py-3 rounded-full font-black text-sm flex items-center gap-2 active:scale-95 transition-all"
        >
          Start Selling
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <Link 
        href={`/${slug}`} 
        className="flex items-center gap-2 text-zinc-900 font-black text-sm uppercase tracking-[0.1em] hover:gap-3 transition-all"
      >
        <ShoppingBag className="w-4 h-4" />
        Return to Shop
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
