'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
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
  const { user, isLoaded } = useUser()
  const [step, setStep] = useState(OnboardingStep.SHOP_NAME)
  const [shopName, setShopName] = useState('')
  const [pincode, setPincode] = useState('')
  const [selectedPincodes, setSelectedPincodes] = useState<string[]>([])
  const [host, setHost] = useState('')
  
  const router = useRouter()
  const { setLoading } = useStore()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHost(window.location.host)
    }
  }, [])

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login')
    }
    if (user) {
      const checkProfile = async () => {
        const { data: m } = await supabase.from('merchants').select('id').eq('id', user.id).single()
        if (m) {
          router.push('/dashboard')
        }
      }
      checkProfile()
    }
  }, [isLoaded, user, router])

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
    if (selectedPincodes.length === 0 || !user) return
    setLoading(true)
    try {
      const slug = shopName.toLowerCase().trim().replace(/\s+/g, '-')
      const phone = user.primaryPhoneNumber?.phoneNumber || ''

      // 1. Update Merchant Profile (Clerk ID is used as the primary identifier)
      const { error: mError } = await (supabase
        .from('merchants') as any)
        .upsert({
          id: user.id,
          phone: phone,
          name: shopName.trim(),
          store_slug: slug
        })

      if (mError) throw mError

      // 2. Insert Pincodes
      const pincodeData = selectedPincodes.map(pin => ({
        merchant_id: user.id,
        pincode: pin
      }))

      // Clear existing pincodes first for this merchant to avoid duplicates/stale data if re-onboarding
      await (supabase
        .from('service_pincodes') as any)
        .delete()
        .eq('merchant_id', user.id)

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
    <div className="flex-1 flex flex-col bg-white max-w-[420px] mx-auto w-full h-screen overflow-hidden font-sans">
      <div className="flex-1 flex flex-col h-full relative">
        {/* Uber Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-zinc-100 z-50">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: step === OnboardingStep.SHOP_NAME ? '50%' : '100%' }}
            className="h-full bg-black"
          />
        </div>

        <div className="p-6 pt-12 flex-1 flex flex-col h-full">
          <header className="mb-8">
            <button 
              onClick={() => step === OnboardingStep.SHOP_NAME ? router.push('/login') : setStep(OnboardingStep.SHOP_NAME)} 
              className="w-12 h-12 flex items-center justify-center mb-10 bg-white rounded-full border border-zinc-200 shadow-sm transition-all active:scale-90"
            >
              <ChevronLeft className="w-6 h-6 text-black" />
            </button>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] pl-1 mb-1">
              {step === OnboardingStep.SHOP_NAME ? "Store Identity" : "Logistics"}
            </p>
            <h1 className="text-[34px] font-black tracking-[-0.05em] mb-2 text-black leading-[1.1]">
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
              <div className="flex flex-col gap-2">
                <input 
                  type="text"
                  placeholder="Enter Store Name"
                  className="w-full h-18 bg-white border-2 border-zinc-200 focus:border-black outline-none px-6 rounded-2xl text-2xl font-black transition-all placeholder:text-zinc-400 text-black tracking-tighter"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  autoFocus
                />
                <p className="text-zinc-600 text-xs font-bold px-1 mt-1">
                  gully.app/<span className="text-black font-black">{shopName.toLowerCase().replace(/\s+/g, '-') || 'your-store'}</span>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="pincodes" 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              <div className="relative mb-6">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-black">
                  <Plus className="w-5 h-5" />
                </div>
                <input 
                  type="tel"
                  placeholder="Enter 6-digit pincode"
                  className="w-full h-18 bg-white border-2 border-zinc-200 focus:border-black outline-none pl-14 pr-6 rounded-2xl text-lg font-black transition-all placeholder:text-zinc-400 text-black shadow-sm"
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
                        className="bg-black text-white pl-4 pr-1.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-black shadow-md border border-white/10"
                      >
                        <span className="tracking-widest">{code}</span>
                        <button onClick={() => removePincode(code)} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                          <X className="w-4 h-4" />
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
            className={`w-full h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
              (step === OnboardingStep.SHOP_NAME ? shopName.length >= 3 : selectedPincodes.length > 0) 
              ? 'bg-black text-white shadow-2xl shadow-black/20' 
              : 'bg-[#f3f3f3] text-zinc-300'
            }`}
          >
            {step === OnboardingStep.SHOP_NAME ? 'Continue' : 'Start Selling'}
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}
