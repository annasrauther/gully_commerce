'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, Home, ShoppingBag, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function OrderConfirmedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const paymentId = searchParams.get('payment_id');

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-gully-bg shadow-xl items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Background Celebration */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, times: [0, 0.6, 1], ease: "easeOut" }}
        className="absolute inset-0 bg-linear-to-b from-gully-green/10 to-transparent -z-1"
      />

      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-28 h-28 bg-white rounded-full flex items-center justify-center mb-8 shadow-premium border-2 border-gully-green/20 relative"
      >
        <CheckCircle2 className="w-14 h-14 text-gully-green" />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-[-15px] border-2 border-dashed border-gully-gold/30 rounded-full"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-4xl font-black text-gully-text mb-3 tracking-tight">Order Placed!</h1>
        <p className="text-slate-500 mb-8 font-medium px-4">
          Your order <span className="text-gully-blue font-black font-mono tracking-tighter">#{orderId?.slice(-6).toUpperCase() || 'GULLY-ORDER'}</span> is now protected in escrow.
        </p>
      </motion.div>

      {/* Success Receipt Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full bg-white rounded-[2.5rem] p-6 mb-8 text-left shadow-premium border border-slate-50 relative"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-gully-blue/10 p-2 rounded-xl">
              <ShoppingBag className="w-4 h-4 text-gully-blue" />
            </div>
            <span className="font-black text-[10px] text-slate-400 uppercase tracking-widest">Order Info</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gully-green/10 text-gully-green rounded-full border border-gully-green/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Escrow Active</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end border-b border-slate-50 pb-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400">Payment Status</span>
              <span className="text-gully-green font-black">Success / सफल</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400">Payment ID</span>
              <p className="text-slate-900 font-mono text-xs truncate max-w-[120px]">{paymentId || 'TXN_GULLY_V2'}</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
            The seller has been notified and will dispatch soon. Your money will stay with Gully Commerce until you get the delivery.
          </p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col w-full gap-4"
      >
        <Link 
          href="/"
          className="btn-upi w-full"
        >
          <Home className="w-6 h-6" />
          <span>Go Back Home</span>
        </Link>
        <button className="flex items-center justify-center gap-2 p-4 text-slate-400 font-black text-xs uppercase tracking-[0.2em] group transition-colors hover:text-gully-blue">
          <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Track Your Gully Link
        </button>
      </motion.div>

      <div className="mt-12 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-gully-gold" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trusted by 10,000+ Social Sellers</span>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-gully-bg items-center justify-center">
        <div className="w-8 h-8 border-4 border-gully-blue border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrderConfirmedContent />
    </Suspense>
  );
}
