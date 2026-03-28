'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe } from 'lucide-react';

const languages = [
  { id: 'en', name: 'English', native: 'English', icon: '🇬🇧' },
  { id: 'hi', name: 'Hindi', native: 'हिंदी', icon: '🇮🇳' },
  { id: 'mr', name: 'Marathi', native: 'मराठी', icon: '🚩' },
  { id: 'ta', name: 'Tamil', native: 'தமிழ்', icon: '🛕' },
];

export default function LanguageModal({ isOpen, onClose, onSelect }: { isOpen: boolean; onClose: () => void; onSelect?: (id: string) => void }) {

  const handleSelect = (langId: string) => {
    localStorage.setItem('gully_lang', langId);
    if (onSelect) onSelect(langId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-p-charcoal/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-sm p-card relative z-10 shadow-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-white z-10 py-2">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-p-indigo-light rounded-xl flex items-center justify-center text-p-indigo">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-p-charcoal font-outfit tracking-tight">Select Language</h2>
               </div>
               <button onClick={onClose} className="p-2 -mr-2 hover:bg-p-bg rounded-lg transition-colors">
                  <X className="w-5 h-5 text-p-slate" />
               </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => handleSelect(lang.id)}
                  className="flex flex-col items-center justify-center p-6 border border-p-bg rounded-p-card bg-white hover:border-p-indigo hover:shadow-lg transition-all active:scale-[0.98] group"
                >
                  <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">{lang.icon}</span>
                  <span className="font-bold text-p-charcoal mb-0.5 font-noto">{lang.native}</span>
                  <span className="text-[10px] font-bold text-p-slate uppercase tracking-widest">{lang.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
