'use client';

import { motion } from 'framer-motion';
import { Package, Plus, Search, ChevronRight, IndianRupee, ImageOff } from 'lucide-react';
import Link from 'next/link';

export default function InventoryPage() {
  const products = [
    { id: '1', name: 'Chocolate Truffle Cake', price: 450, stock: 12, category: 'Bakery' },
    { id: '2', name: 'Apple Pie (Box of 4)', price: 280, stock: 5, category: 'Bakery' },
    { id: '3', name: 'Butter Cookies (500g)', price: 150, stock: 24, category: 'Bakery' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-p-bg pb-24">
      {/* Polaris Header */}
      <header className="px-6 py-8 bg-white border-b border-p-bg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-p-charcoal font-inter">Inventory</h1>
          <Link href="/dashboard/create" className="p-button-primary h-10 px-4 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="p-text-field pl-10"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-p-slate group-focus-within:text-p-indigo" />
        </div>
      </header>

      {/* Product List */}
      <main className="p-6 space-y-4">
        {products.map((product) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-card flex items-center gap-4 hover:border-p-indigo transition-all group"
          >
             <div className="w-16 h-16 bg-p-indigo-light rounded-lg flex items-center justify-center text-p-indigo/40 aspect-square overflow-hidden">
                <ImageOff className="w-6 h-6" />
             </div>
             
             <div className="flex-1 min-w-0">
               <h3 className="text-sm font-bold text-p-charcoal truncate">{product.name}</h3>
               <p className="text-[10px] text-p-slate font-medium uppercase tracking-wider mb-1">{product.category}</p>
               <p className="text-sm font-bold text-p-charcoal border-none p-0 inline-flex items-center gap-0.5">
                 <IndianRupee className="w-3 h-3" /> {product.price}
               </p>
             </div>

             <div className="text-right">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  product.stock > 10 ? 'bg-p-success/10 text-p-success' : 'bg-amber-100 text-amber-700'
                }`}>
                  {product.stock} in stock
                </span>
                <ChevronRight className="w-4 h-4 text-p-bg group-hover:text-p-indigo transition-all mt-2 ml-auto" />
             </div>
          </motion.div>
        ))}

        <div className="p-12 text-center text-p-slate">
           <Package className="w-12 h-12 mx-auto mb-4 opacity-10" />
           <p className="text-sm font-medium">You reached the end of the list.</p>
        </div>
      </main>
    </div>
  );
}
