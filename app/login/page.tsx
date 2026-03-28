'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, LogIn, CheckCircle2, ShieldCheck, ArrowRight, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear any existing session info on load
  useEffect(() => {
    localStorage.removeItem('gully_otp_phone');
  }, []);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Normalize phone (ensure +91 prefix for Supabase SMS if using real OTP)
    let formattedPhone = phone.replace(/\s+/g, '');
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+91${formattedPhone}`;
    }

    // Mock bypass for development (specified in previous prompt)
    if (formattedPhone === '+918097896998') {
      localStorage.setItem('gully_otp_phone', formattedPhone);
      router.push(`/login/verify?phone=${encodeURIComponent(formattedPhone)}&mock=true`);
      setLoading(false);
      return;
    }

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
           // Direct to dashboard/onboarding post-verify
           data: {
             full_name: 'Gully Merchant',
           }
        }
      });

      if (otpError) throw otpError;

      localStorage.setItem('gully_otp_phone', formattedPhone);
      router.push(`/login/verify?phone=${encodeURIComponent(formattedPhone)}`);
    } catch (err: any) {
      console.error('OTP Error:', err);
      setError(err.message || 'Failed to send OTP. Please check your number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-p-bg items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(63,78,174,0.03),transparent_50%)]" />
      
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-p-indigo rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-p-indigo/10 border border-p-indigo/20">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-p-charcoal font-public-sans tracking-tight">Gully Commerce</h1>
          <p className="text-p-slate font-medium text-sm mt-1">Merchant Secure Portal</p>
        </div>

        <div className="p-card border-none shadow-sm">
          <h2 className="text-xl font-bold text-p-charcoal mb-2 font-outfit tracking-tight">Login or Create Account</h2>
          <p className="text-p-slate text-sm font-medium mb-8 leading-relaxed">Enter your mobile number to receive a 6-digit secure login code.</p>

          <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-p-charcoal uppercase tracking-[0.15em] block ml-1">Phone Number</label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-p-slate font-bold text-sm pointer-events-none">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  required
                  autoFocus
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  className="p-text-field pl-16 h-12 text-base font-bold transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              {error && (
                <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-p-critical text-xs font-bold mt-2 ml-1">
                  {error}
                </motion.p>
              )}
            </div>

            <button
              disabled={loading || phone.length < 10}
              className={`p-button-primary h-12 w-full text-base ${loading ? 'opacity-80' : ''}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Send Login Code <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-p-bg">
            <div className="flex items-center gap-3 text-p-slate grayscale opacity-80">
               <ShieldCheck className="w-5 h-5 text-p-success" />
               <div className="flex flex-col">
                  <p className="text-[9px] font-black text-p-charcoal uppercase tracking-widest">Secured by Supabase Auth</p>
                  <p className="text-[10px] font-medium leading-tight">Payments & inventory data encrypted.</p>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-p-slate font-medium space-x-4">
           <Link href="/" className="hover:text-p-indigo font-bold transition-colors">Home Page</Link>
           <Link href="#" className="hover:text-p-indigo font-bold transition-colors">Help & Support</Link>
        </div>
      </motion.div>
    </div>
  );
}
