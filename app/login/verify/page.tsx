'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, CheckCircle2, ShieldCheck, ArrowRight, MessageCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');
  const isMock = searchParams.get('mock') === 'true' || phone === '+918097896998' || phone === '8097896998';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!phone) {
      router.replace('/login');
    }
  }, [phone]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;

    setLoading(true);
    setError(null);

    // Development Bypass (as requested)
    if (isMock && otp === '123456') {
      setSuccess(true);
      localStorage.setItem('gully_mock_session', 'true');
      const isOnboarded = localStorage.getItem('gully_onboarded') === 'true';
      setTimeout(() => {
        router.push(isOnboarded ? '/dashboard' : '/onboarding');
      }, 1000);
      return;
    }

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: phone || '',
        token: otp,
        type: 'sms'
      });

      if (verifyError) throw verifyError;

      if (data.session) {
        setSuccess(true);
        const isOnboarded = localStorage.getItem('gully_onboarded') === 'true';
        setTimeout(() => {
          router.push(isOnboarded ? '/dashboard' : '/onboarding');
        }, 1000);
      }
    } catch (err: any) {
      console.error('Verification Error:', err);
      setError(err.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-p-bg items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(63,78,174,0.03),transparent_50%)]" />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm z-10">
        <div className="p-card shadow-2xl shadow-p-charcoal/5">
          <div className="w-12 h-12 bg-p-indigo-light rounded-xl flex items-center justify-center text-p-indigo mb-6">
            <MessageCircle className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold text-p-charcoal mb-2 font-outfit">Verify Identity</h2>
          <p className="text-p-slate text-sm font-medium mb-8 leading-relaxed">
            We've sent a 6-digit secure code to <span className="text-p-indigo font-bold">{phone}</span>.
          </p>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-p-charcoal uppercase tracking-[0.15em] block ml-1">Otp Code</label>
              <input
                required
                autoFocus
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                className="p-text-field text-center py-4 text-3xl font-black bg-p-bg/30 border-p-bg tracking-[0.5em] focus:tracking-[0.5em]"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
              {error && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-p-critical text-[11px] font-bold mt-3 ml-1">
                  <AlertCircle className="w-3 h-3" /> {error}
                </motion.div>
              )}
            </div>

            <button
              disabled={loading || otp.length < 6 || success}
              className={`p-button-primary h-14 w-full text-lg shadow-xl shadow-p-indigo/20 ${success ? 'bg-p-success border-p-success' : ''}`}
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : success ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6" /> Identity Verified
                </motion.div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Verify & Continue <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-p-bg flex flex-col items-center gap-4">
            <button onClick={() => router.back()} className="text-xs font-bold text-p-indigo hover:underline flex items-center gap-1">
              <Smartphone className="w-3 h-3" /> Change number
            </button>
            <button className="text-xs font-bold text-p-slate hover:text-p-indigo flex items-center gap-2">
              <RefreshCw className="w-3 h-3" /> Resend Code in 30s
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-p-bg">
        <div className="w-8 h-8 border-4 border-p-indigo border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
