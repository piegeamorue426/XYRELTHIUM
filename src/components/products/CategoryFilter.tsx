'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/database';

interface CategoryFilterProps {
  categories: Category[];
  activeCategory?: string;
}

export function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryClick = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => handleCategoryClick(null)}
        className={cn(
          'px-4 py-2 text-sm rounded-full border whitespace-nowrap transition-all duration-200',
          !activeCategory
            ? 'bg-violet-600/20 border-violet-500/40 text-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.15)]'
            : 'bg-[#1a1a24] border-white/10 text-white/60 hover:border-white/20 hover:text-white'
        )}
      >
        Tous
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.slug)}
          className={cn(
            'px-4 py-2 text-sm rounded-full border whitespace-nowrap transition-all duration-200',
            activeCategory === category.slug
              ? 'bg-violet-600/20 border-violet-500/40 text-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.15)]'
              : 'bg-[#1a1a24] border-white/10 text-white/60 hover:border-white/20 hover:text-white'
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
