'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

const NAMES = ['Rahul', 'Priya', 'Amit', 'Anjali', 'Sameer', 'Sneha', 'Vikram', 'Pooja'];
const LOCATIONS = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Surat', 'Hyderabad'];

export default function SocialProof() {
  const [visitor, setVisitor] = useState<{ name: string; city: string; time: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const name = NAMES[Math.floor(Math.random() * NAMES.length)];
      const city = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      setVisitor({ name, city, time: Date.now() });
      
      setTimeout(() => setVisitor(null), 4000);
    }, 12000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-6 left-4 right-4 z-[100] pointer-events-none flex justify-center">
      <AnimatePresence>
        {visitor && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card px-4 py-2 flex items-center gap-3 backdrop-blur-md bg-white/90 border-white/50"
          >
            <div className="w-8 h-8 rounded-full bg-gully-green/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-gully-green" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800">{visitor.name} from {visitor.city}</span>
              <span className="text-[10px] text-slate-500 font-medium leading-none">Just browsing this listing</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-gully-green animate-pulse ml-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
