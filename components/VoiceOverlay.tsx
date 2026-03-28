'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, CheckCircle2, Sparkles, Languages, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';

interface VoiceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (transcript: string) => void;
}

export default function VoiceOverlay({ isOpen, onClose, onResult }: VoiceOverlayProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'success'>('idle');
  const [lang, setLang] = useState('hi-IN');

  useEffect(() => {
    const savedLang = localStorage.getItem('gully_merchant_lang') || 'hi-IN';
    setLang(savedLang === 'hi' ? 'hi-IN' : 'en-IN');

    if (isOpen) {
      startListening();
    } else {
      stopListening();
    }
  }, [isOpen]);

  const startListening = () => {
    if (typeof window === 'undefined') return;
    
    // @ts-expect-error - webkitSpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus('listening');
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      const current = event.results[0][0].transcript;
      setTranscript(current);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcript) {
        setStatus('processing');
        setTimeout(() => {
          setStatus('success');
          setTimeout(() => {
             onResult(transcript);
             onClose();
          }, 800);
        }, 1200);
      } else {
        setStatus('idle');
      }
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    setStatus('idle');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/60 backdrop-blur-2xl"
        >
          {/* Polaris Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-3 bg-p-bg hover:bg-p-indigo-light text-p-charcoal rounded-2xl transition-all active:scale-95 border border-p-bg"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-full max-w-md flex flex-col items-center">
            
            {/* AI Assistant Badge */}
            <div className="p-badge-success bg-p-indigo/10 text-p-indigo border-p-indigo/20 px-4 py-2 mb-10 flex items-center gap-2 shadow-sm ring-1 ring-p-indigo/5">
               <Sparkles className="w-3.5 h-3.5" /> Gully Assistant (Beta)
            </div>

            {/* Premium Symphony Visualizer */}
            <div className="relative h-48 flex items-center justify-center mb-12 w-full">
              {status === 'listening' ? (
                <div className="flex items-center gap-1.5 h-full">
                   {[...Array(24)].map((_, i) => (
                     <motion.div
                       key={i}
                       animate={{
                         height: [
                           12, 
                           Math.random() * 80 + 10, 
                           Math.random() * 40 + 5, 
                           12
                         ],
                         backgroundColor: [
                           '#3f4eae', // Polaris Indigo
                           '#008060', // Polaris Success
                           '#3f4eae'
                         ]
                       }}
                       transition={{
                         repeat: Infinity,
                         duration: 0.4 + (i * 0.02),
                         ease: "easeInOut"
                       }}
                       className="w-1.5 rounded-full shadow-[0_4px_12px_rgba(63,78,174,0.15)]"
                     />
                   ))}
                </div>
              ) : status === 'processing' ? (
                <motion.div 
                  className="w-20 h-20 border-4 border-p-indigo/10 border-t-p-indigo rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
              ) : status === 'success' ? (
                <motion.div 
                   initial={{ scale: 0, rotate: -45 }}
                   animate={{ scale: 1, rotate: 0 }}
                   className="w-24 h-24 bg-p-success text-white rounded-[2.5rem] flex items-center justify-center"
                >
                   <CheckCircle2 className="w-12 h-12" />
                </motion.div>
              ) : (
                 <div className="w-24 h-24 bg-p-bg rounded-[2.5rem] flex items-center justify-center border border-p-bg">
                    <Mic className="w-10 h-10 text-p-slate" />
                 </div>
              )}
            </div>

            {/* Transcript Card */}
            <div className="text-center w-full">
              <h3 className="text-2xl font-black text-p-charcoal font-outfit tracking-tighter mb-6 leading-tight px-6">
                {status === 'listening' ? (
                  <span className="flex items-center justify-center gap-2">
                    Listening...
                  </span>
                ) : 
                status === 'processing' ? "Analyzing your voice..." : 
                status === 'success' ? "Listing identified!" : 
                "Tap to start listening"}
              </h3>
              
              <div className="p-card border-none bg-white shadow-xl shadow-p-charcoal/5 rounded-[2.5rem] p-8 min-h-[140px] flex items-center justify-center">
                 {transcript ? (
                   <p className="text-2xl font-black text-p-charcoal font-outfit leading-snug tracking-tight">
                     "{transcript}"
                   </p>
                 ) : (
                   <div className="space-y-3 opacity-30">
                     <p className="text-sm font-bold uppercase tracking-widest text-p-slate italic flex items-center gap-2 justify-center">
                       <Languages className="w-4 h-4" /> Try saying:
                     </p>
                     <p className="text-base font-medium text-p-charcoal leading-relaxed max-w-[240px] mx-auto">
                        "Add 2kg Apples at 150 rupees"
                     </p>
                   </div>
                 )}
              </div>
            </div>
            
            <div className="mt-12 flex items-center gap-3">
               <div className="flex bg-p-bg p-1 rounded-xl">
                 <button className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 ${lang === 'hi-IN' ? 'bg-white shadow-sm text-p-indigo' : 'text-p-slate'}`}>
                    <Globe className="w-3 h-3" /> Hindi
                 </button>
                 <button className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 ${lang === 'en-IN' ? 'bg-white shadow-sm text-p-indigo' : 'text-p-slate'}`}>
                    English
                 </button>
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
