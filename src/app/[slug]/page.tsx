'use client'

import { useState } from 'react'
import { MapPin, ArrowRight, X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useEffect } from 'react'

export default function BuyerProductPage({ params }: { params: { slug: string } }) {
  const [pincode, setPincode] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'serviceable' | 'unserviceable'>('idle')
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-white">
      <Loader2 className="w-8 h-8 text-uber-green animate-spin" />
    </div>
  )

  if (!product) return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-6 text-center bg-white">
      <h1 className="text-2xl font-black mb-2">Product Not Found</h1>
      <p className="text-zinc-500 mb-6">This link might be broken or the product was removed.</p>
      <Link href="/" className="bg-black text-white px-8 py-4 rounded-xl font-bold">Back to Gully</Link>
    </div>
  )

  return (
    <div className="flex-1 bg-white max-w-[420px] mx-auto w-full min-h-screen flex flex-col pb-32">
      <div className="aspect-[4/5] overflow-hidden relative">
        <img src={product.image_url} className="w-full h-full object-cover" />
        <Link href="/" className="absolute top-6 left-6 w-10 h-10 rounded-full bg-black/20 flex items-center justify-center text-white"><X className="w-5 h-5"/></Link>
      </div>
      <main className="px-6 -mt-10 bg-white rounded-t-[40px] pt-10 flex flex-col gap-8 shadow-2xl relative z-10">
        <h1 className="text-4xl font-black tracking-tighter leading-none text-black">{product.title}</h1>
        <p className="text-5xl font-black text-uber-green tracking-tighter">₹{product.price}</p>
        <div className="bg-zinc-50 p-6 rounded-[32px] border border-zinc-100 shadow-inner">
          <p className="text-[10px] font-black text-black uppercase tracking-widest flex items-center gap-2 mb-5"><MapPin className="w-4 h-4 text-uber-green" /> Check delivery</p>
          <input type="tel" className="w-full p-4 rounded-xl border-2 outline-none focus:border-black" placeholder="6-digit pincode" value={pincode} onChange={e => checkPincode(e.target.value)} />
          {status === 'serviceable' && <p className="mt-4 text-[#06c167] font-bold">✓ Delivers here</p>}
          {status === 'unserviceable' && <p className="mt-4 text-amber-600 font-bold">! Not in delivery area</p>}
        </div>
      </main>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[420px] w-full p-6 bg-white border-t">
        <Link href={`/${params.slug}/checkout`} className="w-full h-16 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2">
          Buy Now <ArrowRight className="w-5 h-5"/>
        </Link>
      </div>
    </div>
  )
}
