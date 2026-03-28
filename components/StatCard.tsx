'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export default function StatCard({ label, value, trend, icon: Icon, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-premium flex flex-col gap-4 relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity ${color}`} />
      
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        {trend && (
          <span className="text-[10px] font-black bg-gully-green/10 text-gully-green px-2 py-1 rounded-full border border-gully-green/10">
            {trend}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-3xl font-black text-gully-text mt-1">{value}</span>
      </div>
    </motion.div>
  );
}
