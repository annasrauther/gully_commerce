'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Share2, User } from 'lucide-react'
import { useStore } from '@/lib/store'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import * as Switch from '@radix-ui/react-switch'

export default function DashboardPage() {
  const { merchant } = useStore()
  const [products] = useState([
    { id: '1', title: 'Homemade Mango Pickle', price: 250, in_stock: true, image_url: 'https://images.unsplash.com/photo-1594474038222-79352e8d47b5?w=500' },
    { id: '2', title: 'Local Honey (Raw)', price: 450, in_stock: true, image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500' }
  ])

  const handleShare = async () => {
    const url = `https://gully.app/${merchant?.store_slug || 'demo'}`
    if (navigator.share) {
      await navigator.share({ title: 'Gully Store', url })
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Link copied!')
    }
  }

  return (
    <div className="flex-1 bg-white max-w-[420px] mx-auto w-full min-h-screen flex flex-col font-sans">
      <header className="p-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg shadow-black/10">
            <img src="/logo.png" className="w-5 h-5 invert" alt="Gully" />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-black uppercase">Gully Commerce</h1>
        </div>
        <Link href="/payouts" className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center overflow-hidden border border-zinc-100 shadow-sm active:scale-90 transition-all">
          <User className="w-5 h-5 text-black" />
        </Link>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-6 pb-24">
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 bg-zinc-50 rounded-xl flex flex-col gap-1 border border-zinc-100">
            <span className="text-[8px] font-black text-black/40 uppercase tracking-widest leading-none mb-1">Today</span>
            <span className="text-lg font-black text-uber-green">₹1,240</span>
          </div>
          <div className="p-3 bg-zinc-50 rounded-xl flex flex-col gap-1 border border-zinc-100">
            <span className="text-[8px] font-black text-black/40 uppercase tracking-widest leading-none mb-1">Orders</span>
            <span className="text-lg font-black text-black">5</span>
          </div>
          <div className="p-3 bg-zinc-50 rounded-xl flex flex-col gap-1 border border-zinc-100">
            <span className="text-[8px] font-black text-black/40 uppercase tracking-widest leading-none mb-1">Visitors</span>
            <span className="text-lg font-black text-black">342</span>
          </div>
        </div>

        <Link href="/create" className="w-full bg-black text-white h-14 rounded-xl flex items-center justify-center gap-3 font-bold text-base active:scale-95 transition-all shadow-lg shadow-black/10">
          <Plus className="w-5 h-5" />
          New Listing
        </Link>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-black">Recent Listings</h2>
            <Link href="/warehouse" className="text-[10px] font-black text-uber-green uppercase tracking-widest">View All</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {products.map((p, idx) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="flex flex-col gap-2">
                <div className="aspect-square bg-zinc-50 rounded-xl overflow-hidden relative border border-zinc-100">
                  <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-1.5 right-1.5">
                    <Switch.Root checked={p.in_stock} className={`w-8 h-5 rounded-full relative transition-colors ${p.in_stock ? 'bg-[#06c167]' : 'bg-zinc-300'}`}>
                      <Switch.Thumb className={`block w-3 h-3 bg-white rounded-full transition-transform translate-x-1 ${p.in_stock ? 'translate-x-4' : ''}`} />
                    </Switch.Root>
                  </div>
                </div>
                <h3 className="font-bold text-[12px] truncate px-1">{p.title}</h3>
                <p className="text-[#06c167] font-bold text-[12px] px-1">₹{p.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
