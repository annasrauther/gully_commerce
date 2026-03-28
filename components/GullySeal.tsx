'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function GullySeal() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative flex flex-col gap-4 p-6 bg-white shadow-premium rounded-[2.5rem] border border-gully-gold/30 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gully-gold/10 blur-3xl -z-1" />
      
      <div className="flex items-center gap-4">
        {/* Face of the Seller + Shield */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden relative z-10 font-sans">
            <Image 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&h=150&auto=format&fit=crop" 
              alt="Seller"
              fill
              className="object-cover"
            />
          </div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="absolute -bottom-1 -right-1 bg-gully-gold p-1.5 rounded-full shadow-lg z-20 border-2 border-white"
          >
            <ShieldCheck className="w-5 h-5 text-gully-blue" />
          </motion.div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-black text-gully-text text-xl tracking-tight">Gully Protected</span>
          </div>
          <div className="flex items-center gap-1.5 text-gully-green">
            <CheckCircle2 className="w-4 h-4 fill-current" />
            <span className="text-xs font-bold uppercase tracking-widest">Verified Seller</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gully-bg/50 rounded-2xl border border-gully-gold/20">
        <p className="text-sm text-gully-text/80 font-medium leading-relaxed">
          Your funds are held securely in <span className="text-gully-blue font-bold">Gully Escrow</span>. Payment is released only after the seller provides proof of dispatch.
        </p>
      </div>
    </motion.div>
  );
}
