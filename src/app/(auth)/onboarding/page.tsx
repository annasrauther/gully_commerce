'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, MapPin, ChevronLeft, Plus } from 'lucide-react'
import { useStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

enum OnboardingStep {
  SHOP_NAME,
  PINCODES
}

export default function OnboardingPage() {
  const [step, setStep] = useState(OnboardingStep.SHOP_NAME)
  const [shopName, setShopName] = useState('')
  const [pincode, setPincode] = useState('')
  const [selectedPincodes, setSelectedPincodes] = useState<string[]>([])
  
  const router = useRouter()
  const { setLoading } = useStore()

  const handlePincodeChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 6)
    setPincode(cleaned)
    
    if (cleaned.length === 6) {
      if (selectedPincodes.includes(cleaned)) {
        toast.error('Already added')
        setPincode('')
      } else {
        setSelectedPincodes([...selectedPincodes, cleaned])
        setPincode('')
        toast.success(`Added ${cleaned}`)
      }
    }
  }

  const removePincode = (code: string) => {
    setSelectedPincodes(selectedPincodes.filter(p => p !== code))
  }

  const handleNextStep = () => {
    if (step === OnboardingStep.SHOP_NAME) {
      if (shopName.trim().length < 3) {
        toast.error('Store name too short')
        return
      }
      setStep(OnboardingStep.PINCODES)
    }
  }

  const handleSubmit = async () => {
    if (selectedPincodes.length === 0) return
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No active session')

      const slug = shopName.toLowerCase().trim().replace(/\s+/g, '-')

      // 1. Update Merchant Profile
      const { error: mError } = await (supabase
        .from('merchants') as any)
        .upsert({
          id: user.id,
          phone: user.user_metadata?.phone || '',
          name: shopName.trim(),
          store_slug: slug
        })

      if (mError) throw mError

      // 2. Insert Pincodes
      const pincodeData = selectedPincodes.map(pin => ({
        merchant_id: user.id,
        pincode: pin
      }))

      const { error: pError } = await (supabase
        .from('service_pincodes') as any)
        .insert(pincodeData)

      if (pError) throw pError

      toast.success('Store setup complete!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Onboarding failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-white max-w-[420px] mx-auto w-full h-screen overflow-hidden">
      <div className="p-6 pt-10 flex-1 flex flex-col h-full">
        <header className="mb-8">
          <button 
            onClick={() => step === OnboardingStep.SHOP_NAME ? router.push('/login') : setStep(OnboardingStep.SHOP_NAME)} 
            className="w-10 h-10 flex items-center justify-center mb-6 bg-zinc-50 rounded-xl border border-zinc-100 shadow-sm transition-all active:scale-90"
          >
            <ChevronLeft className="w-5 h-5 text-black" />
          </button>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1">
            {step === OnboardingStep.SHOP_NAME ? "Store Identity" : "Logistics"}
          </p>
          <h1 className="text-3xl font-black tracking-tighter mb-2 text-black leading-tight">
            {step === OnboardingStep.SHOP_NAME ? "What's your\nshop called?" : "Where do you\ndeliver?"}
          </h1>
        </header>

        <AnimatePresence mode="wait">
          {step === OnboardingStep.SHOP_NAME ? (
            <motion.div 
              key="shop" 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6"
            >
              <input 
                type="text"
                placeholder="Shop Name"
                className="w-full bg-zinc-50 border-2 border-transparent focus:border-black outline-none py-5 px-6 rounded-xl text-2xl font-black transition-all placeholder:text-zinc-400 text-black"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                autoFocus
              />
              <p className="text-zinc-400 text-xs font-medium px-1">
                gully.app/<span className="text-black font-bold">{shopName.toLowerCase().replace(/\s+/g, '-') || 'your-store'}</span>
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="pincodes" 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              <div className="relative mb-6">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black">
                  <Plus className="w-5 h-5" />
                </div>
                <input 
                  type="tel"
                  placeholder="Enter 6-digit pincode"
                  className="w-full bg-zinc-50 border-2 border-transparent focus:border-black outline-none py-5 pl-12 pr-4 rounded-xl text-lg font-bold transition-all placeholder:text-zinc-400 text-black shadow-inner"
                  value={pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {selectedPincodes.map((code) => {
                    return (
                      <motion.div
                        key={code}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-black text-white pr-2 pl-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold shadow-sm"
                      >
                        <span>{code}</span>
                        <button onClick={() => removePincode(code)} className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto pt-6 pb-6">
          <button
            onClick={step === OnboardingStep.SHOP_NAME ? handleNextStep : handleSubmit}
            disabled={step === OnboardingStep.SHOP_NAME ? shopName.length < 3 : selectedPincodes.length === 0}
            className={`w-full h-15 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
              (step === OnboardingStep.SHOP_NAME ? shopName.length >= 3 : selectedPincodes.length > 0) 
              ? 'bg-black text-white shadow-xl shadow-black/10' 
              : 'bg-zinc-50 text-zinc-400'
            }`}
          >
            {step === OnboardingStep.SHOP_NAME ? 'Continue' : 'Start Selling'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
