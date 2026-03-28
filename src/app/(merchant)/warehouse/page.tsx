'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import * as Tabs from '@radix-ui/react-tabs'
import * as Switch from '@radix-ui/react-switch'
import Link from 'next/link'

export default function WarehousePage() {
  const [products] = useState([
    { id: '1', title: 'Homemade Mango Pickle', price: 250, in_stock: true, image_url: 'https://images.unsplash.com/photo-1594474038222-79352e8d47b5?w=200' }
  ])

  return (
    <div className="flex-1 bg-white max-w-[420px] mx-auto w-full min-h-screen flex flex-col font-sans">
      <header className="p-4 flex items-center gap-3 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <Link href="/dashboard" className="w-10 h-10 flex items-center justify-center bg-zinc-50 rounded-xl border border-zinc-100 shadow-sm">
          <ArrowLeft className="w-5 h-5 text-black" />
        </Link>
        <h1 className="text-xl font-black tracking-tighter text-black">Warehouse</h1>
      </header>
      <Tabs.Root defaultValue="products" className="flex-1 flex flex-col">
        <Tabs.List className="flex px-4 border-b border-zinc-100 bg-zinc-50/50">
          <Tabs.Trigger value="products" className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 data-[state=active]:border-black data-[state=active]:text-black border-b-2 border-transparent">Products</Tabs.Trigger>
          <Tabs.Trigger value="leads" className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 data-[state=active]:border-black data-[state=active]:text-black border-b-2 border-transparent">Leads</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="products" className="flex-1 p-4 flex flex-col gap-3">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-xl border p-3 flex gap-3">
              <img src={p.image_url} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs truncate">{p.title}</h3>
                <p className="text-uber-green font-bold text-xs mb-1">₹{p.price}</p>
                <Switch.Root checked={p.in_stock} className={`w-8 h-5 rounded-full relative transition-colors ${p.in_stock ? 'bg-[#06c167]' : 'bg-zinc-300'}`}>
                  <Switch.Thumb className={`block w-3 h-3 bg-white rounded-full transition-transform translate-x-1 ${p.in_stock ? 'translate-x-4' : ''}`} />
                </Switch.Root>
              </div>
            </div>
          ))}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
