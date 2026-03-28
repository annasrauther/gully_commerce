'use client';

import { motion } from 'framer-motion';

export default function SalesGraph() {
  // Simple mock path for a "growing" business
  const path = "M 0 80 Q 25 70, 50 75 T 100 60 T 150 65 T 200 40 T 250 45 T 300 10 T 350 15 T 400 5";

  return (
    <div className="w-full h-32 relative overflow-hidden">
      <svg viewBox="0 0 400 100" className="w-full h-full preserve-3d">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0973BA" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0973BA" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          d={`${path} L 400 100 L 0 100 Z`}
          fill="url(#gradient)"
        />

        {/* Line */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d={path}
          fill="none"
          stroke="#0973BA"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Animated Point */}
        <motion.circle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, cx: 400, cy: 5 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          r="6"
          fill="#0973BA"
          stroke="white"
          strokeWidth="3"
          className="shadow-lg"
        />
      </svg>
    </div>
  );
}
