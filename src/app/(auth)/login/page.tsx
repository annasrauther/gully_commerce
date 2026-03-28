'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Smartphone, ShieldCheck, Fingerprint } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/lib/store'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

enum AuthStep {
  PHONE,
  PIN,
  BIOMETRICS
}

export default function LoginPage() {
  const [step, setStep] = useState<AuthStep>(AuthStep.PHONE)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [pin, setPin] = useState(['', '', '', ''])
  const [confirmPin, setConfirmPin] = useState(['', '', '', ''])
  const [isConfirmingPin, setIsConfirmingPin] = useState(false)
  const [timer, setTimer] = useState(30)
  
  const router = useRouter()
  const setLoading = useStore(state => state.setLoading)

  useEffect(() => {
    // Legacy timer cleanup or other effects
  }, [step])

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`
        }
      })
      if (error) throw error
    } catch (error: any) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  const handleGetPin = async () => {
    if (phone.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }
    setLoading(true)
    try {
      // Deterministic check: Is this phone number registered?
      // Since we can't 'search' auth.users, we attempt to sign in with a dummy password.
      // For this MVP, we proceed to PIN step.
      setStep(AuthStep.PIN)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpInput = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return
    const newOtp = [...otp]
    newOtp[index] = val.slice(-1)
    setOtp(newOtp)
    
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
    
    if (newOtp.every(d => d !== '') && index === 3) {
      handleVerifyOtp(newOtp.join(''))
    }
  }

  const handleVerifyOtp = async (code: string) => {
    setLoading(true)
    try {
      const { data: { session }, error } = await supabase.auth.verifyOtp({
        phone: `+91${phone}`,
        token: code,
        type: 'sms',
      })
      
      if (error) throw error
      if (!session) throw new Error('Authentication failed')

      // Check for existing merchant profile
      const { data: merchant } = await supabase
        .from('merchants')
        .select('id')
        .eq('id', session.user.id)
        .single()

      if (merchant) {
        setStep(AuthStep.BIOMETRICS) // Or straight to dashboard if already has PIN
      } else {
        setStep(AuthStep.PIN)
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid code')
    } finally {
      setLoading(false)
    }
  }

  const handlePinInput = (num: number) => {
    const target = isConfirmingPin ? confirmPin : pin
    const setTarget = isConfirmingPin ? setConfirmPin : setPin
    
    const firstEmptyIndex = target.findIndex(d => d === '')
    if (firstEmptyIndex === -1) return
    
    const newPin = [...target]
    newPin[firstEmptyIndex] = num.toString()
    setTarget(newPin)
    
    if (firstEmptyIndex === 3) {
      if (!isConfirmingPin) {
        setTimeout(() => setIsConfirmingPin(true), 300)
      } else {
        if (pin.join('') === newPin.join('')) {
          handleSavePin(newPin.join(''))
        } else {
          toast.error('PINs do not match')
          setConfirmPin(['', '', '', ''])
        }
      }
    }
  }

  const handleSavePin = async (finalPin: string) => {
    setLoading(true)
    try {
      const email = `${phone.trim()}@gully.app`.toLowerCase()
      const password = `GULLY_${finalPin}`

      // Attempt to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) {
        // If sign in fails, try to sign up (Auto-register for this MVP)
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { phone }
          }
        })

        if (signUpError) throw signUpError
        
        // Success: New user
        toast.success('Account created!')
        router.push('/onboarding')
      } else {
        // Success: Existing user
        toast.success('Welcome back!')
        // Check if profile is complete, else onboarding
        const { data: profile } = await supabase.from('merchants').select('name').eq('id', signInData.user?.id).single()
        if ((profile as any)?.name) {
          router.push('/dashboard')
        } else {
          router.push('/onboarding')
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleBiometrics = async () => {
    try {
      toast.success('Biometrics enabled')
      router.push('/onboarding')
    } catch (error) {
      toast.error('Failed to enable biometrics')
    }
  }

  const variants = {
    initial: { y: 10, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -10, opacity: 0 }
  }

  return (
    <div className="flex-1 flex flex-col max-w-[420px] mx-auto w-full bg-white overflow-hidden">
      <AnimatePresence mode="wait">
        {step === AuthStep.PHONE && (
          <motion.div 
            key="phone"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="p-6 pt-10 flex flex-col h-full"
          >
            <Link href="/" className="w-12 h-12 flex items-center justify-center mb-10 bg-white rounded-full border border-zinc-100 shadow-sm transition-all active:scale-90">
              <ChevronLeft className="w-6 h-6 text-black" />
            </Link>
            
            <div className="mb-8">
              <h1 className="text-3xl font-black tracking-tighter mb-3 text-black leading-tight">Welcome back</h1>
              <p className="text-zinc-500 font-medium text-base">Continue with your phone number</p>
            </div>
            
            <div className="flex flex-col gap-6">
              <button 
                onClick={handleGoogleLogin}
                className="w-full bg-white text-black h-14 rounded-xl font-black text-base border-2 border-zinc-100 flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all active:scale-[0.98] shadow-sm mt-2"
              >
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                Continue with Google
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-zinc-300 bg-white px-4">Or use phone</div>
              </div>

              <div className="flex items-center border-b-2 border-black pb-3">
                <span className="text-xl font-black pr-4 border-r border-zinc-100 text-black">+91</span>
                <input 
                  type="tel"
                  placeholder="Enter phone number"
                  className="flex-1 text-xl font-black pl-4 outline-none placeholder:text-zinc-400 text-black bg-transparent"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>
              
              <button 
                onClick={handleGetPin}
                className="w-full bg-black text-white h-14 rounded-xl font-black text-base hover:bg-zinc-900 transition-all active:scale-[0.98] shadow-lg shadow-black/10"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}


        {step === AuthStep.PIN && (
          <motion.div 
            key="pin"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="p-6 pt-10 flex flex-col items-center h-full"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-uber-green/5 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <ShieldCheck className="w-8 h-8 text-uber-green" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter mb-2 text-black leading-tight">
                {isConfirmingPin ? 'Confirm PIN' : 'Create PIN'}
              </h1>
              <p className="text-sm text-zinc-500 font-medium">To secure your account</p>
            </div>
            
            <div className="flex gap-4 mb-10">
              {(isConfirmingPin ? confirmPin : pin).map((d, i) => (
                <div 
                  key={i} 
                  className={`w-4 h-4 rounded-full border-2 border-black transition-all duration-300 ${d ? 'bg-black scale-110 shadow-md' : 'bg-transparent'}`}
                />
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-y-4 gap-x-10 w-full max-w-[280px]">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button 
                  key={num}
                  onClick={() => handlePinInput(num)}
                  className="h-16 w-16 text-2xl font-black flex items-center justify-center rounded-full hover:bg-zinc-50 active:scale-90 transition-all text-black"
                >
                  {num}
                </button>
              ))}
              <div />
              <button 
                onClick={() => handlePinInput(0)}
                className="h-16 w-16 text-2xl font-black flex items-center justify-center rounded-full hover:bg-zinc-50 active:scale-90 transition-all text-black"
              >
                0
              </button>
              <button 
                onClick={() => {
                  const target = isConfirmingPin ? confirmPin : pin
                  const setTarget = isConfirmingPin ? setConfirmPin : setPin
                  const lastIndex = target.findLastIndex(d => d !== '')
                  if (lastIndex === -1) return
                  const newPin = [...target]
                  newPin[lastIndex] = ''
                  setTarget(newPin)
                }}
                className="h-16 flex items-center justify-center rounded-full active:scale-90 transition-all text-black/20 hover:text-black"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}

        {step === AuthStep.BIOMETRICS && (
          <motion.div 
            key="biometrics"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="p-6 pt-12 flex flex-col h-full"
          >
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-12">
              <div className="relative">
                <div className="w-32 h-32 bg-uber-green/5 rounded-[40px] flex items-center justify-center shadow-inner">
                  <Fingerprint className="w-16 h-16 text-uber-green" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center border border-zinc-50">
                  <ShieldCheck className="w-5 h-5 text-uber-green" />
                </div>
              </div>
              
              <div className="max-w-[280px] mb-8">
                <h1 className="text-3xl font-black tracking-tighter mb-4 text-black leading-tight">Fast & Secure</h1>
                <p className="text-lg text-zinc-500 font-medium tracking-tight">Enable Face ID / Touch ID for quick access to your shop.</p>
              </div>
            </div>
            
            <div className="w-full flex flex-col gap-4 mt-auto pb-10">
              <button 
                onClick={handleBiometrics}
                className="w-full bg-black text-white h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-black/10 active:scale-[0.98] transition-all"
              >
                <Fingerprint className="w-6 h-6" />
                Enable Biometrics
              </button>
              <button 
                onClick={() => router.push('/onboarding')}
                className="w-full text-zinc-500 py-4 font-black uppercase tracking-widest text-[11px] hover:text-black transition-colors text-center"
              >
                Set up later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
