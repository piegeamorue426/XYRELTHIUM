'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  className?: string;
}

export function StatsCard({ icon, label, value, trend, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111118] to-[#0d0d14] border border-white/5 p-6',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/50 mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && (
            <p className="mt-1 text-xs text-emerald-400">{trend}</p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600/20 text-violet-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
