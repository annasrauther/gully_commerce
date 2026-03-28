'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShieldCheck, ShoppingCart, ChevronLeft, Star, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/lib/products';
import SocialProof from './SocialProof';

interface ProductViewV2Props {
  product: Product;
}

export default function ProductViewV2({ product }: ProductViewV2Props) {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-wa-bg relative overflow-x-hidden pb-40 font-sans">
      <SocialProof />
      
      {/* WhatsApp Chat Header Mock */}
      <div className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-wa-dark text-white shadow-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1 -ml-1 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-white/10">
              <Image 
                src="/static/logo.png" 
                alt="Store" 
                fill 
                className="object-contain p-1 invert brightness-0"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-wa-green border-2 border-wa-dark rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none">Gully Commerce</span>
              <span className="text-[10px] text-wa-green font-medium animate-pulse mt-0.5">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <ShieldCheck className="w-5 h-5 text-wa-green" />
          <MoreVertical className="w-5 h-5 text-white/70" />
        </div>
      </div>

      {/* Hero Image Section - Mimics an un-cropped image arrival */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-4 pt-6"
      >
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-wa-sm border-4 border-white">
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </motion.div>

      {/* Conversational Product Card (Message Bubble) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="px-4 py-6 flex flex-col items-start gap-1"
      >
        <div className="relative bg-wa-light p-5 rounded-wa-bubble rounded-tl-none shadow-wa-sm max-w-[90%] flex flex-col gap-4">
          {/* Bubble Tail */}
          <div className="absolute top-0 -left-2 w-3 h-3 bg-wa-light" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
          
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-slate-800 leading-tight">
              {product.title}
            </h1>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-wa-dark text-wa-dark" />
              <span className="text-[10px] font-bold text-wa-dark/60 uppercase tracking-widest">Premium Quality</span>
            </div>
          </div>

          <p className="text-slate-700 text-sm leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-wa-dark/5">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-wa-dark/40 uppercase tracking-tight">Price</span>
              <span className="text-2xl font-black text-slate-800">₹{product.price}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-wa-dark/40 uppercase tracking-tight">Delivery</span>
              <span className="text-[10px] font-bold text-wa-green">FREE & FAST</span>
            </div>
          </div>

          {/* Time & Read Receipts Style */}
          <div className="flex items-center justify-end gap-1 -mb-1">
            <span className="text-[9px] text-wa-dark/30 font-medium">Just now</span>
            <div className="flex -space-x-1">
              <CheckCircle2 className="w-3 h-3 text-wa-green" />
              <CheckCircle2 className="w-3 h-3 text-wa-green" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trust Seal & Badges */}
      <div className="px-6 space-y-4">
        <div className="bg-white rounded-wa-bubble p-4 flex items-center gap-4 shadow-wa-sm border border-wa-dark/5">
          <div className="w-12 h-12 rounded-full bg-wa-mint flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-wa-teal" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800">Gully Protected</span>
            <span className="text-[10px] text-slate-500 font-medium leading-none">Your money is safe until delivery.</span>
          </div>
        </div>
      </div>

      {/* Thumb-Zone Sticky Action - Chat Action Style */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-slate-100 z-[60] max-w-md mx-auto"
      >
        <Link 
          href={`/checkout/${product.slug}`}
          className="h-14 w-full bg-wa-green text-slate-800 rounded-full font-black text-base shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-tight"
        >
          <ShoppingCart className="w-5 h-5" />
          Buy Now / अभी खरीदें
        </Link>
      </motion.div>
    </div>
  );
}

function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
