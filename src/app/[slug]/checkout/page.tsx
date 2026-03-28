'use client'

import { useState, use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, ShieldCheck, MapPin, Smartphone, User } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'

export default function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' })

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from('products')
        .select('*, merchants(*)')
        .eq('id', slug)
        .single()
      if (data) setProduct(data)
      setLoading(false)
    }
    fetchProduct()
  }, [slug])

  const handlePayment = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('Details required for delivery')
      return
    }

    try {
      const { error } = await supabase.from('orders').insert({
        product_id: product.id,
        merchant_id: product.merchant_id,
        buyer_phone: formData.phone,
        buyer_address: formData.address,
        status: 'pending'
      } as any)

      if (error) throw error

      toast.success('Initiating Secure Payment...')
      const upiUrl = `upi://pay?pa=${product.merchants.upi_id}&pn=${encodeURIComponent(product.merchants.name)}&am=${product.price}&tn=${encodeURIComponent(product.title)}`
      
      // Trigger UPI and move to success screen
      window.location.href = upiUrl
      router.push(`/${slug}/success`)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
    </div>
  )

  return (
    <div className="flex-1 bg-white max-w-[420px] mx-auto w-full min-h-screen flex flex-col font-sans selection:bg-black selection:text-white">
      <header className="px-6 py-6 flex items-center gap-4 sticky top-0 bg-white/90 backdrop-blur-xl z-30 border-b border-zinc-200">
        <button onClick={() => router.back()} className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-zinc-200 active:scale-95 transition-all group">
          <ArrowLeft className="w-6 h-6 text-black group-hover:-translate-x-1 transition-transform" />
        </button>
        <h1 className="text-2xl font-black tracking-tighter text-black">Checkout</h1>
      </header>

      <main className="px-6 flex flex-col gap-10 pb-40">
        {/* Order Summary */}
        <section className="flex flex-col gap-4">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-600 pl-1">Order Summary</p>
          <div className="bg-white p-5 rounded-[24px] border border-zinc-200 flex items-center gap-5 shadow-sm">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
              <img src={product.image_url} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="font-black text-xl text-black tracking-tight leading-tight">{product.title}</h3>
              <p className="text-[22px] font-black text-uber-green tracking-tight">₹{product.price}</p>
            </div>
          </div>
        </section>

        {/* Form Fields */}
        <section className="flex flex-col gap-6">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-600 pl-1">Delivery Details</p>
          
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-zinc-600 pl-1">
                <User className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Full Name</span>
              </div>
              <input 
                type="text" 
                placeholder="Who should we deliver to?" 
                className="w-full h-18 px-6 bg-white border-2 border-zinc-200 rounded-2xl text-lg font-black outline-none focus:border-black transition-all placeholder:text-zinc-400 text-black shadow-sm"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-zinc-600 pl-1">
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Phone Number</span>
              </div>
              <input 
                type="tel" 
                placeholder="For delivery updates" 
                className="w-full h-18 px-6 bg-white border-2 border-zinc-200 rounded-2xl text-lg font-black outline-none focus:border-black transition-all placeholder:text-zinc-400 text-black shadow-sm"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-zinc-600 pl-1">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Full Address</span>
              </div>
              <textarea 
                placeholder="Complete street address, house no, landmark" 
                className="w-full p-6 bg-white border-2 border-zinc-200 rounded-[24px] text-lg font-black outline-none focus:border-black transition-all placeholder:text-zinc-400 text-black shadow-sm min-h-[140px] resize-none leading-snug" 
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-2.5 py-4 bg-uber-green/5 rounded-2xl border border-uber-green/10">
          <ShieldCheck className="w-5 h-5 text-uber-green" />
          <span className="text-[11px] font-black uppercase tracking-[0.1em] text-uber-green">Secure UPI Payment</span>
        </div>
      </main>

      {/* Floating Action Button */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[420px] w-full p-6 bg-white/80 backdrop-blur-xl border-t border-zinc-200 z-50">
        <button 
          onClick={handlePayment} 
          className="w-full h-18 bg-black text-white rounded-full font-black text-xl flex items-center justify-center gap-4 active:scale-[0.97] transition-all shadow-2xl shadow-black/20"
        >
          <CreditCard className="w-6 h-6" />
          Pay ₹{product.price}
        </button>
      </footer>
    </div>
  )
}

