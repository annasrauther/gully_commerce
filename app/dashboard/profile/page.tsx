'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Smartphone, MapPin, CheckCircle2, ShieldCheck, Settings, Bell, CreditCard, Lock } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-p-bg pb-12 font-inter">
      <header className="px-6 py-8 bg-white border-b border-p-bg shadow-sm">
        <div className="flex items-center gap-4">
           <Link href="/dashboard" className="p-3 bg-p-bg rounded-2xl active:scale-95 transition-all">
             <ArrowLeft className="w-6 h-6 text-p-charcoal" />
           </Link>
           <h1 className="text-2xl font-black text-p-charcoal font-outfit tracking-tighter">Merchant Profile</h1>
        </div>
      </header>

      <main className="px-6 py-10 space-y-8">
        <div className="p-card bg-white border-none shadow-sm flex flex-col items-center py-10 rounded-[3rem]">
           <div className="w-24 h-24 bg-p-indigo rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-p-indigo/20">
              <User className="w-12 h-12" />
           </div>
           <h2 className="text-xl font-black text-p-charcoal font-outfit tracking-tight">Gully Merchant</h2>
           <p className="text-[11px] font-black text-p-slate uppercase tracking-widest mt-1">Professional Selling since 2026</p>
        </div>

        <section className="space-y-4">
           <h3 className="text-[10px] font-black text-p-charcoal uppercase tracking-[0.2em] px-1">Account Details</h3>
           <div className="p-card border-none bg-white shadow-sm rounded-[2rem] space-y-6">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-p-bg rounded-xl text-p-slate"><Smartphone className="w-4 h-4" /></div>
                 <div>
                    <label className="text-[9px] font-black text-p-slate uppercase tracking-widest block">Phone Number</label>
                    <p className="text-sm font-bold text-p-charcoal">+91 80978 96998</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-p-bg rounded-xl text-p-slate"><Mail className="w-4 h-4" /></div>
                 <div>
                    <label className="text-[9px] font-black text-p-slate uppercase tracking-widest block">Email Address</label>
                    <p className="text-sm font-bold text-p-charcoal">merchant@gully.auth</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-p-bg rounded-xl text-p-slate"><MapPin className="w-4 h-4" /></div>
                 <div>
                    <label className="text-[9px] font-black text-p-slate uppercase tracking-widest block">Registered State</label>
                    <p className="text-sm font-bold text-p-charcoal">Maharashtra, India</p>
                 </div>
              </div>
           </div>
        </section>

        <section className="p-card bg-p-success/5 border-p-success/10 flex items-center gap-4 rounded-[2rem]">
           <ShieldCheck className="w-6 h-6 text-p-success" />
           <p className="text-xs font-bold text-p-success">Account is KYC Verified for India (BRT)</p>
        </section>
      </main>
    </div>
  );
}
