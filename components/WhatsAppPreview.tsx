'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Share2, Lock } from 'lucide-react';

interface WhatsAppPreviewProps {
  title: string;
  price: string;
  image: string;
}

export default function WhatsAppPreview({ title, price, image }: WhatsAppPreviewProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-1">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp Preview</span>
        <div className="h-[1px] flex-1 bg-slate-100" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#E7F3EF] p-2 rounded-2xl border border-[#D1E1DB] max-w-[280px] shadow-sm"
      >
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs">
          {image ? (
            <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-2">
              <Image 
                src={image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} 
                alt="Product" 
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square flex items-center justify-center bg-slate-50 border-b border-slate-100">
              <Share2 className="w-8 h-8 text-slate-200" />
            </div>
          )}
          
          <div className="p-3 flex flex-col gap-0.5">
            <h4 className="text-[13px] font-bold text-slate-900 truncate">
              {title || 'Your Product Title'}
            </h4>
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
              {price ? `Price: ₹${price} • ` : ''}Click to buy securely via Gully Commerce.
            </p>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[9px] text-[#128C7E] font-bold uppercase tracking-tight">gully.com</span>
              <Lock className="w-2.5 h-2.5 text-slate-300" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
