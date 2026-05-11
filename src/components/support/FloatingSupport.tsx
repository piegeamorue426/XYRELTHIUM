'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export function FloatingSupport() {
  return (
    <Link
      href="/support"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-full shadow-lg shadow-violet-600/30 hover:shadow-violet-500/40 transition-all duration-200 hover:scale-105 group"
      aria-label="Contacter le support"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="text-sm font-medium hidden sm:inline">Support</span>
    </Link>
  );
}
