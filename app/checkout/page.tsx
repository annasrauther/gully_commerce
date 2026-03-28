'use client';

import { useState } from 'react';
import { ArrowLeft, MapPin, Phone, User, CreditCard, CheckCircle2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    upiApp: 'gpay'
  });

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', icon: '🇮🇳' },
    { id: 'phonepe', name: 'PhonePe', icon: '🇮🇳' },
    { id: 'paytm', name: 'Paytm', icon: '🇮🇳' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 flex items-center gap-4 bg-white border-b border-slate-100 sticky top-0 z-10">
        <Link href="/" className="p-2 -ml-2 text-slate-400">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <span className="font-black text-slate-900">Checkout</span>
        <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-wa-green/10 rounded-full">
          <ShoppingCart className="w-3 h-3 text-wa-green" />
          <span className="text-[10px] font-black text-wa-green uppercase">1 Item</span>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 max-w-md mx-auto w-full">
        {/* Product Preview */}
        <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl mb-8">
          <div className="w-20 h-20 bg-white rounded-xl shadow-sm border border-slate-100" />
          <div className="flex flex-col justify-center">
            <h2 className="font-bold text-slate-900">Premium Chocolate Cake</h2>
            <p className="text-sm text-slate-500 mb-2">Rahul&apos;s Bakery</p>
            <p className="font-black text-wa-green text-lg">₹450</p>
          </div>
        </div>

        {/* Ghost Checkout Form */}
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
              <User className="w-3 h-3" /> Full Name
            </label>
            <input 
              type="text" 
              placeholder="e.g. Rahul Kumar"
              className="w-full h-14 px-5 bg-slate-50 border-2 border-transparent focus:border-wa-green focus:bg-white rounded-2xl transition-all outline-none font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
              <Phone className="w-3 h-3" /> WhatsApp Number
            </label>
            <input 
              type="tel" 
              placeholder="+91 99999 99999"
              className="w-full h-14 px-5 bg-slate-50 border-2 border-transparent focus:border-wa-green focus:bg-white rounded-2xl transition-all outline-none font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
              <MapPin className="w-3 h-3" /> Delivery Address
            </label>
            <textarea 
              rows={3}
              placeholder="House No, Street name, City..."
              className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-wa-green focus:bg-white rounded-2xl transition-all outline-none font-bold text-slate-900 resize-none"
            />
            <p className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-wa-green" /> Auto-suggesting via Google Maps
            </p>
          </div>

          <div className="pt-4">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
              <CreditCard className="w-3 h-3" /> Select UPI App
            </label>
            <div className="grid grid-cols-3 gap-3">
              {upiApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setFormData({ ...formData, upiApp: app.id })}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all active:scale-95 ${
                    formData.upiApp === app.id 
                    ? 'bg-wa-green/5 border-wa-green shadow-lg shadow-wa-green/10' 
                    : 'bg-white border-slate-100'
                  }`}
                >
                  <span className="text-2xl mb-1">{app.icon}</span>
                  <span className={`text-[10px] font-black uppercase tracking-tight ${formData.upiApp === app.id ? 'text-wa-green' : 'text-slate-400'}`}>
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Checkout Footer */}
      <footer className="p-6 bg-white border-t border-slate-100 sticky bottom-0 z-10">
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs font-bold uppercase">Total Payable</span>
            <span className="text-2xl font-black text-slate-900">₹450</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Secured by Razorpay</p>
        </div>
        
        <button className="w-full h-16 bg-slate-900 text-white font-black text-lg rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
          Pay via UPI <ArrowLeft className="w-5 h-5 rotate-180" />
        </button>
      </footer>
    </div>
  );
}
