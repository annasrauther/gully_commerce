'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  ShoppingBag, 
  ChevronRight, 
  CheckCircle2, 
  MoreVertical,
  Inbox,
  X,
  Phone,
  IndianRupee,
  LogOut,
  Settings,
  User,
  Zap,
  ExternalLink
} from 'lucide-react';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

interface Order {
  id: string;
  customer: string;
  phone: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'shipped';
  items: OrderItem[];
}

const MOCK_ORDERS: Order[] = [
  { 
    id: 'ORD-8921', 
    customer: 'Rohan Sharma', 
    phone: '+91 98200 12345',
    date: 'Today, 2:45 PM', 
    amount: 450, 
    status: 'paid',
    items: [{ id: '1', name: 'Fresh Milk 1L', price: 65, qty: 2 }, { id: '2', name: 'Brown Bread', price: 45, qty: 1 }]
  },
  { 
    id: 'ORD-8920', 
    customer: 'Priya Verma', 
    phone: '+91 91234 56789',
    date: 'Today, 11:30 AM', 
    amount: 1200, 
    status: 'pending',
    items: [{ id: '3', name: 'Assorted Mithai Box', price: 900, qty: 1 }, { id: '4', name: 'Samosa (4pc)', price: 80, qty: 1 }]
  },
  { 
    id: 'ORD-8919', 
    customer: 'Amit Gupta', 
    phone: '+91 90000 88888',
    date: 'Yesterday', 
    amount: 890, 
    status: 'paid',
    items: [{ id: '5', name: 'Paneer 500g', price: 250, qty: 2 }]
  },
];

