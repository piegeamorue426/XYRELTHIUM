'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function WishlistButton({ productId, className, size = 'sm' }: WishlistButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-10 h-10',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  useEffect(() => {
    const checkWishlist = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      setIsFavorite(!!data);
    };

    checkWishlist();
  }, [productId]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) return;
    setLoading(true);

    const supabase = createClient();

    if (isFavorite) {
      await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);
      setIsFavorite(false);
    } else {
      await supabase
        .from('wishlists')
        .insert({ user_id: userId, product_id: productId });
      setIsFavorite(true);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading || !userId}
      className={cn(
        'rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm',
        isFavorite
          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
          : 'bg-black/40 text-gray-400 hover:text-red-400 hover:bg-black/60',
        sizeClasses[size],
        className
      )}
      aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <svg
        className={cn(iconSizeClasses[size], 'transition-transform', loading && 'animate-pulse')}
        fill={isFavorite ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={isFavorite ? 0 : 2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
