'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlusCircle } from 'lucide-react';

export default function InstallPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show prompt after 5 seconds if not already installed/dismissed
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem('gully_install_dismissed');
      if (!dismissed) {
        setShow(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    localStorage.setItem('gully_install_dismissed', 'true');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-6 right-6 z-50 md:hidden"
        >
          <div className="bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl border border-white/10 flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-wa-green/30" />
            
            <div className="w-12 h-12 bg-wa-green rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-wa-green/20">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1">
              <p className="font-black text-sm leading-tight">Install Gully Commerce</p>
              <p className="text-[10px] text-slate-400 font-medium">Add to home screen for 1-tap access</p>
            </div>
            
            <button 
              onClick={dismiss}
              className="p-2 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-wa-green/5 rounded-full blur-xl" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
