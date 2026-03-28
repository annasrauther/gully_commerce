import Link from 'next/link'
import { motion } from 'framer-motion'
import { Map, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex-1 bg-white max-w-[420px] mx-auto w-full min-h-screen flex flex-col items-center justify-center p-8 text-center font-sans">
      <div className="w-24 h-24 bg-zinc-50 rounded-[32px] border-2 border-dashed border-zinc-200 flex items-center justify-center mb-8 shadow-inner">
        <Map className="w-10 h-10 text-zinc-300" />
      </div>

      <h1 className="text-[44px] font-black tracking-[-0.05em] leading-[0.9] text-black mb-4">
        Gully Not<br />Found.
      </h1>
      
      <p className="text-zinc-500 font-bold text-lg mb-10 tracking-tight">
        Oops, this gully seems to be a dead end. Let's get you back on track.
      </p>

      <Link 
        href="/" 
        className="w-full h-18 bg-black text-white rounded-full font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-2xl shadow-black/20"
      >
        Go Back Home
        <ArrowRight className="w-6 h-6" />
      </Link>
    </div>
  )
}
