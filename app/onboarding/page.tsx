'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, ArrowRight, ChevronLeft, LayoutGrid, CheckCircle2, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    storeName: '',
    category: 'Bakery',
    location: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFinish = () => {
    localStorage.setItem('gully_onboarded', 'true');
    localStorage.setItem('gully_store_name', formData.storeName || 'My Gully Store');
    router.push('/dashboard');
  };

  const handleSkip = () => {
    localStorage.setItem('gully_onboarded', 'false'); // Mark as skipped but allow access
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-p-bg flex z-50">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className={`flex-1 h-full transition-all duration-500 ${
              i <= step ? 'bg-p-indigo' : ''
            }`}
          />
        ))}
      </div>

      <main className="flex-1 flex flex-col p-6 pt-16 max-w-lg mx-auto w-full">
        {/* Header Section */}
        <div className="mb-12">
          {step > 1 && (
            <button onClick={prevStep} className="flex items-center gap-1 text-p-slate font-bold text-xs uppercase tracking-widest mb-6">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          <h1 className="text-3xl font-bold text-p-charcoal font-inter mb-2">
            {step === 1 ? 'Name your store' : step === 2 ? 'What do you sell?' : 'You\'re all set!'}
          </h1>
          <p className="text-p-slate font-medium text-sm">
            {step === 1 ? 'This is what your customers will see on your WhatsApp link.' :
             step === 2 ? 'We\'ll customize your store dashboard based on your category.' :
             'Welcome to the future of social commerce in Bharat.'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-p-charcoal uppercase tracking-wider flex items-center gap-2">
                  <Store className="w-3 h-3 text-p-indigo" /> Store Name
                </label>
                <input 
                  autoFocus
                  type="text" 
                  placeholder="e.g. Rahul's Fresh Bakery"
                  className="p-text-field h-14 text-lg"
                  value={formData.storeName}
                  onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-2 gap-4"
            >
              {['Bakery', 'Sweets', 'Dairy', 'Groceries', 'Clothing', 'Others'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFormData({...formData, category: cat});
                    nextStep();
                  }}
                  className={`p-card flex flex-col items-center justify-center py-8 hover:border-p-indigo transition-all ${
                    formData.category === cat ? 'border-p-indigo bg-p-indigo-light' : ''
                  }`}
                >
                  <LayoutGrid className={`w-6 h-6 mb-3 ${formData.category === cat ? 'text-p-indigo' : 'text-p-slate'}`} />
                  <span className={`text-sm font-bold ${formData.category === cat ? 'text-p-indigo' : 'text-p-charcoal'}`}>{cat}</span>
                </button>
              ))}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
               <div className="w-24 h-24 bg-p-indigo-light rounded-full flex items-center justify-center mx-auto mb-8">
                  <Rocket className="w-12 h-12 text-p-indigo animate-bounce" />
               </div>
               <h3 className="text-xl font-bold text-p-charcoal mb-4">Your store is ready!</h3>
               <div className="p-card bg-p-bg/50 border-none space-y-3 mb-8 text-left">
                  <div className="flex items-center gap-3 text-sm font-bold text-p-charcoal">
                    <CheckCircle2 className="w-4 h-4 text-p-success" /> Store Name: {formData.storeName || 'Custom Store'}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-p-charcoal">
                    <CheckCircle2 className="w-4 h-4 text-p-success" /> Goal: Sales on WhatsApp
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="mt-auto py-8 flex flex-col gap-4">
          {step === 1 && (
            <button 
              disabled={!formData.storeName}
              onClick={nextStep}
              className="p-button-primary h-14 text-lg w-full flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          )}
          
          {step === 3 && (
            <button 
              onClick={handleFinish}
              className="p-button-primary h-14 text-lg w-full"
            >
              Go to Dashboard
            </button>
          )}

          {step < 3 && (
            <button 
              onClick={handleSkip}
              className="text-p-slate text-sm font-bold uppercase tracking-widest hover:text-p-indigo transition-colors"
            >
              Skip for now
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
