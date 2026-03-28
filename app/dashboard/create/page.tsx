'use client';

import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Camera, 
  Tag, 
  IndianRupee, 
  FileText, 
  CheckCircle2, 
  Mic,
  Sparkles,
  X,
  Plus,
  Shirt,
  Smartphone,
  Sparkle,
  Monitor,
  Home,
  Tv,
  Baby,
  Apple,
  Search,
  Zap,
  MoreVertical,
  LogOut,
  Settings,
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import VoiceOverlay from '@/components/VoiceOverlay';
import { supabase } from '@/lib/supabase';

const CATEGORIES = [
  { id: 'fashion', name: 'Fashion', icon: Shirt },
  { id: 'mobiles', name: 'Mobiles', icon: Smartphone },
  { id: 'beauty', name: 'Beauty', icon: Sparkle },
  { id: 'electronics', name: 'Electronics', icon: Monitor },
  { id: 'home', name: 'Home', icon: Home },
  { id: 'appliances', name: 'Appliances', icon: Tv },
  { id: 'toys', name: 'Toys', icon: Baby },
  { id: 'food', name: 'Food', icon: Apple },
];

export default function CreateProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeField, setActiveField] = useState<keyof typeof formData | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [catSearch, setCatSearch] = useState('');
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
  });

  const filteredCategories = useMemo(() => 
    CATEGORIES.filter(c => c.name.toLowerCase().includes(catSearch.toLowerCase())),
    [catSearch]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 3 - images.length;
      if (remainingSlots <= 0) return;
      
      const newUrls = Array.from(files).slice(0, remainingSlots).map(f => URL.createObjectURL(f));
      setImages(prev => [...prev, ...newUrls]);
    }
  };

  const handleCatToggle = (catName: string) => {
    if (selectedCats.includes(catName)) {
      setSelectedCats(selectedCats.filter(c => c !== catName));
    } else {
      setSelectedCats([...selectedCats, catName]);
    }
  };

  const handleVoiceTrigger = (field: keyof typeof formData) => {
    setActiveField(field);
    setIsVoiceOpen(true);
  };

  const handleVoiceResult = (result: string) => {
    if (activeField) {
      setFormData({ ...formData, [activeField]: result });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => router.push('/dashboard/inventory'), 1500);
    }, 1000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('gully_mock_session');
    router.push('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-p-bg pb-44 font-inter text-p-charcoal overflow-x-hidden">
      <VoiceOverlay isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} onResult={handleVoiceResult} />

      {/* Standard Header with Branding & Menu */}
      <header className="px-6 py-8 bg-white border-b border-p-bg sticky top-0 z-[40] shadow-sm shadow-p-charcoal/5">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-3 bg-p-bg rounded-2xl active:scale-95 transition-all text-p-slate hover:text-p-indigo">
                <ChevronLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-black text-p-charcoal font-outfit tracking-tighter">Add Product</h1>
           </div>

           <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 bg-p-bg rounded-2xl active:scale-95 transition-all text-p-slate hover:text-p-indigo"
              >
                <MoreVertical className="w-6 h-6" />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-p-bg p-3 z-50 ring-1 ring-p-charcoal/5"
                  >
                     <Link href="/dashboard/profile" className="flex items-center gap-3 p-4 hover:bg-p-bg rounded-2xl transition-all">
                        <User className="w-4 h-4 text-p-indigo" /> <span className="text-xs font-black uppercase tracking-widest text-p-charcoal">Profile</span>
                     </Link>
                     <Link href="/dashboard/settings" className="flex items-center gap-3 p-4 hover:bg-p-bg rounded-2xl transition-all">
                        <Settings className="w-4 h-4 text-p-indigo" /> <span className="text-xs font-black uppercase tracking-widest text-p-charcoal">Settings</span>
                     </Link>
                     <div className="h-px bg-p-bg my-2 mx-2" />
                     <button onClick={handleLogout} className="flex items-center gap-3 p-4 hover:bg-p-critical/5 text-p-critical rounded-2xl w-full transition-all text-left">
                        <LogOut className="w-4 h-4" /> <span className="text-xs font-black uppercase tracking-widest">Logout</span>
                     </button>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="px-6 py-10 space-y-10 max-w-lg mx-auto w-full">
        
        {/* Photos Card: Bharat-Simple English */}
        <div className="bg-white border-none rounded-[3.5rem] p-10 shadow-sm space-y-8">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-black text-p-charcoal uppercase tracking-[0.3em]">Product Photos</h2>
            <span className="text-[10px] text-p-slate font-black uppercase tracking-widest bg-p-bg px-4 py-1.5 rounded-full">{images.length}/3 Done</span>
          </div>
          
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileChange} />

          <div className="grid grid-cols-2 gap-4 pt-2">
             {images.map((img, i) => (
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key={i} className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-inner group ring-1 ring-p-bg">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 p-2.5 bg-p-critical/95 text-white rounded-2xl shadow-xl hover:scale-105 active:scale-90 transition-all">
                     <X className="w-4 h-4" />
                  </button>
               </motion.div>
             ))}

             {images.length < 3 && (
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="aspect-square bg-p-bg/50 border-2 border-dashed border-p-indigo/10 rounded-[2.5rem] flex flex-col items-center justify-center text-p-slate hover:bg-p-indigo-light hover:border-p-indigo transition-all cursor-pointer group"
               >
                  <div className="w-14 h-14 bg-white rounded-[1.2rem] flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                     <Camera className="w-7 h-7 text-p-indigo" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.1em] text-p-slate">Add Photo</span>
               </div>
             )}
          </div>
        </div>

        {/* Core Product Info Card */}
        <div className="bg-white border-none rounded-[4rem] p-12 shadow-sm space-y-12">
           
           <div className="space-y-4">
              <div className="flex justify-between items-center group">
                 <label className="text-[10px] font-black text-p-slate uppercase tracking-[0.2em] flex items-center gap-2">
                   <Tag className="w-4 h-4 text-p-indigo" /> Product Name
                 </label>
                 <button type="button" onClick={() => handleVoiceTrigger('name')} className="p-3.5 bg-p-bg rounded-[1.2rem] text-p-indigo hover:bg-p-indigo hover:text-white transition-all active:scale-90 shadow-sm">
                    <Mic className="w-4 h-4" />
                 </button>
              </div>
              <input required type="text" placeholder="e.g. Designer Silk Saree" className="p-text-field text-xl font-black font-outfit h-18 bg-p-bg/40 rounded-2xl px-8 focus:bg-white border-transparent shadow-inner" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <label className="text-[10px] font-black text-p-slate uppercase tracking-[0.2em] flex items-center gap-2">
                   <IndianRupee className="w-4 h-4 text-p-indigo" /> Selling Price
                 </label>
                 <button type="button" onClick={() => handleVoiceTrigger('price')} className="p-3.5 bg-p-bg rounded-[1.2rem] text-p-indigo hover:bg-p-indigo hover:text-white transition-all active:scale-90 shadow-sm">
                    <Mic className="w-4 h-4" />
                 </button>
              </div>
              <input required type="number" placeholder="0.00" className="p-text-field text-2xl font-black font-outfit h-18 bg-p-bg/40 rounded-2xl px-8 focus:bg-white border-transparent shadow-inner" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
           </div>

           {/* Multiple Category Select with Multi-Select logic */}
           <div className="space-y-6 pt-6 border-t border-p-bg">
              <div className="flex items-center justify-between">
                 <label className="text-[10px] font-black text-p-slate uppercase tracking-[0.2em]">Select Category (Can pick many)</label>
                 {selectedCats.length > 0 && (
                    <span className="p-badge-success text-[10px] font-black uppercase tracking-widest">{selectedCats.length} Picked</span>
                 )}
              </div>
              
              <div className="relative group">
                 <Search className="w-4 h-4 absolute left-6 top-1/2 -translate-y-1/2 text-p-slate group-focus-within:text-p-indigo transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search..." 
                   className="p-text-field h-14 pl-14 rounded-2xl bg-p-bg/40 border-none font-black font-outfit text-sm"
                   value={catSearch}
                   onChange={(e) => setCatSearch(e.target.value)}
                 />
              </div>

              <div className="grid grid-cols-4 gap-4 max-h-[250px] overflow-y-auto no-scrollbar pr-1 pt-2">
                 {filteredCategories.map((c) => (
                    <button 
                      key={c.id} 
                      type="button"
                      onClick={() => handleCatToggle(c.name)}
                      className="flex flex-col items-center gap-3 group"
                    >
                       <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                         selectedCats.includes(c.name) ? 'bg-p-indigo text-white shadow-xl scale-110' : 'bg-[#fffbeb] text-p-charcoal hover:bg-[#fef3c7] hover:scale-105'
                       }`}>
                          <c.icon className="w-5 h-5 shadow-sm" />
                       </div>
                       <span className={`text-[9px] font-black uppercase tracking-tight text-center leading-tight ${selectedCats.includes(c.name) ? 'text-p-indigo' : 'text-p-slate'}`}>
                          {c.name}
                       </span>
                    </button>
                 ))}
                 <button type="button" className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-p-bg rounded-full flex items-center justify-center text-p-slate border-2 border-dashed border-p-bg">
                       <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-tight text-p-slate leading-tight">Other</span>
                 </button>
              </div>
           </div>

           <div className="space-y-4 pt-6 border-t border-p-bg">
              <div className="flex justify-between items-center">
                 <label className="text-[10px] font-black text-p-slate uppercase tracking-[0.2em] flex items-center gap-2">
                   <FileText className="w-4 h-4 text-p-indigo" /> More Details
                 </label>
                 <button type="button" onClick={() => handleVoiceTrigger('description')} className="p-3.5 bg-p-bg rounded-[1.2rem] text-p-indigo hover:bg-p-indigo hover:text-white transition-all active:scale-90 shadow-sm">
                    <Mic className="w-4 h-4" />
                 </button>
              </div>
              <textarea rows={5} placeholder="Color, size, or material..." className="p-text-field bg-p-bg/40 h-auto py-8 px-8 rounded-[2.5rem] font-medium leading-relaxed resize-none border-transparent focus:bg-white shadow-inner" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
           </div>
        </div>

        {/* Simplified Action Controller */}
        <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-3xl border-t border-p-bg z-30 flex justify-center">
          <button
            disabled={loading || success}
            className={`w-full max-w-sm h-18 flex items-center justify-center gap-4 rounded-[3rem] font-black uppercase tracking-[0.3em] transition-all active:scale-95 shadow-2xl text-base ${
              success ? 'bg-p-success text-white' : 'p-button-primary'
            }`}
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
            ) : success ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> It's Live!
              </motion.div>
            ) : (
              'Post Item'
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] font-black text-p-slate uppercase tracking-[0.4em] opacity-30 pb-10">
           <Zap className="w-3.5 h-3.5 text-p-indigo fill-p-indigo" /> Proudly Made for Bharat
        </div>

      </form>
    </div>
  );
}
