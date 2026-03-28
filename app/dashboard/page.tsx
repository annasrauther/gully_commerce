'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MoreVertical, 
  Search, 
  Package, 
  ChevronRight,
  LogOut,
  Settings,
  User,
  Smartphone,
  Mic,
  ShoppingBag,
  TrendingUp,
  Activity,
  History,
  Target
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d'>('today');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ 
    sales: 0, 
    orders: 0, 
    visits: 842, 
    conversion: 3.2,
    aov: 0,
    growth: 14.2,
    storeName: 'Loading...' 
  });
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        // 1. Get Store Details
        const { data: store } = await supabase
          .from('stores')
          .select('*')
          .eq('seller_id', user.id)
          .single();

        if (!store) {
          router.push('/onboarding');
          return;
        }

        // 2. Get Orders
        const { data: orders } = await supabase
          .from('orders')
          .select('*')
          .eq('store_id', store.id);

        const totalSales = orders?.reduce((acc, o) => acc + Number(o.total_amount), 0) || 0;
        const totalOrders = orders?.length || 0;
        const aov = totalOrders > 0 ? (totalSales / totalOrders) : 0;

        // 3. Get Products
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', store.id)
          .limit(3);

        setMetrics({
          ...metrics,
          sales: totalSales,
          orders: totalOrders,
          aov: Math.round(aov),
          storeName: store.name
        });
        
        setTrendingProducts(products || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [timeRange, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('gully_mock_session');
    router.push('/login');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-p-bg">
      <div className="w-12 h-12 border-4 border-p-indigo border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-p-bg pb-24 font-inter text-p-charcoal">
      {/* 1. Header: Branding & Navigation */}
      <header className="px-6 py-8 bg-white border-b border-p-bg sticky top-0 z-[40] shadow-sm shadow-p-charcoal/5">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-p-indigo rounded-2xl flex items-center justify-center shadow-lg shadow-p-indigo/20">
                 <Smartphone className="w-6 h-6 text-white" />
              </div>
              <span className="font-outfit font-black text-xl tracking-tighter text-p-charcoal">Gully Commerce</span>
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
                        <User className="w-4 h-4 text-p-indigo" /> <span className="text-sm font-black uppercase tracking-widest text-p-charcoal">Profile</span>
                     </Link>
                     <Link href="/dashboard/settings" className="flex items-center gap-3 p-4 hover:bg-p-bg rounded-2xl transition-all">
                        <Settings className="w-4 h-4 text-p-indigo" /> <span className="text-sm font-black uppercase tracking-widest text-p-charcoal">Settings</span>
                     </Link>
                     <div className="h-px bg-p-bg my-2 mx-2" />
                     <button onClick={handleLogout} className="flex items-center gap-3 p-4 hover:bg-p-critical/5 text-p-critical rounded-2xl w-full transition-all">
                        <LogOut className="w-4 h-4" /> <span className="text-sm font-black uppercase tracking-widest">Logout</span>
                     </button>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        <div className="flex items-end justify-between">
           <div>
              <p className="text-[11px] font-black text-p-slate uppercase tracking-[0.2em] mb-1">Merchant Insights</p>
              <h1 className="text-3xl font-black text-p-charcoal font-outfit tracking-tighter">Overall Performance</h1>
           </div>
           <div className="flex bg-p-bg p-1.5 rounded-2xl">
              {['today', '7d', '30d'].map((r) => (
                <button 
                  key={r}
                  onClick={() => setTimeRange(r as any)}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${timeRange === r ? 'bg-white shadow-sm text-p-indigo' : 'text-p-slate hover:text-p-charcoal'}`}
                >
                  {r}
                </button>
              ))}
           </div>
        </div>
      </header>

      <main className="flex-1 px-4 mt-8 space-y-8">
        
        {/* Real-time Business Pulse */}
        <div className="bg-p-indigo rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-p-indigo/30">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <Activity className="w-6 h-6 text-white" />
                 </div>
                 <div>
                    <h2 className="text-sm font-black uppercase tracking-widest font-outfit opacity-80">Live Traffic</h2>
                    <p className="text-3xl font-black font-outfit tracking-tighter mt-0.5">24 Active Sessions</p>
                 </div>
              </div>
              <div className="flex -space-x-3">
                 {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-p-indigo bg-p-bg/20 backdrop-blur-sm" />)}
                 <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">+21</div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-white/10 rounded-3xl backdrop-blur-md">
                 <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Growth Index</p>
                 <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-black font-outfit">+{metrics.growth}%</p>
                    <TrendingUp className="w-4 h-4 text-p-success" />
                 </div>
              </div>
              <div className="p-5 bg-white/10 rounded-3xl backdrop-blur-md">
                 <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Avg Order Val.</p>
                 <p className="text-2xl font-black font-outfit">₹{metrics.aov}</p>
              </div>
           </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
           {[
             { label: 'Net Sales', val: `₹${metrics.sales.toLocaleString()}`, icon: TrendingUp, color: 'text-p-success' },
             { label: 'Total Orders', val: metrics.orders, icon: ShoppingBag, color: 'text-p-indigo' },
             { label: 'Conversion', val: `${metrics.conversion}%`, icon: Target, color: 'text-p-slate' },
             { label: 'Store Units', val: '152', icon: Package, color: 'text-cyan-500' }
           ].map((stat, i) => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={stat.label} 
                className="p-card border-none bg-white shadow-sm flex flex-col justify-between p-6 rounded-[2.5rem] min-h-[160px]"
              >
                 <div className="w-10 h-10 bg-p-bg rounded-2xl flex items-center justify-center mb-4">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-p-slate uppercase tracking-widest mb-1 leading-none">{stat.label}</p>
                    <p className="text-2xl font-black text-p-charcoal font-outfit tracking-tighter">{stat.val}</p>
                 </div>
              </motion.div>
           ))}
        </div>

        {/* Trending Inventory: High Purpose Section */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-black text-p-charcoal uppercase tracking-[0.2em]">Top Performing Products</h2>
              <Link href="/dashboard/inventory" className="text-[10px] font-black uppercase tracking-widest text-p-indigo flex items-center gap-1.5 p-badge-success bg-p-indigo/5 border-p-indigo/10">
                Full Inventory <History className="w-3 h-3" />
              </Link>
           </div>
           
           <div className="space-y-4">
              {trendingProducts.map((product) => (
                 <div key={product.id} className="p-card border-none bg-white shadow-sm flex items-center justify-between p-5 rounded-[2.5rem] hover:bg-p-bg/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-5">
                       <div className="w-16 h-16 bg-p-bg rounded-3xl overflow-hidden relative shadow-inner">
                          <img src={product.image_url} className="w-full h-full object-cover" alt="" />
                       </div>
                       <div>
                          <h3 className="text-base font-black text-p-charcoal font-outfit tracking-tight leading-tight">{product.title}</h3>
                          <p className="text-[10px] font-black text-p-slate uppercase tracking-widest mt-0.5">₹{product.price} • {product.trend || '+5%'} today</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-black text-p-charcoal font-outfit tracking-tight">{product.sold || 0}</p>
                       <p className="text-[9px] font-black uppercase tracking-widest text-p-slate">Units Sold</p>
                    </div>
                 </div>
              ))}
           </div>
        </section>

        {/* Action Center */}
        <section className="space-y-6">
           <h2 className="text-xs font-black text-p-charcoal uppercase tracking-[0.2em] mb-2 px-1">Quick Actions</h2>
           <Link href="/dashboard/create" className="p-card border-none bg-white shadow-sm flex items-center gap-6 p-6 rounded-[3rem] group hover:bg-p-indigo transition-all duration-300">
              <div className="w-14 h-14 bg-p-indigo-light rounded-2xl flex items-center justify-center text-p-indigo group-hover:bg-white/20 group-hover:text-white transition-all shadow-md">
                 <Plus className="w-7 h-7" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xl font-black text-p-charcoal group-hover:text-white font-outfit tracking-tighter transition-colors leading-none mb-1.5">Add New Product</p>
                <p className="text-sm font-medium text-p-slate group-hover:text-white/70 transition-colors tracking-tight">Launch your next best-seller</p>
              </div>
              <ChevronRight className="w-5 h-5 text-p-bg group-hover:text-white transition-all" />
           </Link>

           <Link href="/dashboard/catalog" className="p-card border-none bg-white shadow-sm flex items-center gap-6 p-6 rounded-[3rem] group hover:bg-p-indigo transition-all duration-300">
              <div className="w-14 h-14 bg-p-bg rounded-2xl flex items-center justify-center text-p-indigo group-hover:bg-white/20 group-hover:text-white transition-all shadow-md">
                 <Search className="w-7 h-7" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xl font-black text-p-charcoal group-hover:text-white font-outfit tracking-tighter transition-colors leading-none mb-1.5">Search Products</p>
                <p className="text-sm font-medium text-p-slate group-hover:text-white/70 transition-colors tracking-tight">Pick & sell from our Catalog</p>
              </div>
              <ChevronRight className="w-5 h-5 text-p-bg group-hover:text-white transition-all" />
           </Link>
        </section>

      </main>
      
      {/* 4. Bottom Tab Bar (Mobile First) */}
      <footer className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-t border-p-bg z-50 flex items-center justify-around px-8">
        {[
          { label: 'Home', icon: Smartphone, active: true },
          { label: 'Shop', icon: ShoppingBag, active: false, href: '/p/my-store' },
          { label: 'Orders', icon: History, active: false, href: '/dashboard/orders' },
          { label: 'Mic', icon: Mic, active: false, special: true }
        ].map((item) => (
          <button 
            key={item.label}
            onClick={() => item.href && router.push(item.href)}
            className={`flex flex-col items-center gap-1.5 transition-all ${item.active ? 'text-p-indigo' : 'text-p-slate hover:text-p-charcoal'}`}
          >
            <div className={`p-2.5 rounded-2xl ${item.special ? 'bg-p-indigo text-white shadow-lg -mt-8 scale-110' : ''} ${item.active ? 'bg-p-indigo-light' : ''}`}>
              <item.icon className="w-5 h-5" />
            </div>
          </button>
        ))}
      </footer>
    </div>
  );
}
