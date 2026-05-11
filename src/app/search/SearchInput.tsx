'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export function SearchInput({ defaultValue }: { defaultValue?: string }) {
  const [query, setQuery] = useState(defaultValue || '');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-lg mx-auto">
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un produit..."
        className="w-full px-4 py-3 pl-12 bg-[#111118] border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500/50 transition-all" />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
      <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium bg-violet-600/20 text-violet-400 rounded-lg border border-violet-500/20 hover:bg-violet-600/30 transition-colors">Rechercher</button>
    </form>
  );
}
