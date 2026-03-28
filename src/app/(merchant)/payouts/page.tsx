'use client'

import { useState } from 'react'
import { ArrowLeft, LogOut, Save, Plus, X, Globe, MapPin, Store } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProfilePage() {
  const router = useRouter()
  const [shopName, setShopName] = useState('Gully Store')
  const [upiId, setUpiId] = useState('annas@upi')
  const [pincode, setPincode] = useState('')
  const [selectedPincodes, setSelectedPincodes] = useState<string[]>(['400706', '400705'])
  const [isSaving, setIsSaving] = useState(false)

  const handleAddPincode = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 6)
    setPincode(cleaned)
    if (cleaned.length === 6) {
      if (!selectedPincodes.includes(cleaned)) {
        setSelectedPincodes([...selectedPincodes, cleaned])
        setPincode('')
        toast.success('Pincode added')
      } else {
        toast.error('Already added')
        setPincode('')
      }
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Profile updated!')
    setIsSaving(false)
  }

  return (
    <div className="flex-1 bg-white max-w-[420px] mx-auto w-full min-h-screen flex flex-col font-sans pb-10">
      <header className="p-4 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-30 border-b border-zinc-100">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="w-10 h-10 flex items-center justify-center bg-zinc-50 rounded-xl border border-zinc-100 shadow-sm active:scale-95 transition-all">
            <ArrowLeft className="w-5 h-5 text-black" />
          </Link>
          <h1 className="text-xl font-black tracking-tighter text-black uppercase">Profile</h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-black text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSaving ? <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save
        </button>
      </header>

      <main className="flex-1 p-6 flex flex-col gap-8">
        {/* Shop Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-4 h-4 text-zinc-400" />
            <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Shop Identity</h2>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-black uppercase tracking-wider pl-1">Store Name</label>
              <input 
                type="text" 
                value={shopName} 
                onChange={(e) => setShopName(e.target.value)}
                className="w-full p-4 bg-zinc-50 border border-transparent focus:border-black rounded-xl text-base font-bold outline-none transition-all text-black"
                placeholder="Shop Name"
              />
            </div>
            <div className="flex flex-col gap-1.5 opacity-60">
              <label className="text-[10px] font-bold text-black uppercase tracking-wider pl-1 font-sans">Store Link</label>
              <div className="w-full p-4 bg-zinc-50 rounded-xl text-sm font-medium text-zinc-500 flex items-center gap-2 border border-zinc-100">
                <Globe className="w-4 h-4" />
                gully.app/{shopName.toLowerCase().replace(/\s+/g, '-')}
              </div>
            </div>
          </div>
        </section>

        {/* Payout Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-zinc-400" />
            <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Payments & Logistics</h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-black uppercase tracking-wider pl-1">UPI ID (VPA)</label>
              <input 
                type="text" 
                value={upiId} 
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full p-4 bg-zinc-50 border border-transparent focus:border-black rounded-xl text-base font-bold outline-none transition-all text-uber-green"
                placeholder="name@upi"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold text-black uppercase tracking-wider pl-1">Delivery Pincodes</label>
              <div className="relative">
                <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                <input 
                  type="tel" 
                  value={pincode}
                  onChange={(e) => handleAddPincode(e.target.value)}
                  className="w-full p-4 pl-12 bg-zinc-50 border border-transparent focus:border-black rounded-xl text-base font-bold outline-none transition-all text-black"
                  placeholder="Add 6-digit pincode"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                <AnimatePresence>
                  {selectedPincodes.map(pin => (
                    <motion.div 
                      key={pin}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-black text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold"
                    >
                      {pin}
                      <button onClick={() => setSelectedPincodes(selectedPincodes.filter(p => p !== pin))}>
                        <X className="w-3 h-3 text-white/50 hover:text-white" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        <button onClick={() => router.push('/login')} className="w-full bg-red-50/50 border border-red-100 text-red-500 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 active:scale-[0.98] transition-all mt-4">
          <LogOut className="w-4 h-4" />
          Sign Out from Gully Commerce
        </button>
      </main>
    </div>
  )
}
