'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Share2, User, Store } from 'lucide-react'
import { useStore } from '@/lib/store'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import * as Switch from '@radix-ui/react-switch'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const { setLoading } = useStore()
  const [merchant, setMerchant] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [stats, setStats] = useState({ today: 0, orders: 0, visitors: 0 })
  const [host, setHost] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHost(window.location.host)
    }
  }, [])

  useEffect(() => {
    if (isLoaded && !user) {
      window.location.href = '/login'
      return
    }

    if (user) {
      const fetchData = async () => {
        setLoading(true)
        try {
          const { data: m } = await supabase.from('merchants').select('*').eq('id', user.id).single()
          if (!m) {
            window.location.href = '/onboarding'
            return
          }
          setMerchant(m)

          const { data: p } = await supabase.from('products').select('*').eq('merchant_id', user.id).order('created_at', { ascending: false })
          setProducts(p || [])

          // Mock stats for now
          setStats({ today: 1240, orders: 5, visitors: 342 })
        } catch (err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [isLoaded, user])

  const handleShare = async () => {
    const url = `https://${host}/${merchant?.store_slug || 'demo'}`
    if (navigator.share) {
      await navigator.share({ title: 'Gully Store', url })
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Link copied!')
    }
  }

  const copyProductLink = (p: any) => {
    const url = `${window.location.protocol}//${host}/${p.id}`
    navigator.clipboard.writeText(url)
    toast.success('Link copied!')
  }

  if (!isLoaded || !user) return null

  return (
    <div className="flex-1 bg-white max-w-[420px] mx-auto w-full min-h-screen flex flex-col font-sans">
      <header className="px-6 py-6 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xl z-30 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black tracking-tighter text-black uppercase">Gully Commerce</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleShare} 
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-zinc-200 shadow-sm active:scale-90 transition-all group"
          >
            <Share2 className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
          </button>
          <Link 
            href="/payouts" 
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border border-zinc-200 shadow-sm active:scale-90 transition-all group"
          >
            <User className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-6 pb-24">
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 bg-white rounded-2xl flex flex-col gap-1 border border-zinc-200 shadow-sm">
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] leading-none mb-1">Today</span>
            <span className="text-xl font-black text-uber-green tracking-tight">₹{stats.today}</span>
          </div>
          <div className="p-4 bg-white rounded-2xl flex flex-col gap-1 border border-zinc-200 shadow-sm">
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] leading-none mb-1">Orders</span>
            <span className="text-xl font-black text-black tracking-tight">{stats.orders}</span>
          </div>
          <div className="p-4 bg-white rounded-2xl flex flex-col gap-1 border border-zinc-200 shadow-sm">
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] leading-none mb-1">Visitors</span>
            <span className="text-xl font-black text-black tracking-tight">{stats.visitors}</span>
          </div>
        </div>

        <Link href="/create" className="w-full bg-black text-white h-16 rounded-2xl flex items-center justify-center gap-3 font-black text-lg active:scale-95 transition-all shadow-xl shadow-black/20">
          <Plus className="w-6 h-6" />
          List Item
        </Link>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-black">Recent Listings</h2>
            <Link href="/warehouse" className="text-[10px] font-black text-uber-green">View All</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {products.length > 0 ? products.map((p, idx) => (
              <motion.div 
                key={p.id} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.05 }} 
                className="flex flex-col gap-2 cursor-pointer active:scale-95 transition-all"
                onClick={() => setSelectedProduct(p)}
              >
                <div className="aspect-square bg-white rounded-2xl overflow-hidden relative border border-zinc-200 shadow-sm">
                  <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
                    <Switch.Root checked={p.in_stock} className={`w-9 h-5.5 rounded-full relative transition-colors ${p.in_stock ? 'bg-uber-green' : 'bg-zinc-300'}`}>
                      <Switch.Thumb className={`block w-4 h-4 bg-white rounded-full transition-transform translate-x-1 ${p.in_stock ? 'translate-x-[18px]' : ''}`} />
                    </Switch.Root>
                  </div>
                </div>
                <h3 className="font-black text-[13px] tracking-tight text-black truncate px-1 mt-1">{p.title}</h3>
                <p className="text-uber-green font-black text-[13px] px-1">₹{p.price}</p>
              </motion.div>
            )) : (
            <div className="col-span-2 py-20 text-center flex flex-col items-center gap-6 bg-zinc-50 rounded-[32px] border border-zinc-200 shadow-inner">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-zinc-100 shadow-sm">
                <Store className="w-8 h-8 text-black/20" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-zinc-600 font-black text-lg">No Listings Yet</p>
                <p className="text-zinc-400 text-sm font-medium">Ready to start selling? Create your first product page.</p>
              </div>
              <Link href="/create" className="px-10 bg-black text-white h-16 rounded-full font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-black/20">
                <Plus className="w-6 h-6" />
                List First Item
              </Link>
            </div>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[420px] w-full bg-white rounded-t-[32px] p-6 z-50 flex flex-col gap-6 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mb-2" />
              <div className="flex gap-4 items-start">
                <img src={selectedProduct.image_url} className="w-24 h-24 rounded-2xl object-cover shadow-lg" />
                <div className="flex-1 pt-1">
                  <h2 className="text-xl font-black tracking-tight text-black">{selectedProduct.title}</h2>
                  <p className="text-uber-green font-black text-lg">₹{selectedProduct.price}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => copyProductLink(selectedProduct)}
                  className="w-full bg-black text-white h-14 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  Copy Link
                </button>
                <div className="flex gap-3">
                  <Link 
                    href={`/${selectedProduct.id}`}
                    target="_blank"
                    className="flex-1 bg-zinc-50 text-black h-14 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 border border-zinc-100 active:scale-[0.98] transition-all"
                  >
                    View Page
                  </Link>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="flex-1 bg-zinc-50 text-black h-14 rounded-2xl font-bold text-sm active:scale-[0.98] transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
