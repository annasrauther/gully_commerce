'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Globe, ShieldCheck, Menu, X, ArrowRight, MessageCircle, Mic } from 'lucide-react';
import Link from 'next/link';
import LanguageModal from '@/components/LanguageModal';
import { analytics } from '@/lib/analytics';

const translations = {
  en: {
    heroTitle: <>Start earning with <span className="inline-flex items-center gap-1.5 align-bottom text-[#25D366]"><MessageCircle className="w-8 h-8 md:w-12 md:h-12 fill-current" /> WhatsApp</span> in under <span className="text-p-indigo font-black">1 minute!</span></>,
    heroSub: "The fastest way for social sellers in Bharat to list, manage, and scale. No app download required for you or your customers.",
    badge: "Built for Bharat's Sellers",
    startSelling: "Start Selling Now",
    changeLang: "Change Language",
    howItWorks: "How Gully Works",
    howItWorksSub: "Launch your professional store in 3 simple steps.",
    step1: "Secure Login",
    step1Desc: "Access your dashboard instantly with just your phone number. No complex passwords.",
    step2: "AI-Powered Listing",
    step2Desc: "Add products by typing or just speaking. Our AI generates descriptions and prices automatically.",
    step3: "Shared & Success",
    step3Desc: "One-tap share to WhatsApp status and chats. Earn directly into your UPI account.",
    trustTitle: "Built on Trust",
    trustDesc: "Empowering 500+ local merchants with direct customer communication and secure payments.",
    openShop: "Open My Shop",
    signIn: "Sign In",
    getStarted: "Get Started"
  },
  hi: {
    heroTitle: <>व्हाट्सएप के साथ <span className="text-p-indigo font-black">1 मिनट</span> में कमाई शुरू करें!</>,
    heroSub: "भारत के सोशल सेलर्स के लिए लिस्टिंग और मैनेजमेंट का सबसे तेज़ तरीका।",
    badge: "भारत के विक्रेताओं के लिए",
    startSelling: "अभी शुरू करें",
    changeLang: "भाषा बदलें",
    howItWorks: "गली कैसे काम करती है",
    howItWorksSub: "3 आसान चरणों में अपना स्टोर लॉन्च करें।",
    step1: "सुरक्षित लॉगिन",
    step1Desc: "केवल अपने फोन नंबर के साथ डैशबोर्ड तक पहुंचें।",
    step2: "AI लिस्टिंग",
    step2Desc: "आवाज या टाइप करके उत्पाद जोड़ें। AI सब कुछ संभालता है।",
    step3: "शेयर और सफलता",
    step3Desc: "व्हाट्सएप पर लिंक भेजें और सीधे अपने UPI में पैसे पाएं।",
    trustTitle: "विश्वास पर आधारित",
    trustDesc: "500+ अधिक स्थानीय व्यापारियों को सुरक्षित भुगतान के साथ सशक्त बनाना।",
    openShop: "दुकान खोलें",
    signIn: "लॉगिन",
    getStarted: "शुरू करें"
  },
  mr: {
    heroTitle: <>व्हॉट्सॲपवरून <span className="text-p-indigo font-black">१ मिनिटात</span> कमाई सुरू करा!</>,
    heroSub: "सोशल सेलर्ससाठी सर्वात वेगवान मार्ग।",
    badge: "येथील विक्रेत्यांसाठी",
    startSelling: "आताच सुरू करा",
    changeLang: "भाषा बदला",
    howItWorks: "कसे चालते",
    howItWorksSub: "३ सोपी पावले।",
    step1: "सुरक्षित लॉगिन",
    step1Desc: "तुमच्या मोबाईल नंबरद्वारे सुरक्षित प्रवेश।",
    step2: "AI लिस्टिंग",
    step2Desc: "बोलून उत्पादने जोडा। AI सर्व काही करते।",
    step3: "शेअर आणि सक्सेस",
    step3Desc: "लिंक पाठवा आणि थेट UPI मध्ये पैसे मिळवा।",
    trustTitle: "विश्वासार्हता",
    trustDesc: "सुरक्षित पेमेंट आणि थेट संवाद।",
    openShop: "दुकान उघडा",
    signIn: "लॉगिन",
    getStarted: "सुरू करा"
  },
  ta: {
    heroTitle: <>வாட்ஸ்அப் மூலம் <span className="text-p-indigo font-black">1 நிமிடத்தில்</span> சம்பாதிக்கத் தொடங்குங்கள்!</>,
    heroSub: "சமூக விற்பனையாளர்களுக்கு எளிதான வழி।",
    badge: "விற்பனையாளர்களுக்காக",
    startSelling: "தொடங்க",
    changeLang: "மொழியை மாற்ற",
    howItWorks: "செய்முறை",
    howItWorksSub: "3 எளிய படிகள்।",
    step1: "பாதுகாப்பான உள்நுழைவு",
    step1Desc: "பாதுகாப்பான அணுகல்।",
    step2: "AI மூலம் சேர்த்தல்",
    step2Desc: "பேசுவதன் மூலம் பொருட்கள் சேர்க்கப்படும்।",
    step3: "பகிர்ந்து வெற்றி",
    step3Desc: "வாட்ஸ்அப்பில் லிங்க் அனுப்பி UPI மூலம் பணம் பெறலாம்।",
    trustTitle: "நம்பகத்தன்மை",
    trustDesc: "பாதுகாப்பான பரிவர்த்தனை।",
    openShop: "கடையைத் திறக்க",
    signIn: "உள்நுழைக",
    getStarted: "தொடங்க"
  }
};

