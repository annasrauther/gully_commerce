'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Settings, 
  MapPin, 
  Bell, 
  Globe, 
  Smartphone, 
  Store, 
  CheckCircle2, 
  ChevronRight, 
  Save,
  Navigation,
  ExternalLink,
  Users,
  Search
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'location' | 'notifications'>('general');
  const [loading, setLoading] = useState(false);
  const [pincode, setPincode] = useState('');
  const [locationDetails, setLocationDetails] = useState<any>(null);
  const [radius, setRadius] = useState(5);
  const [saved, setSaved] = useState(false);

  // Mock Pincode Fetch
  const handlePincodeChange = async (val: string) => {
    setPincode(val);
    if (val.length === 6) {
       setLoading(true);
       setTimeout(() => {
          setLocationDetails({
             city: 'Mumbai',
             state: 'Maharashtra',
             area: 'Lower Parel'
          });
          setLoading(false);
       }, 800);
    } else {
       setLocationDetails(null);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'general', label: 'Store Profile', icon: Store },
    { id: 'location', label: 'Delivery & Zone', icon: MapPin },
    { id: 'notifications', label: 'Order Alerts', icon: Bell }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-p-bg pb-24 font-inter">
      <header className="px-6 py-8 bg-white border-b border-p-bg sticky top-0 z-[40]">
        <div className="flex items-center gap-4 mb-8">
           <Link href="/dashboard" className="p-3 bg-p-bg rounded-2xl active:scale-95 transition-all">
             <ArrowLeft className="w-6 h-6 text-p-charcoal" />
           </Link>
           <h1 className="text-2xl font-black text-p-charcoal font-outfit tracking-tighter">Store Config</h1>
        </div>

        <div className="flex bg-p-bg p-1 rounded-2xl overflow-x-auto no-scrollbar">
           {tabs.map((t) => (
              <button 
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-white shadow-sm text-p-indigo' : 'text-p-slate hover:text-p-charcoal'}`}
              >
                <t.icon className="w-3.5 h-3.5" /> {t.label}
              </button>
           ))}
        </div>
      </header>

      <main className="flex-1 px-6 mt-10 space-y-8">
        
        <AnimatePresence mode="wait">
          {activeTab === 'general' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
               <div className="p-card border-none bg-white space-y-6 rounded-[2.5rem]">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-p-slate uppercase tracking-widest block ml-1">Store Display Name</label>
                     <input type="text" placeholder="e.g. Gully Bakery" className="p-text-field h-12 rounded-2xl" defaultValue="Gully Bakery" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-p-slate uppercase tracking-widest block ml-1">Merchant Category</label>
                     <select className="p-text-field h-12 rounded-2xl appearance-none bg-white font-bold">
                        <option>Apparel & Fashion</option>
                        <option selected>Bakery & Sweets</option>
                        <option>Grocery & Mart</option>
                        <option>Furniture & Decor</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-p-slate uppercase tracking-widest block ml-1">Preferred Language</label>
                     <div className="flex bg-p-bg p-1 rounded-2xl">
                        <button className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl bg-white shadow-sm text-p-indigo">English (Portal)</button>
                        <button className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl text-p-slate">Hindi (हिन्दी)</button>
                     </div>
                  </div>
               </div>

               <div className="p-card bg-p-indigo/5 border-p-indigo/10 flex items-center justify-between rounded-[2.5rem] p-6">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-white rounded-2xl text-p-indigo shadow-sm"><Globe className="w-5 h-5" /></div>
                     <div>
                        <p className="font-black text-p-charcoal font-outfit text-sm">Store Visibility</p>
                        <p className="text-[11px] font-medium text-p-slate">Searchable on Google & WhatsApp</p>
                     </div>
                  </div>
                  <div className="w-12 h-6 bg-p-indigo rounded-full p-1 flex justify-end transition-all">
                     <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'location' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
               <div className="p-card border-none bg-white space-y-6 rounded-[2.5rem]">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-p-slate uppercase tracking-widest block ml-1 font-inter">Merchant Pincode</label>
                     <div className="relative">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-p-slate" />
                        <input 
                          type="tel" 
                          maxLength={6} 
                          placeholder="400013" 
                          className="p-text-field h-12 pl-12 rounded-2xl font-black text-lg tracking-widest" 
                          value={pincode}
                          onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, ''))}
                        />
                        {loading && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-p-indigo border-t-transparent rounded-full animate-spin" />}
                     </div>
                  </div>

                  {locationDetails && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-p-bg/50 rounded-3xl space-y-1 border border-p-bg">
                       <p className="text-[10px] font-black text-p-indigo uppercase tracking-widest">Auto-Resolved Location</p>
                       <p className="text-sm font-black text-p-charcoal font-outfit">{locationDetails.area}, {locationDetails.city}</p>
                       <p className="text-[11px] font-medium text-p-slate">{locationDetails.state}, India</p>
                    </motion.div>
                  )}

                  <div className="space-y-4">
                     <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-p-slate uppercase tracking-widest">Delivery Radius</label>
                        <span className="text-xs font-black text-p-indigo font-outfit">{radius} KM</span>
                     </div>
                     <input 
                       type="range" 
                       min={1} 
                       max={50} 
                       value={radius} 
                       onChange={(e) => setRadius(parseInt(e.target.value))}
                       className="w-full h-1.5 bg-p-bg rounded-full appearance-none cursor-pointer accent-p-indigo"
                     />
                     <div className="flex justify-between text-[10px] font-bold text-p-slate px-1">
                       <span>1 KM</span>
                       <span>25 KM</span>
                       <span>50 KM</span>
                     </div>
                  </div>
               </div>

               <div className="p-card bg-amber-50 border-amber-100 flex items-start gap-4 rounded-[2.5rem] p-6">
                  <div className="p-3 bg-white rounded-2xl text-amber-600 shadow-sm"><Navigation className="w-5 h-5" /></div>
                  <div>
                    <h3 className="text-sm font-black text-amber-900 font-outfit">Local Delivery Focus</h3>
                    <p className="text-[12px] font-medium text-amber-700/80 mt-1 leading-relaxed">Customers within {radius}km of {pincode || 'your location'} will see priority listings.</p>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
               <div className="p-card border-none bg-white rounded-[2.5rem] p-4 divide-y divide-p-bg">
                  {[
                    { title: 'WhatsApp Orders', sub: 'Instant alerts on your phone', icon: Smartphone, always: true },
                    { title: 'Payment Receipt', sub: 'PDF receipts after checkout', icon: Users, always: false },
                    { title: 'Store Activity', sub: 'Daily visitor summary', icon: Globe, always: false }
                  ].map((n) => (
                    <div key={n.title} className="flex items-center justify-between p-4 py-6">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-p-bg rounded-2xl flex items-center justify-center text-p-indigo"><n.icon className="w-5 h-5" /></div>
                         <div>
                            <p className="text-sm font-black text-p-charcoal font-outfit leading-tight">{n.title}</p>
                            <p className="text-[11px] font-medium text-p-slate mt-0.5">{n.sub}</p>
                         </div>
                       </div>
                       <div className={`w-12 h-6 rounded-full p-1 flex transition-all ${n.always ? 'bg-p-indigo justify-end' : 'bg-p-bg justify-start overflow-hidden'}`}>
                          <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Floating Save Bar */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-p-bg z-50 flex justify-center">
         <motion.button 
           whileTap={{ scale: 0.95 }}
           onClick={handleSave}
           className={`p-button-primary h-14 w-full max-w-sm rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 transition-all ${saved ? 'bg-p-success border-p-success' : ''}`}
         >
           {saved ? (
             <><CheckCircle2 className="w-5 h-5" /> All Saved!</>
           ) : (
             <><Save className="w-5 h-5" /> Save Changes</>
           )}
         </motion.button>
      </footer>
    </div>
  );
}
