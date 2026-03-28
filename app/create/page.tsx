'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mic, MapPin, CheckCircle, ArrowRight, ChevronLeft, Share2, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import WhatsAppPreview from '@/components/WhatsAppPreview';
import VoiceWaveform from '@/components/VoiceWaveform';

export default function CreateListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    images: [] as string[],
    title: '',
    price: '',
    description: '',
    radius: 'Within 5km',
  });
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdSlug, setCreatedSlug] = useState('');

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFormData({ ...formData, images: [...formData.images, url] });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    
    // @ts-expect-error - webkitSpeechRecognition is not in standard types
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome/Safari.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; 
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      setLoading(true);
    };

    recognition.onresult = (event: { results: unknown[][] }) => {
      const transcript = (event.results[0][0] as { transcript: string }).transcript;
      
      const priceMatch = transcript.match(/\d+/);
      const price = priceMatch ? priceMatch[0] : '';
      
      setFormData({
        ...formData,
        title: transcript.split(/for|at|priced|cost/i)[0].trim(),
        price: price,
        description: transcript,
      });
    };

    recognition.onerror = (event: { error: string }) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      setLoading(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setLoading(false);
    };

    recognition.start();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // 1. Get store ID
      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('seller_id', user.id)
        .single();

      if (!store) {
        router.push('/onboarding');
        return;
      }

      // 2. Upload Image to Supabase Storage if it's a blob URL
      let imageUrl = formData.images[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
      
      if (formData.images[0] && formData.images[0].startsWith('blob:')) {
        const response = await fetch(formData.images[0]);
        let blob = await response.blob();

        // High UX: Client-side compression
        if (blob.size > 1024 * 1024) { // > 1MB
           const img = new (window as any).Image();
           img.src = formData.images[0];
           await new Promise(resolve => img.onload = resolve);
           
           const canvas = document.createElement('canvas');
           const MAX_WIDTH = 1200;
           let width = img.width;
           let height = img.height;
           
           if (width > MAX_WIDTH) {
             height *= MAX_WIDTH / width;
             width = MAX_WIDTH;
           }
           
           canvas.width = width;
           canvas.height = height;
           const ctx = canvas.getContext('2d');
           ctx?.drawImage(img, 0, 0, width, height);
           
           const compressedBlob = await new Promise<Blob>((resolve) => {
             canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.8);
           });
           blob = compressedBlob;
        }

        const fileExt = blob.type.split('/')[1] || 'jpg';
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, blob, {
            contentType: blob.type,
            upsert: true
          });

        if (uploadError) {
          console.error('Upload Error:', uploadError);
          throw new Error('Failed to upload image. Make sure "product-images" bucket exists in Supabase.');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      // 3. Insert Product
      const slug = formData.title.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
      
      const { error } = await supabase
        .from('products')
        .insert({
          store_id: store.id,
          title: formData.title,
          price: Number(formData.price),
          description: formData.description,
          image_url: imageUrl,
          slug: slug,
        });

      if (error) throw error;

      setCreatedSlug(slug);
      setStep(4);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create listing';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-wa-bg shadow-xl overflow-x-hidden">
      {/* SaaS Progress Header */}
      <div className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-wa-dark text-white shadow-md">
        <div className="flex items-center gap-3">
          {step > 1 && step < 4 && (
            <button onClick={prevStep} className="p-1 -ml-1 hover:bg-white/10 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
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
              <h1 className="text-sm font-bold leading-none">
                {step === 4 ? 'Listing Live!' : 'Seller Wizard'}
              </h1>
              <span className="text-[10px] text-wa-green font-medium mt-0.5 tracking-tighter uppercase font-black">Powered by Gully AI</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-wa-green/10 text-wa-green px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border border-wa-green/20">
            Step {step}/3
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Visuals */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 flex flex-col gap-8"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-gully-text leading-tight">फोटो डालें • <br />Show your product</h2>
              <p className="text-slate-500 font-medium">Clear photos bring more orders. We optimize them for WhatsApp.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {formData.images.map((img, i) => (
                <motion.div
                  layoutId={`img-${i}`}
                  key={i}
                  className="aspect-square relative rounded-3xl overflow-hidden bg-white border-2 border-white shadow-soft"
                >
                  <Image src={img} fill className="object-cover" alt="Product" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full backdrop-blur-md"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
              {formData.images.length < 3 && (
                <label className="aspect-square flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-slate-300 bg-white/50 hover:bg-white transition-all cursor-pointer shadow-xs active:scale-95">
                  <div className="bg-gully-blue p-4 rounded-2xl shadow-lg shadow-gully-blue/20">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-[10px] font-black text-gully-blue uppercase tracking-widest mt-1">Photo लें</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>

            <div className="mt-auto pt-10">
              <button
                onClick={nextStep}
                disabled={formData.images.length === 0}
                className="btn-upi w-full group"
              >
                <span>आगे बढ़ें • Details</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 flex flex-col gap-6"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-gully-text leading-tight">विवरण • <br />Details</h2>
              <p className="text-slate-500 font-medium">Dictate in Hindi or English. AI will do the rest.</p>
            </div>

            {/* Premium Voice Input */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-premium border border-slate-100 flex flex-col gap-4">
              <VoiceWaveform isRecording={isRecording} />
              <button
                onClick={handleVoiceInput}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all ${isRecording
                    ? 'bg-red-50'
                    : 'bg-gully-green/10 active:scale-95'
                  }`}
              >
                <div className={`p-4 rounded-full ${isRecording ? 'bg-red-500 shadow-xl shadow-red-200' : 'bg-gully-green shadow-xl shadow-gully-green/20'} mb-2`}>
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isRecording ? 'text-red-600' : 'text-gully-green'}`}>
                  {isRecording ? 'AI Listening...' : 'बोलें • Tap to Speak'}
                </span>
              </button>
            </div>

            <WhatsAppPreview
              title={formData.title}
              price={formData.price}
              image={formData.images[0]}
            />

            {/* Thumb-Zone Inputs */}
            <div className="flex flex-col gap-4">
              <input
                placeholder="नाम • Product Title"
                className="thumb-zone-input font-bold"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <div className="flex items-center gap-2 thumb-zone-input focus-within:ring-2 focus-within:ring-gully-blue">
                <span className="font-bold text-slate-400">₹</span>
                <input
                  placeholder="कीमत • Price"
                  className="bg-transparent outline-none font-bold w-full"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>

            <button onClick={nextStep} disabled={!formData.title || !formData.price} className="btn-upi w-full mt-4">
              आगे बढ़ें • Next
              <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}

        {/* Step 3: Logistics */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 flex flex-col gap-6"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-gully-text leading-tight">डिलीवरी • <br />Logistics</h2>
              <p className="text-slate-500 font-medium">Where can you deliver this?</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {['Within 5km', 'Within 20km', 'Mumbai only', 'All India'].map((range) => (
                <button
                  key={range}
                  onClick={() => setFormData({ ...formData, radius: range })}
                  className={`p-5 rounded-3xl border-2 flex items-center justify-between font-black transition-all ${formData.radius === range
                      ? 'border-gully-blue bg-white text-gully-blue shadow-premium scale-[1.02]'
                      : 'border-white bg-white/50 text-slate-400 opacity-60'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${formData.radius === range ? 'bg-gully-blue text-white' : 'bg-slate-100 text-slate-300'}`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    {range}
                  </div>
                  {formData.radius === range && (
                    <div className="bg-gully-green p-1.5 rounded-full shadow-lg">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8 bg-gully-blue/5 p-6 rounded-[2.5rem] border border-gully-blue/10 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gully-gold" />
                <span className="font-black text-gully-blue text-sm uppercase tracking-widest">SaaS Insight</span>
              </div>
              <p className="text-xs text-gully-blue/70 leading-relaxed font-bold indic-text">
                Seller radius matters! <span className="text-gully-blue underline italic">&quot;Mumbai only&quot;</span> listing links convert 40% higher in local residential groups.
              </p>
            </div>

            <button onClick={handleSubmit} disabled={loading} className="btn-upi w-full mt-auto">
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                <>
                  Launch Listing • शुरू करें
                  <CheckCircle className="w-6 h-6" />
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 flex flex-col items-center justify-center text-center gap-8 min-h-[80vh]"
          >
            <div className="flex flex-col items-center gap-2 mb-4">
              <Image
                src="/static/logo.png"
                alt="Gully Commerce"
                width={160}
                height={40}
                className="h-8 w-auto object-contain"
              />
              <div className="h-[1px] w-24 bg-linear-to-r from-transparent via-gully-blue/20 to-transparent" />
            </div>

            <div className="relative">
              <div className="w-32 h-32 bg-gully-green/10 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-24 h-24 bg-gully-green/20 rounded-full flex items-center justify-center animate-ping absolute" />
                <CheckCircle className="w-16 h-16 text-gully-green relative z-10" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-10px] border-2 border-dashed border-gully-gold/30 rounded-full"
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl font-black text-gully-text">Listing is Live</h2>
              <p className="text-slate-500 font-medium">Your link is ready to go viral. Start sharing to receive orders.</p>
            </div>

            <div className="w-full bg-white p-5 rounded-[2rem] flex flex-col gap-4 shadow-premium border border-slate-100">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Gully Link</span>
                  <span className="text-sm font-bold text-gully-blue truncate">gully.com/p/{createdSlug}</span>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(`https://gully.com/p/${createdSlug}`)}
                  className="bg-slate-50 p-3 rounded-2xl hover:bg-slate-100 active:scale-95 transition-all text-gully-blue"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col w-full gap-4 mt-4">
              <button className="btn-upi bg-[#25D366] hover:bg-[#128C7E] shadow-[#25D366]/20 py-5">
                <Share2 className="w-7 h-7" />
                <span className="text-xl uppercase tracking-widest">Share on WhatsApp</span>
              </button>
              <div className="flex gap-4">
                <Link href="/dashboard" className="flex-1 btn-upi bg-gully-blue/10 text-gully-blue border border-gully-blue/20 hover:bg-gully-blue/20">
                  Dashboard
                </Link>
                <Link href={`/p/${createdSlug}`} className="flex-1 btn-upi bg-slate-100 text-slate-600 hover:bg-slate-200">
                  View Link
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
