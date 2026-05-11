'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({ rating, size = 'md', interactive = false, onChange }: StarRatingProps) {
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(i + 1)}
          className={cn('transition-colors', interactive && 'cursor-pointer hover:scale-110')}
        >
          <Star className={cn(iconSize, i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent text-white/20')} />
        </button>
      ))}
    </div>
  );
}
