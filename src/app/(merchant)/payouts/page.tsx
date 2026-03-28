'use client'

import { useUser, useClerk } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { ArrowLeft, LogOut, Save, Plus, X, Globe, MapPin, Store } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [shopName, setShopName] = useState('')
  const [upiId, setUpiId] = useState('')
  const [pincode, setPincode] = useState('')
  const [selectedPincodes, setSelectedPincodes] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [host, setHost] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHost(window.location.host)
    }
  }, [])

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login')
      return
    }

    if (user) {
      const fetchProfile = async () => {
        const { data: merchant }: any = await supabase
          .from('merchants')
          .select('*')
          .eq('id', user.id)
          .single()

        if (merchant) {
          setShopName(merchant.name || '')
          setUpiId(merchant.upi_id || '')
        }

        const { data: pincodes }: any = await supabase
          .from('service_pincodes')
          .select('pincode')
          .eq('merchant_id', user.id)

        if (pincodes) {
          setSelectedPincodes(pincodes.map((p: any) => p.pincode))
        }
      }
      fetchProfile()
    }
  }, [isLoaded, user, router])

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
    if (!user) return
    setIsSaving(true)
    try {
      // 1. Update Merchant
      const { error: mError } = await (supabase
        .from('merchants') as any)
        .update({
          name: shopName.trim(),
          upi_id: upiId.trim(),
          store_slug: shopName.toLowerCase().trim().replace(/\s+/g, '-')
        })
        .eq('id', user.id)

      if (mError) throw mError

      // 2. Update Pincodes
      await (supabase.from('service_pincodes') as any).delete().eq('merchant_id', user.id)
      const { error: pError } = await (supabase
        .from('service_pincodes') as any)
        .insert(selectedPincodes.map(p => ({ merchant_id: user.id, pincode: p })))

      if (pError) throw pError

      toast.success('Profile Updated!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  if (!isLoaded || !user) return null

  return (
    <div className="flex-1 bg-white max-w-[420px] mx-auto w-full min-h-screen flex flex-col font-sans pb-10">
      <header className="px-6 py-6 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xl z-30 border-b border-zinc-300">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="w-12 h-12 flex items-center justify-center bg-white rounded-full border border-zinc-300 transition-all active:scale-95 group">
            <ArrowLeft className="w-6 h-6 text-black group-hover:-translate-x-1 transition-transform" />
          </Link>
          <h1 className="text-xl font-black tracking-[-0.05em] text-black uppercase">Profile</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-black text-white px-6 py-3 rounded-full text-sm font-black flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50 shadow-2xl shadow-black/20"
        >
          {isSaving ? <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </header>

      <main className="flex-1 p-6 flex flex-col gap-8">
        {/* Shop Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-4 h-4 text-zinc-400" strokeWidth={2.5} />
            <h2 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Shop Identity</h2>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-black uppercase tracking-wider pl-1 font-sans">Store Name</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full h-18 px-6 bg-white border-2 border-zinc-200 focus:border-black rounded-2xl text-lg font-black outline-none transition-all text-black shadow-sm placeholder:text-zinc-400"
                placeholder="Shop Name"
              />
            </div>
            <div className="flex flex-col gap-1.5 opacity-60">
              <label className="text-[10px] font-black text-black uppercase tracking-wider pl-1 font-sans">Store Link</label>
              <div className="w-full h-16 px-6 bg-zinc-50 rounded-2xl text-sm font-black text-zinc-600 flex items-center gap-2 border border-zinc-200">
                <Globe className="w-4 h-4" strokeWidth={2.5} />
                {host}/{shopName.toLowerCase().replace(/\s+/g, '-')}
              </div>
            </div>
          </div>
        </section>

        {/* Payout Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-zinc-400" strokeWidth={2.5} />
            <h2 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Payments & Logistics</h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-black uppercase tracking-wider pl-1">UPI ID (VPA)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full h-18 px-6 bg-white border-2 border-zinc-200 focus:border-black rounded-2xl text-lg font-black outline-none transition-all text-uber-green shadow-sm placeholder:text-zinc-400"
                placeholder="name@upi"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-black uppercase tracking-wider pl-1">Delivery Pincodes</label>
              <div className="relative">
                <Plus className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-black" strokeWidth={2.5} />
                <input
                  type="tel"
                  value={pincode}
                  onChange={(e) => handleAddPincode(e.target.value)}
                  className="w-full h-18 px-6 pl-14 bg-white border-2 border-zinc-200 focus:border-black rounded-2xl text-lg font-black outline-none transition-all text-black shadow-sm placeholder:text-zinc-400"
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
                      className="bg-black text-white pl-4 pr-1.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-black shadow-md border border-white/10"
                    >
                      <span className="tracking-widest">{pin}</span>
                      <button onClick={() => setSelectedPincodes(selectedPincodes.filter(p => p !== pin))} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        <button onClick={handleSignOut} className="w-full bg-red-50 text-red-600 h-16 rounded-2xl font-black text-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-all mt-4 border border-red-100 shadow-xl shadow-red-500/5">
          <LogOut className="w-5 h-5" strokeWidth={2.5} />
          Sign Out
        </button>
      </main>
    </div>
  )
}
