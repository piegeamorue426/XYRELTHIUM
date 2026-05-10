'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SortSelectProps {
  currentSort?: string;
}

export function SortSelect({ currentSort }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set('sort', e.target.value);
    } else {
      params.delete('sort');
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <select
      value={currentSort || 'newest'}
      onChange={handleSortChange}
      className="bg-[#1a1a24] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-violet-500/50 cursor-pointer"
    >
      <option value="newest">Plus recents</option>
      <option value="price_asc">Prix croissant</option>
      <option value="price_desc">Prix decroissant</option>
    </select>
  );
}
