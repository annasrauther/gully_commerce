'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Camera } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'

export default function CreateListingPage() {
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [isMagicLoading, setIsMagicLoading] = useState(false)
  const [templateIndex, setTemplateIndex] = useState(0)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { setLoading } = useStore()

  const handleMagicGenerate = () => {
    // High-quality templates that utilize both title and price
    const templates = [
      `✨ ${title} is finally here! Get this premium quality pick for just ₹${price}. High quality guaranteed and ready for your home. Order now! 🚚`,
      `Upgrade your lifestyle with our ${title}. 🌟 Available now at a special price of ₹${price}. Perfect for daily use or as a special gift. 🛍️`,
      `The best ${title} in the market at an unbeatable ₹${price}! 💎 Freshly sourced and ready for delivery. Tap to buy before it sells out! 👆`,
      `Looking for ${title}? 📦 We've got you covered! High-quality ${title} at just ₹${price}. Limited stock available, grab yours today! ✨`,
      `Fresh & Premium ${title} ready for your doorstep. 🌿 Exceptional quality for only ₹${price}. Shop with Gully Commerce now! 🚀`
    ]

    setIsMagicLoading(true)
    setTimeout(() => {
      setDescription(templates[templateIndex])
      setTemplateIndex((prev) => (prev + 1) % templates.length)
      setIsMagicLoading(false)
    }, 800)
  }

  // Removed auto-generation logic to prioritize manual entry as requested

  const handleListNow = async () => {
    if (!title || !price || !imageFile) {
      toast.error('Details missing')
      return
    }
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // 1. Upload Image
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile)

      if (uploadError) throw uploadError

      const imageUrl = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName).data.publicUrl

      // 2. Save Product
      const { error: pError } = await supabase
        .from('products')
        .insert({
          merchant_id: user.id,
          title: title.trim(),
          description: description.trim(),
          price: parseFloat(price),
          image_url: imageUrl,
          in_stock: true
        } as any)

      if (pError) throw pError

      toast.success('Listed successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to list product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 bg-white max-w-[420px] mx-auto w-full min-h-screen flex flex-col pb-32 font-sans">
      <header className="p-6 flex items-center gap-4 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <Link href="/dashboard" className="w-12 h-12 flex items-center justify-center -ml-3 bg-zinc-50 rounded-2xl border border-zinc-100 shadow-sm">
          <ArrowLeft className="w-6 h-6 text-black" />
        </Link>
        <h1 className="text-xl font-black tracking-tighter text-black uppercase">Gully Commerce</h1>
      </header>
      <main className="p-6 flex flex-col gap-8">
        <div onClick={() => fileInputRef.current?.click()} className="aspect-[3/2] bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-2 overflow-hidden relative shadow-inner">
          {image ? <img src={image} className="w-full h-full object-cover" /> : <><Camera className="w-8 h-8 text-black" /><p className="font-black text-black uppercase tracking-widest text-[10px]">Tap to upload</p></>}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              setImageFile(file)
              const reader = new FileReader()
              reader.onload = (ev) => setImage(ev.target?.result as string)
              reader.readAsDataURL(file)
            }
          }} />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-1">Product Title</p>
            <input type="text" placeholder="What are you selling?" className="w-full bg-white border-2 border-zinc-100 focus:border-black outline-none px-5 py-4 rounded-xl text-lg font-bold transition-all placeholder:text-zinc-500 text-black tracking-tight" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-1">Price (₹)</p>
            <input type="number" placeholder="Enter amount" className="w-full bg-white border-2 border-zinc-100 focus:border-black outline-none px-5 py-4 rounded-xl text-lg font-bold transition-all placeholder:text-zinc-500 text-black" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1 min-h-[20px]">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Description</p>
              <AnimatePresence>
                {title && price && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={handleMagicGenerate}
                    disabled={isMagicLoading}
                    className="flex items-center gap-1.5 text-uber-green font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isMagicLoading ? (
                      <span className="w-3 h-3 border-2 border-uber-green/20 border-t-uber-green rounded-full animate-spin" />
                    ) : (
                      <span className="text-lg leading-none">✨</span>
                    )}
                    {description ? 'Regenerate' : 'Magic Generate'}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            <textarea placeholder="Tell your customers about it..." rows={4} className="w-full bg-white border-2 border-zinc-100 focus:border-black outline-none px-5 py-4 rounded-xl text-lg font-semibold transition-all placeholder:text-zinc-500 text-black resize-none leading-snug" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>


          <AnimatePresence>
            {showPreview && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-3 py-2">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-2">Real-time Preview</p>
                <div className="relative bg-[#E5DDD5] p-6 rounded-[32px] overflow-hidden min-h-[300px] flex flex-col justify-start border border-zinc-200">
                  {/* WhatsApp Doodle Pattern */}
                  <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat" />
                  
                  <div className="relative self-start max-w-[85%] bg-white pt-1.5 px-1.5 pb-1 rounded-lg rounded-tl-none shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] flex flex-col min-w-[240px]">
                    {/* Tail */}
                    <svg className="absolute -left-[8px] top-0 text-white" width="8" height="13" viewBox="0 0 8 13">
                      <path fill="currentColor" d="M1.533 3.568 8 0v13L1.533 3.568Z" />
                    </svg>

                    {/* Rich Link Preview Box */}
                    <div className="bg-[#f0f2f5] rounded-md overflow-hidden flex flex-col mb-1.5">
                      {image && (
                        <div className="w-full aspect-[1.91/1] overflow-hidden border-b border-zinc-200">
                          <img src={image} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-3 bg-[#f0f2f5]">
                        <p className="text-[14px] font-semibold text-[#111b21] leading-tight truncate">{title || 'Product Title'}</p>
                        <p className="text-[12px] text-[#667781] mt-0.5">gully.app</p>
                      </div>
                    </div>
                    
                    <div className="px-2 pt-0.5 pb-5 leading-normal">
                      <p className="text-[14.2px] text-[#111b21] font-system leading-[19px] whitespace-pre-wrap">
                        {`Check this out on Gully Commerce!\n\n🛍️ *${title || 'Product Title'}*\n💰 *₹${price || '0'}*\n\n${description || 'No description'}\n\nhttps://gully.app/store/${(title || 'item').toLowerCase().replace(/\s+/g, '-')}`}
                      </p>
                    </div>

                    {/* Meta info */}
                    <div className="absolute bottom-1 right-1.5 flex items-center gap-1 opacity-60">
                      <span className="text-[11px] text-[#667781]">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <svg viewBox="0 0 16 11" width="16" height="11" className="text-[#8696a0]"><path fill="currentColor" d="M11.053 1.514 5.446 8.679 2.157 5.512l-.841.77 4.12 3.96 6.467-8.253-.85-.475Zm3.407 0-6.466 8.253.001.002.85.474 6.466-8.253-.851-.476Z"/></svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[420px] w-full p-6 bg-white border-t border-zinc-50 shadow-2xl z-40">
        {!showPreview ? (
          <button 
            onClick={() => {
              if(!title || !price || !image) {
                toast.error('Complete all fields first')
                return
              }
              setShowPreview(true)
            }}
            className="w-full bg-black text-white h-16 rounded-2xl font-black text-lg active:scale-[0.98] transition-all shadow-xl shadow-black/20"
          >
            Show Preview
          </button>
        ) : (
          <div className="flex gap-4">
            <button 
              onClick={() => setShowPreview(false)}
              className="px-8 bg-zinc-50 text-black h-16 rounded-2xl font-black active:scale-[0.98] transition-all border border-zinc-200"
            >
              Edit
            </button>
            <button 
              onClick={handleListNow} 
              className="flex-1 bg-black text-white h-16 rounded-2xl font-black text-lg active:scale-[0.98] transition-all shadow-xl shadow-black/20"
            >
              List Now
            </button>
          </div>
        )}
      </footer>
    </div>
  )
}
