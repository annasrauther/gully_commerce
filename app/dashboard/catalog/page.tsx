'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  ShoppingBag, 
  Zap, 
  Plus,
  CheckCircle2,
  Filter,
  Star,
  ArrowUpRight,
  TrendingUp,
  Tag,
  ChevronRight
} from 'lucide-react';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CATALOG_PRODUCTS = [
  { id: 'c1', name: 'Cotton Silk Saree', price: 1200, margin: 400, rating: 4.8, sold: '2.5k+', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400', cat: 'Fashion' },
  { id: 'c2', name: 'Redmi Note 12 Pro', price: 18500, margin: 1500, rating: 4.9, sold: '10k+', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', cat: 'Mobiles' },
  { id: 'c3', name: 'Matte Lipstick Set', price: 850, margin: 300, rating: 4.7, sold: '5k+', image: 'https://images.unsplash.com/photo-1586776193737-ef866a9db9f5?w=400', cat: 'Beauty' },
  { id: 'c4', name: 'Bluetooth Earbuds', price: 1499, margin: 600, rating: 4.6, sold: '8k+', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', cat: 'Electronics' },
  { id: 'c5', name: 'Leather Handbag', price: 2200, margin: 800, rating: 4.9, sold: '1.2k+', image: 'https://images.unsplash.com/photo-1584917033904-490333be288a?w=400', cat: 'Fashion' },
  { id: 'c6', name: 'Smart Watch Z9', price: 3500, margin: 1000, rating: 4.5, sold: '3k+', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', cat: 'Electronics' },
];

export default function CatalogPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [addedItems, setAddedItems] = useState<string[]>([]);

  const filtered = useMemo(() => CATALOG_PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCat === 'All' || p.cat === activeCat;
    return matchesSearch && matchesCat;
  }), [search, activeCat]);

  const handleAdd = (id: string) => {
    setAddedItems([...addedItems, id]);
    setTimeout(() => {
       // Mock logic: after adding, could redirect or show success
    }, 1000);
  };

  const categories = ['All', 'Fashion', 'Mobiles', 'Beauty', 'Electronics', 'Home'];

  return (
    <div className="flex flex-col min-h-screen bg-p-bg pb-24 font-inter relative overflow-x-hidden">
      
      {/* 1. Catalog Header */}
      <header className="px-6 py-8 bg-white border-b border-p-bg sticky top-0 z-[40] shadow-sm shadow-p-charcoal/5">
        <div className="flex items-center gap-4 mb-8">
           <Link href="/dashboard" className="p-3 bg-p-bg rounded-2xl active:scale-95 transition-all text-p-slate hover:text-p-indigo">
             <ArrowLeft className="w-6 h-6" />
           </Link>
           <h1 className="text-2xl font-black text-p-charcoal font-outfit tracking-tighter">Product Catalog</h1>
        </div>

        <div className="space-y-6">
           <div className="relative group">
              <Search className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-p-slate group-focus-within:text-p-indigo transition-colors" />
              <input 
                type="text"
                placeholder="Search products to sell..."
                className="p-text-field pl-16 h-16 text-base font-black bg-p-bg/50 border-none rounded-[1.5rem] focus:bg-white shadow-inner"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>

           <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map(cat => (
                 <button 
                   key={cat}
                   onClick={() => setActiveCat(cat)}
                   className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border ${
                     activeCat === cat ? 'bg-p-indigo text-white border-p-indigo' : 'bg-white text-p-slate border-p-bg hover:border-p-indigo/30'
                   }`}
                 >
                    {cat}
                 </button>
              ))}
           </div>
        </div>
      </header>

      {/* 2. Product Discovery Grid */}
      <main className="flex-1 px-4 mt-8">
         <div className="grid grid-cols-1 gap-6">
            {filtered.map((product, i) => (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.05 }}
                 key={product.id} 
                 className="bg-white rounded-[3.5rem] overflow-hidden shadow-sm border border-p-bg relative group"
               >
                  <div className="aspect-[4/3] bg-p-bg overflow-hidden relative">
                     <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                     <div className="absolute top-6 left-6 flex gap-2">
                        <span className="p-badge-success bg-white/90 backdrop-blur-md text-p-indigo flex items-center gap-1.5 shadow-xl">
                          <TrendingUp className="w-3 h-3" /> Ready to Sell
                        </span>
                     </div>
                     <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/80 backdrop-blur-xl rounded-[2rem] flex items-center justify-between border border-white/20 shadow-2xl">
                        <div>
                           <p className="text-[10px] font-black text-p-indigo uppercase tracking-widest leading-none mb-1.5">You Earn (Each Sell)</p>
                           <p className="text-xl font-black text-p-charcoal font-outfit tracking-tighter">₹{product.margin} Profit</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-p-slate uppercase tracking-widest leading-none mb-1.5">Cost</p>
                           <p className="text-sm font-black text-p-charcoal font-outfit tracking-tighter opacity-40 italic">₹{product.price}</p>
                        </div>
                     </div>
                  </div>

                  <div className="p-8 space-y-6">
                     <div className="flex justify-between items-start">
                        <div>
                           <h3 className="text-xl font-black text-p-charcoal font-outfit tracking-tight leading-tight mb-2">{product.name}</h3>
                           <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 text-amber-500">
                                 <Star className="w-4 h-4 fill-amber-500" />
                                 <span className="text-xs font-black">{product.rating}</span>
                              </div>
                              <span className="text-[10px] font-black text-p-slate uppercase tracking-widest opacity-50">{product.sold} Sold</span>
                           </div>
                        </div>
                        <button className="p-3 bg-p-bg rounded-2xl text-p-slate hover:text-p-indigo hover:bg-p-indigo-light active:scale-95 transition-all">
                           <ChevronRight className="w-6 h-6" />
                        </button>
                     </div>

                     <button 
                       onClick={() => handleAdd(product.id)}
                       disabled={addedItems.includes(product.id)}
                       className={`w-full h-16 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 ${
                         addedItems.includes(product.id) ? 'bg-p-success text-white' : 'p-button-primary'
                       }`}
                     >
                        {addedItems.includes(product.id) ? (
                           <><CheckCircle2 className="w-5 h-5" /> Added to Your Store</>
                        ) : (
                           <>Add to Store <Plus className="w-5 h-5 text-white/50" /></>
                        )}
                     </button>
                  </div>
               </motion.div>
            ))}
         </div>

         {filtered.length === 0 && (
            <div className="py-24 text-center opacity-30">
               <ShoppingBag className="w-20 h-20 mx-auto mb-6" />
               <p className="font-outfit font-black text-2xl tracking-tighter">No items found</p>
               <p className="text-xs font-black uppercase tracking-widest mt-2 px-10 leading-relaxed">Try searching for Saree, Phone or Fashion</p>
            </div>
         )}

         <div className="flex items-center justify-center gap-2 text-[10px] font-black text-p-slate uppercase tracking-[0.4em] opacity-30 py-16">
            <Zap className="w-3.5 h-3.5 text-p-indigo fill-p-indigo" /> Catalog sourcing active
         </div>
      </main>

    </div>
  );
}
