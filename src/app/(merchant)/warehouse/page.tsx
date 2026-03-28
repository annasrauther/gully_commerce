'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Share2 } from 'lucide-react'
import * as Tabs from '@radix-ui/react-tabs'
import * as Switch from '@radix-ui/react-switch'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

export default function WarehousePage() {
  const { user, isLoaded } = useUser()
  const [products, setProducts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [host, setHost] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHost(window.location.host)
    }
  }, [])

  const copyProductLink = (p: any) => {
    const url = `${window.location.protocol}//${host}/${p.id}`
    navigator.clipboard.writeText(url)
    toast.success('Link copied!')
  }

  useEffect(() => {
    if (user) {
      const fetchProducts = async () => {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('merchant_id', user.id)
          .order('created_at', { ascending: false })
        setProducts(data || [])
      }
      fetchProducts()
    }
  }, [user])

  if (!isLoaded || !user) return null

  return (
    <div className="flex-1 bg-white max-w-[420px] mx-auto w-full min-h-screen flex flex-col font-sans">
      <header className="px-6 py-6 flex items-center gap-4 sticky top-0 bg-white/90 backdrop-blur-xl z-30 border-b border-zinc-200">
        <Link href="/dashboard" className="w-12 h-12 flex items-center justify-center bg-white rounded-full border border-zinc-200 shadow-sm transition-all active:scale-90 group">
          <ArrowLeft className="w-6 h-6 text-black group-hover:-translate-x-1 transition-transform" />
        </Link>
        <h1 className="text-xl font-black tracking-tighter text-black uppercase">Gully Commerce</h1>
      </header>
      <Tabs.Root defaultValue="products" className="flex-1 flex flex-col">
        <Tabs.List className="flex px-6 border-b border-zinc-200 bg-white">
          <Tabs.Trigger value="products" className="flex-1 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 data-[state=active]:border-black data-[state=active]:text-black border-b-[3px] border-transparent transition-all">Products</Tabs.Trigger>
          <Tabs.Trigger value="leads" className="flex-1 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 data-[state=active]:border-black data-[state=active]:text-black border-b-[3px] border-transparent transition-all">Leads</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="products" className="flex-1 p-4 flex flex-col gap-3">
          {products.length > 0 ? products.map(p => (
            <div
              key={p.id}
              className="bg-white rounded-[24px] border border-zinc-200 p-4 flex gap-4 cursor-pointer active:scale-[0.98] transition-all shadow-sm group"
              onClick={() => setSelectedProduct(p)}
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="font-black text-[15px] tracking-tight text-black truncate">{p.title}</h3>
                <p className="text-uber-green font-black text-sm mb-2">₹{p.price}</p>
                <div onClick={(e) => e.stopPropagation()}>
                  <Switch.Root checked={p.in_stock} className={`w-9 h-5.5 rounded-full relative transition-colors ${p.in_stock ? 'bg-uber-green' : 'bg-zinc-300'}`}>
                    <Switch.Thumb className={`block w-4 h-4 bg-white rounded-full transition-transform translate-x-1 ${p.in_stock ? 'translate-x-[18px]' : ''}`} />
                  </Switch.Root>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <p className="text-zinc-400 font-medium">No products in warehouse</p>
              <Link href="/create" className="text-black font-bold border-b-2 border-black pb-1">Add Something</Link>
            </div>
          )}
        </Tabs.Content>
        <Tabs.Content value="leads" className="flex-1 p-4 text-center py-20">
          <p className="text-zinc-400 font-medium tracking-tight">No active leads found</p>
        </Tabs.Content>
      </Tabs.Root>

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
                  className="w-full bg-black text-white h-14 rounded-2xl font-black text-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  Copy Link
                </button>
                <div className="flex gap-3">
                  <Link 
                    href={`/${selectedProduct.id}`}
                    target="_blank"
                    className="flex-1 bg-zinc-50 text-black h-14 rounded-2xl font-black text-sm flex items-center justify-center gap-3 border border-zinc-100 active:scale-[0.98] transition-all"
                  >
                    View Page
                  </Link>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="flex-1 bg-zinc-50 text-black h-14 rounded-2xl font-black text-sm active:scale-[0.98] transition-all"
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
