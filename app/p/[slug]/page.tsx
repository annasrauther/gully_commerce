import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Smartphone, ShoppingCart, IndianRupee, MessageSquare, Share2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import GullyTracker from '@/lib/Tracker';

interface Product {
  id: string;
  name: string;
  price: number;
  storeName: string;
  description: string;
  image: string;
}

// Real data fetching function from Supabase
async function getProduct(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      stores (
        name
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.title,
    price: data.price,
    storeName: data.stores.name,
    description: data.description,
    image: data.image_url,
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} - ₹${product.price}`,
    description: `Click to buy from ${product.storeName} on Gully Commerce. No App Download Required.`,
    openGraph: {
      title: product.name,
      description: `Buy ${product.name} for ₹${product.price} at ${product.storeName}`,
      images: [{ url: product.image, width: 600, height: 600 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: `Buy ${product.name} for ₹${product.price} at ${product.storeName}`,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-p-bg">
      <GullyTracker event="store_visit" props={{ store_id: slug }} />
      <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-p-bg sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-p-indigo rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-p-charcoal tracking-tight font-inter">Gully Commerce</span>
        </Link>
        <div className="flex items-center gap-3">
          <button className="p-2 text-p-slate hover:bg-p-bg rounded-lg">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="bg-p-indigo-light p-2 rounded-lg text-p-indigo">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">
        <div className="max-w-2xl w-full">
          {/* Product Image Area */}
          <div className="relative aspect-square w-full bg-white border-b border-p-bg">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-4"
              priority
            />
            <div className="absolute bottom-4 left-4">
              <span className="p-badge-success flex items-center gap-1.5 shadow-sm">
                <MessageSquare className="w-3 h-3 fill-p-success text-p-success" /> Trusted Seller
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 bg-white space-y-8 pb-32">
            <div>
               <p className="text-[10px] font-bold text-p-indigo uppercase tracking-[0.2em] mb-2">{product.storeName}</p>
               <h1 className="text-3xl font-bold text-p-charcoal leading-tight font-inter mb-4">{product.name}</h1>
               <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-p-charcoal flex items-center gap-1">
                    <IndianRupee className="w-6 h-6" />{product.price}
                  </span>
                  <span className="text-sm font-medium text-p-slate line-through opacity-50">₹{(product.price * 1.2).toFixed(0)}</span>
               </div>
            </div>

            <div className="p-card bg-p-bg/50 border-none">
              <h2 className="text-xs font-bold text-p-charcoal uppercase tracking-widest mb-3">About this product</h2>
              <p className="text-p-slate text-sm font-medium leading-relaxed">
                {product.description}
              </p>
            </div>

            <section className="space-y-4">
              <h3 className="text-xs font-bold text-p-slate uppercase tracking-widest">Store Gurantee</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  "Pay securely on delivery or UPI",
                  "Direct support from the merchant",
                  "Verified quality & fresh guarantee"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-semibold text-p-charcoal">
                    <CheckCircle2 className="w-4 h-4 text-p-success" />
                    {benefit}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Checkout Bar */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-p-bg z-20 flex justify-center">
        <div className="max-w-2xl w-full">
          <Link href={`/checkout/${slug}`} className="p-button-primary h-14 w-full text-lg shadow-xl shadow-p-indigo/10 flex items-center justify-center gap-3">
            Buy Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </footer>
    </div>
  );
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  );
}