export default function OrdersPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('gully_mock_session');
    router.push('/login');
  };

  const filteredOrders = useMemo(() => MOCK_ORDERS.filter(o => {
    const matchesSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || 
                         o.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || o.status === filter;
    return matchesSearch && matchesFilter;
  }), [search, filter]);

  const stats = useMemo(() => ({
    all: MOCK_ORDERS.length,
    paid: MOCK_ORDERS.filter(o => o.status === 'paid').length,
    pending: MOCK_ORDERS.filter(o => o.status === 'pending').length
  }), []);

  return (
    <div className="flex flex-col min-h-screen bg-p-bg pb-24 font-inter relative overflow-x-hidden">
      
      {/* 1. Frictionless Universal Header */}
      <header className="px-6 py-8 bg-white border-b border-p-bg sticky top-0 z-[40] shadow-sm shadow-p-charcoal/5">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-3 bg-p-bg rounded-2xl active:scale-95 transition-all text-p-slate hover:text-p-indigo">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-black text-p-charcoal font-outfit tracking-tighter">Orders</h1>
           </div>

           <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-3 bg-p-bg rounded-2xl active:scale-95 transition-all text-p-slate">
                <MoreVertical className="w-6 h-6" />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-p-bg p-3 z-50 ring-1 ring-p-charcoal/5">
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
        
        {/* Optimized Search with Bharat-Simple labels */}
        <div className="space-y-4">
           <div className="relative group">
              <Search className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-p-slate group-focus-within:text-p-indigo transition-colors" />
              <input 
                type="text"
                placeholder="Find customer..."
                className="p-text-field pl-16 h-16 text-base font-black bg-p-bg/50 border-none rounded-[1.5rem] focus:bg-white shadow-inner"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           
           <div className="flex gap-2 bg-p-bg p-1.5 rounded-2xl">
              {(['all', 'paid', 'pending'] as const).map((f) => (
                <button 
                   key={f}
                   onClick={() => setFilter(f)}
                   className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all flex flex-col items-center gap-0.5 ${filter === f ? 'bg-white shadow-sm text-p-indigo' : 'text-p-slate hover:text-p-charcoal'}`}
                >
                   <span>{f}</span>
                   <span className="opacity-40 text-[8px]">{stats[f]}</span>
                </button>
              ))}
           </div>
        </div>
      </header>

      {/* 2. Zero-Friction Order List */}
      <main className="flex-1 px-4 mt-10 space-y-6">
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order, i) => (
               <motion.div
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.05 }}
                 key={order.id}
                 className="bg-white border-none shadow-sm flex flex-col p-6 rounded-[3rem] active:scale-[0.98] transition-all relative group"
               >
                  <div className="flex items-center justify-between mb-6" onClick={() => setSelectedOrder(order)}>
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-3xl flex items-center justify-center ${
                        order.status === 'paid' ? 'bg-p-success/10 text-p-success' : 
                        order.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-p-indigo/10 text-p-indigo'
                      } shadow-inner`}>
                         <ShoppingBag className="w-7 h-7" />
                      </div>
                      <div>
                         <h3 className="text-lg font-black text-p-charcoal font-outfit leading-none tracking-tighter">{order.customer}</h3>
                         <p className="text-[10px] font-black text-p-slate uppercase tracking-widest mt-1.5">{order.id} • {order.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xl font-black text-p-charcoal font-outfit tracking-tighter">₹{order.amount.toLocaleString()}</p>
                       <div className="flex items-center justify-end gap-1.5 mt-1">
                          <div className={`w-2 h-2 rounded-full ${order.status === 'paid' ? 'bg-p-success' : order.status === 'pending' ? 'bg-amber-500' : 'bg-p-indigo'}`} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-p-slate">{order.status}</span>
                       </div>
                    </div>
                  </div>

                  {/* PRO-BHARAT Frictionless Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-6 border-t border-p-bg border-dashed">
                      <a href={`tel:${order.phone.replace(/\s+/g, '')}`} className="flex items-center justify-center gap-2 h-14 bg-p-bg rounded-[1.5rem] text-p-indigo text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all">
                         <Phone className="w-4 h-4" /> Call Client
                      </a>
                      <button className="flex items-center justify-center gap-2 h-14 bg-p-indigo text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-p-indigo/20">
                         {order.status === 'pending' ? 'Mark Paid' : 'Fulfill'} <ChevronRight className="w-4 h-4" />
                      </button>
                  </div>
               </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center text-center opacity-30">
             <Inbox className="w-20 h-20 mb-6" />
             <p className="font-outfit font-black text-2xl tracking-tight">No orders yet</p>
             <p className="text-xs font-black uppercase tracking-widest px-10 leading-relaxed mt-2">Try checking other tabs</p>
          </div>
        )}
      </main>

      {/* Simplified Help Context */}
      <div className="flex items-center justify-center gap-2 text-[10px] font-black text-p-slate uppercase tracking-[0.4em] opacity-30 py-16">
         <Zap className="w-3.5 h-3.5 text-p-indigo fill-p-indigo" /> Gully Lightning Orders Active
      </div>

      <AnimatePresence>
         {selectedOrder && (
           <>
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-p-charcoal/40 backdrop-blur-sm z-[100]" />
             <motion.div 
               initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[4rem] z-[101] p-10 pb-12 shadow-[0_-15px_60px_rgba(0,0,0,0.1)] font-inter"
             >
                <div className="flex justify-between items-start mb-10">
                   <div>
                      <span className="p-badge-success bg-p-indigo/10 text-p-indigo mb-3">Order Receipt</span>
                      <h2 className="text-4xl font-black text-p-charcoal font-outfit tracking-tighter leading-none">{selectedOrder.id}</h2>
                      <p className="text-sm font-bold text-p-slate mt-3 italic tracking-tight">{selectedOrder.date}</p>
                   </div>
                   <button onClick={() => setSelectedOrder(null)} className="p-3 bg-p-bg rounded-2xl hover:bg-p-indigo-light transition-all">
                      <X className="w-7 h-7 text-p-charcoal" />
                   </button>
                </div>

                <div className="space-y-8">
                   <div className="p-card bg-p-bg/50 border-none space-y-6 rounded-[2.5rem] p-8">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-5">
                            <div className="p-3.5 bg-white rounded-2xl text-p-indigo shadow-sm"><Phone className="w-5 h-5" /></div>
                            <div>
                               <p className="text-[10px] font-black text-p-slate uppercase tracking-widest block leading-none mb-1.5">Phone Number</p>
                               <p className="text-base font-black text-p-charcoal">{selectedOrder.phone}</p>
                            </div>
                         </div>
                         <a href={`tel:${selectedOrder.phone}`} className="p-3 bg-p-indigo text-white rounded-2xl"><Phone className="w-4 h-4 shadow-sm" /></a>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h3 className="text-xs font-black text-p-charcoal uppercase tracking-[0.25em] px-1">Items in this order</h3>
                      <div className="space-y-2 max-h-[250px] overflow-y-auto no-scrollbar pr-1">
                         {selectedOrder.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center py-6 border-b border-p-bg border-dashed">
                               <div>
                                  <p className="font-black text-p-charcoal font-outfit text-lg leading-none mb-1.5">{item.name}</p>
                                  <p className="text-xs font-bold text-p-slate">Qty: {item.qty} × ₹{item.price}</p>
                               </div>
                               <p className="font-black text-p-charcoal font-outfit tracking-tighter text-lg">₹{item.qty * item.price}</p>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="flex justify-between items-end pt-8">
                      <div>
                         <p className="text-[11px] font-black text-p-slate uppercase tracking-widest">Grand Total</p>
                         <p className="text-5xl font-black text-p-charcoal font-outfit tracking-tighter mt-2 flex items-center gap-1.5">
                            <IndianRupee className="w-8 h-8 opacity-40" />{selectedOrder.amount.toLocaleString()}
                         </p>
                      </div>
                      <button className="p-button-primary h-18 px-10 rounded-[2rem] shadow-2xl shadow-p-indigo/10 flex items-center justify-center gap-3 text-sm font-black uppercase tracking-[0.2em]">
                         Post Status <ExternalLink className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             </motion.div>
           </>
         )}
      </AnimatePresence>
    </div>
  );
}