const FloatingMockup = ({ step }: { step: number }) => {
  return (
    <div className="relative w-[280px] h-[580px] bg-p-charcoal rounded-[3rem] border-[8px] border-p-charcoal shadow-2xl overflow-hidden">
      <div className="absolute top-0 w-full h-8 bg-black/10 flex items-center justify-center">
        <div className="w-16 h-1 bg-white/20 rounded-full" />
      </div>
      
      <div className="p-4 pt-10 h-full bg-white flex flex-col">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
               <div className="w-12 h-12 bg-p-indigo-light rounded-xl flex items-center justify-center text-p-indigo">
                 <Smartphone className="w-6 h-6" />
               </div>
               <h4 className="font-bold text-p-charcoal">Enter Phone</h4>
               <div className="h-10 bg-p-bg rounded-lg border border-p-bg flex items-center px-3 text-xs text-p-slate">+91 80978 96998</div>
               <div className="p-button-primary h-10 w-full text-xs">Verify OTP</div>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 text-center">
               <div className="w-20 h-20 bg-p-indigo/5 rounded-full flex items-center justify-center mx-auto border-4 border-p-indigo/10">
                 <Mic className="w-10 h-10 text-p-indigo animate-pulse" />
               </div>
               <p className="text-[10px] font-bold text-p-slate uppercase tracking-widest italic">"Add 1kg Mangoes at 150"</p>
               <div className="p-card border-none bg-p-bg/50 p-3 text-left">
                  <div className="w-full h-24 bg-p-slate/10 rounded-lg mb-2" />
                  <div className="h-3 w-2/3 bg-p-charcoal rounded mb-1" />
                  <div className="h-3 w-1/4 bg-p-indigo rounded" />
               </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full bg-p-bg -m-4 p-4">
               <div className="bg-[#075e54] text-white p-3 rounded-t-xl text-[10px] font-bold flex items-center gap-2">
                 <MessageCircle className="w-3 h-3 fill-white" /> WhatsApp Sales
               </div>
               <div className="flex-1 space-y-3 pt-4">
                  <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-[9px] max-w-[80%]">
                    Hello! Welcome to Aisha's Deli. Check our catalog: gully.com/aisha
                  </div>
                  <div className="self-end bg-[#dcf8c6] p-2 rounded-lg rounded-tr-none shadow-sm text-[9px] max-w-[80%] ml-auto">
                    I want to order 2 Cupcakes!
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-p-indigo shadow-lg flex items-center justify-between">
                     <span className="text-[10px] font-bold">Total: ₹120</span>
                     <span className="p-badge-success text-[8px]">UPI READY</span>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    analytics.track('page_view');
    const saved = localStorage.getItem('gully_lang');
    if (saved && translations[saved as keyof typeof translations]) {
      setCurrentLang(saved);
    }
  }, []);

  const t = (translations[currentLang as keyof typeof translations] || translations.en) as any;

  return (
    <div className="flex flex-col min-h-screen bg-p-bg font-inter antialiased">
      {/* Navigation: Strict 64px Height */}
      <nav className="flex items-center justify-between px-6 h-16 bg-white border-b border-p-bg sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-p-indigo rounded-lg flex items-center justify-center shadow-sm shadow-p-indigo/10">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <span className="font-brand text-xl text-p-charcoal">Gully Commerce</span>
        </div>
        
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="p-button-secondary text-sm h-9 px-4">{t.signIn}</Link>
          <Link href="/login" className="p-button-primary text-sm h-9 px-4">{t.getStarted}</Link>
        </div>

        <button className="md:hidden p-2 text-p-charcoal active:bg-p-bg rounded-lg" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Hero Section: py-24 for Breathing Room */}
      <section className="px-6 py-24 md:py-32 bg-white relative overflow-hidden border-b border-p-bg">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <div className="inline-block mb-8">
              <span className="p-badge-success">{t.badge}</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-extrabold text-p-charcoal mb-8 leading-[1.1] font-outfit tracking-tight">
              {t.heroTitle}
            </h1>
            
            <p className="text-p-slate text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
              {t.heroSub}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/login" className="p-button-primary h-14 px-10 text-lg w-full sm:w-auto shadow-2xl shadow-p-indigo/20 flex items-center justify-center gap-2.5">
                {t.startSelling} <ArrowRight className="w-5 h-5" />
              </Link>
              <button onClick={() => setIsLangModalOpen(true)} className="p-button-secondary h-14 px-10 text-lg w-full sm:w-auto bg-p-bg/30 flex items-center justify-center gap-2.5">
                <Globe className="w-5 h-5" /> {t.changeLang}
              </button>
            </div>

            {/* Social Proof: Aligned & Consistent */}
            <div className="flex flex-col items-center gap-5">
               <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-11 h-11 rounded-full border-[3px] border-white bg-p-bg flex items-center justify-center overflow-hidden shadow-sm ring-1 ring-p-bg/10">
                       <span className="font-bold text-[10px] text-p-indigo uppercase tracking-tighter">{i === 5 ? '+500' : 'Seller'}</span>
                    </div>
                  ))}
               </div>
               <p className="text-[13px] font-bold text-p-charcoal tracking-wide">
                 Join <span className="text-p-indigo">500+ Indian Businesses</span> growing on Gully
               </p>
            </div>
          </motion.div>
        </div>
        
        {/* Subtle Background Ornament */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-p-indigo/[0.02] blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* Interactive Flow: Rigorous Alignment */}
      <section className="px-6 py-24 md:py-32 bg-p-bg/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-6">
               <div className="mb-16">
                  <h2 className="text-3xl md:text-5xl font-black text-p-charcoal mb-6 font-outfit leading-tight">{t.howItWorks}</h2>
                  <p className="text-p-slate font-medium text-lg leading-relaxed max-w-lg">{t.howItWorksSub}</p>
               </div>

               {[
                 { step: 0, title: t.step1, desc: t.step1Desc, icon: Smartphone },
                 { step: 1, title: t.step2, desc: t.step2Desc, icon: Mic },
                 { step: 2, title: t.step3, desc: t.step3Desc, icon: MessageCircle }
               ].map((s, i) => (
                 <motion.div 
                  key={i} 
                  onMouseEnter={() => setActiveStep(i)}
                  className={`group p-8 rounded-[2.5rem] transition-all duration-300 cursor-pointer border-2 border-transparent ${
                    activeStep === i ? 'bg-white shadow-2xl shadow-p-charcoal/5 border-p-bg' : 'hover:bg-white/40'
                  }`}
                 >
                   <div className="flex items-center gap-5 mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black transition-all duration-500 ${
                        activeStep === i ? 'bg-p-indigo text-white shadow-lg shadow-p-indigo/20 scale-110' : 'bg-p-bg text-p-slate'
                      }`}>
                        {i + 1}
                      </div>
                      <h3 className="text-2xl font-bold text-p-charcoal font-outfit">{s.title}</h3>
                   </div>
                   <p className="text-p-slate font-medium leading-relaxed pl-1">{s.desc}</p>
                 </motion.div>
               ))}
            </div>

            <div className="hidden lg:flex items-center justify-center sticky top-40 h-fit">
               <div className="relative">
                  {/* Mockup Backdrop Shadow */}
                  <div className="absolute -inset-20 bg-p-indigo/[0.03] blur-[100px] rounded-full" />
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    <FloatingMockup step={activeStep} />
                  </motion.div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Conversion: Symmetrical & Bold */}
      <section className="px-6 py-24 md:py-40 bg-white text-center border-t border-p-bg">
         <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-p-success/10 rounded-3xl flex items-center justify-center text-p-success mx-auto mb-10 shadow-sm">
               <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-p-charcoal mb-8 font-outfit tracking-tighter">{t.trustTitle}</h2>
            <p className="text-p-slate font-medium mb-12 text-lg md:text-xl leading-relaxed">
              {t.trustDesc}
            </p>
            <Link href="/login" className="p-button-primary h-14 px-12 text-lg inline-flex items-center justify-center gap-3 shadow-2xl shadow-p-indigo/30 rounded-2xl">
              {t.openShop} <ArrowRight className="w-5 h-5" />
            </Link>
         </div>
      </section>

      {/* Footer: Polarized Spacing */}
      <footer className="px-6 py-16 bg-white border-t border-p-bg">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-2.5 mb-10 opacity-60">
            <div className="w-6 h-6 bg-p-charcoal rounded flex items-center justify-center text-white">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
            <span className="font-brand text-base tracking-tight text-p-charcoal">Gully Commerce</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12 text-[11px] font-black uppercase tracking-[0.2em] text-p-slate mb-8">
             <Link href="#" className="hover:text-p-indigo transition-colors">Terms of Service</Link>
             <Link href="#" className="hover:text-p-indigo transition-colors">Privacy Policy</Link>
             <Link href="#" className="hover:text-p-indigo transition-colors">Merchant Help</Link>
          </div>
          
          <p className="text-xs font-bold text-p-slate/40 tracking-wide">
            © 2026 Gully Commerce. Empowering the billion sellers of Bharat.
          </p>
        </div>
      </footer>

      <LanguageModal 
        isOpen={isLangModalOpen} 
        onClose={() => setIsLangModalOpen(false)} 
        onSelect={(id) => setCurrentLang(id)}
      />
      
      {/* Mobile Menu: Symmetrical Alignment */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} className="fixed inset-0 bg-white z-[60] flex flex-col p-8 pt-24 font-outfit">
             <button className="absolute top-8 right-8 p-3 bg-p-bg rounded-2xl" onClick={() => setIsMenuOpen(false)}><X className="w-8 h-8 text-p-charcoal" /></button>
             <div className="flex flex-col gap-10 text-5xl font-black text-p-charcoal tracking-tighter">
               <Link href="/login" onClick={() => setIsMenuOpen(false)}>{t.signIn}</Link>
               <Link href="/login" onClick={() => setIsMenuOpen(false)}>{t.getStarted}</Link>
             </div>
             <div className="mt-auto pt-10 border-t border-p-bg flex flex-col gap-4">
                <p className="text-xs font-black text-p-slate uppercase tracking-widest">Region: India (BRT)</p>
                <p className="text-xs font-bold text-p-slate/60 leading-relaxed">Secure, Encrypted, and Direct. Built for modern social selling.</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
