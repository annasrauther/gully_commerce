'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, User, MapPin, ShieldCheck, ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/products';

interface CheckoutFormProps {
  product: Product;
}

export default function CheckoutForm({ product }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productId: product.id,
          amount: product.price,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create order');

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: product.price * 100,
        currency: 'INR',
        name: 'Gully Commerce',
        description: product.title,
        order_id: data.razorpayOrderId as string,
        handler: function (response: { razorpay_payment_id: string }) {
          window.location.href = `/order-confirmed?id=${data.orderId}&payment_id=${response.razorpay_payment_id}`;
        },
        prefill: {
          name: formData.name,
          contact: formData.phone,
        },
        theme: {
          color: '#25D366', // WhatsApp Green
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      interface RazorpayInstance {
        open: () => void;
      }
      
      const rzp = new (window as unknown as { Razorpay: new (options: unknown) => RazorpayInstance }).Razorpay(options);
      rzp.open();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      alert(message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      {/* Bottom Sheet Drawer Look */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-white rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] px-6 pt-10 pb-40 mt-auto border-t border-wa-dark/5"
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-10" />
        
        <div className="flex flex-col gap-8">
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-wa-dark/40 uppercase tracking-[0.15em] pl-1 flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              आपका नाम • Full Name
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-wa-bg border-none focus:ring-2 focus:ring-wa-green/20 rounded-2xl p-5 font-bold text-lg placeholder:text-slate-300 transition-all shadow-wa-sm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-wa-dark/40 uppercase tracking-[0.15em] pl-1 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" />
              फ़ोन नंबर • WhatsApp Number
            </label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">+91</div>
              <input
                required
                type="tel"
                placeholder="9876543210"
                className="w-full bg-wa-bg border-none focus:ring-2 focus:ring-wa-green/20 rounded-2xl pl-16 p-5 font-bold text-lg placeholder:text-slate-300 transition-all shadow-wa-sm"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-wa-dark/40 uppercase tracking-[0.15em] pl-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              पता • Delivery Address
            </label>
            <textarea
              required
              rows={3}
              placeholder="Flat, Building, Area, Pincode"
              className="w-full bg-wa-bg border-none focus:ring-2 focus:ring-wa-green/20 rounded-2xl p-5 font-bold text-base leading-[1.6] placeholder:text-slate-300 resize-none transition-all shadow-wa-sm"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>
      </motion.div>

      {/* Conversations Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-xl border-t border-slate-100 z-[60] max-w-md mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 justify-center mb-1">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-wa-mint text-wa-teal rounded-full border border-wa-green/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Escrow Active</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 tracking-tight italic">Safe & Secure</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-16 w-full bg-wa-green text-slate-800 rounded-full font-black text-lg shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-tight"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-4 border-slate-800 border-t-transparent rounded-full animate-spin" />
                <span className="uppercase tracking-widest font-black">Sending...</span>
              </div>
            ) : (
              <>
                <ShoppingCart className="w-6 h-6" />
                <span className="uppercase tracking-widest font-black italic">Confirm & Send Order</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
