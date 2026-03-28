'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function VoiceWaveform({ isRecording }: { isRecording: boolean }) {
  const [bars, setBars] = useState<number[]>(new Array(20).fill(4));

  useEffect(() => {
    if (!isRecording) {
      const timeout = setTimeout(() => {
        setBars(new Array(20).fill(4));
      }, 0);
      return () => clearTimeout(timeout);
    }

    const interval = setInterval(() => {
      setBars(prevBars => prevBars.map(() => Math.floor(Math.random() * 80) + 20));
    }, 100);

    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          animate={{ height }}
          className={`w-1 rounded-full ${isRecording ? 'bg-gully-green' : 'bg-slate-200'}`}
        />
      ))}
    </div>
  );
}
