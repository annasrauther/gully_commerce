import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getProductBySlug } from '@/lib/products';
import CheckoutForm from '@/components/CheckoutForm';
import { ChevronLeft, ShieldCheck, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CheckoutPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-gully-bg shadow-xl">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* WhatsApp Style Profile Header */}
      <div className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-wa-dark text-white shadow-md">
        <div className="flex items-center gap-3">
          <Link href={`/p/${slug}`} className="p-1 -ml-1 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-white/10">
              <Image 
                src="/static/logo.png" 
                alt="Store" 
                fill 
                className="object-contain p-1 invert brightness-0"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-wa-green border-2 border-wa-dark rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none">Order Details</span>
              <span className="text-[10px] text-wa-green font-medium mt-0.5">Typing...</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <ShieldCheck className="w-5 h-5 text-wa-green" />
        </div>
      </div>

      {/* Mini Summary Card */}
      <div className="px-6 py-8">
        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-soft flex items-center gap-4">
          <div className="w-20 h-20 relative bg-slate-50 rounded-[1.5rem] overflow-hidden border border-slate-100 flex-shrink-0">
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col flex-1 gap-1">
            <div className="flex items-center gap-1.5 opacity-60">
              <ShoppingBag className="w-3 h-3 text-gully-blue" />
              <span className="text-[10px] font-black uppercase tracking-widest">Order Summary</span>
            </div>
            <h2 className="text-xl font-black text-gully-text leading-tight line-clamp-1">{product.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-black text-gully-blue">₹{product.price}</span>
              <span className="bg-slate-50 px-2 py-0.5 rounded text-[8px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">All Taxes Incl.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Ticker */}
      <div className="mx-6 px-4 py-3 bg-gully-green/5 border border-gully-green/10 rounded-2xl flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gully-green/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-gully-green" />
        </div>
        <p className="text-[10px] font-bold text-gully-green leading-tight uppercase tracking-wider">
          Gully Escrow is guarding your payment. No risk, full safety.
        </p>
      </div>

      {/* Form Section */}
      <CheckoutForm product={product} />
    </div>
  );
}
