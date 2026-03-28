'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

export default function CheckoutPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' })

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from('products')
        .select('*, merchants(*)')
        .eq('id', params.slug)
        .single()
      if (data) setProduct(data)
      setLoading(false)
    }
    fetchProduct()
  }, [params.slug])

  const handlePayment = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('Please fill all fields')
      return
    }

    try {
      // Create Order / Lead
      const { error } = await supabase.from('orders').insert({
        product_id: product.id,
        merchant_id: product.merchant_id,
        buyer_phone: formData.phone,
        buyer_address: formData.address,
        status: 'pending'
      } as any)

      if (error) throw error

      toast.success('Opening UPI...')
      const upiUrl = `upi://pay?pa=${product.merchants.upi_id}&pn=${encodeURIComponent(product.merchants.name)}&am=${product.price}&tn=${encodeURIComponent(product.title)}`
      window.location.href = upiUrl
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  if (loading) return <div className="flex-1 flex items-center justify-center min-h-screen bg-zinc-50 font-black uppercase text-[10px] tracking-widest text-zinc-400">Loading Checkout...</div>

  return (
    <div className="flex-1 bg-zinc-50 max-w-[420px] mx-auto w-full min-h-screen flex flex-col font-sans">
      <header className="p-4 bg-white border-b border-zinc-100 flex items-center gap-3 sticky top-0 z-30">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-zinc-50 rounded-xl border border-zinc-100 shadow-sm active:scale-90 transition-all">
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
        <h1 className="text-xl font-black tracking-tighter text-black">Checkout</h1>
      </header>
      <main className="p-4 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-2xl border border-zinc-100 mb-2 flex items-center gap-4 shadow-sm">
          <img src={product.image_url} className="w-16 h-16 rounded-xl object-cover" />
          <div>
            <p className="font-black text-black tracking-tight">{product.title}</p>
            <p className="font-bold text-uber-green">₹{product.price}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="Full Name" 
            className="w-full p-4 bg-white border border-zinc-100 rounded-xl text-base font-bold outline-none focus:border-black transition-all placeholder:text-zinc-400 text-black shadow-sm"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="tel" 
            placeholder="Phone Number" 
            className="w-full p-4 bg-white border border-zinc-100 rounded-xl text-base font-bold outline-none focus:border-black transition-all placeholder:text-zinc-400 text-black shadow-sm"
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
          />
          <textarea 
            placeholder="Delivery Address" 
            className="w-full p-4 bg-white border border-zinc-100 rounded-xl text-base font-bold outline-none focus:border-black transition-all placeholder:text-zinc-400 text-black shadow-sm" 
            rows={2}
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})}
          />
        </div>
      </main>
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[420px] w-full p-4 bg-white border-t">
        <button onClick={handlePayment} className="w-full h-14 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-black/10">
          <CreditCard className="w-5 h-5" />
          Pay ₹{product.price} via UPI
        </button>
      </footer>
    </div>
  )
}
