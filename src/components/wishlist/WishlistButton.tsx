'use client';

import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { createClient as createBrowserSupabaseClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export function WishlistButton({ productId }: { productId: string }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        supabase.from('wishlists').select('id').eq('user_id', user.id).eq('product_id', productId).single().then(({ data }) => { if (data) setIsWishlisted(true); });
      }
    });
  }, [productId]);

  const toggle = async () => {
    if (!userId) { window.location.href = '/auth/login'; return; }
    setLoading(true);
    const supabase = createBrowserSupabaseClient();
    if (isWishlisted) {
      await supabase.from('wishlists').delete().eq('user_id', userId).eq('product_id', productId);
      setIsWishlisted(false);
    } else {
      await supabase.from('wishlists').insert({ user_id: userId, product_id: productId });
      setIsWishlisted(true);
    }
    setLoading(false);
  };

  return (
    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }} disabled={loading}
      className={cn('p-2 rounded-full transition-all duration-200', isWishlisted ? 'text-red-400 bg-red-400/10 hover:bg-red-400/20' : 'text-white/40 bg-white/5 hover:text-red-400 hover:bg-red-400/10')}
      aria-label={isWishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
      <Heart className={cn('h-5 w-5', isWishlisted && 'fill-red-400')} />
    </button>
  );
}
