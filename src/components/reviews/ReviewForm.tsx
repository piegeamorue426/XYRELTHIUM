'use client';

import React, { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { StarRating } from './StarRating';

interface ReviewFormProps {
  productId: string;
  userId: string | null;
  existingReview?: { rating: number; comment: string | null } | null;
  onReviewSubmitted: () => void;
}

export function ReviewForm({ productId, userId, existingReview, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!userId) {
    return (
      <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
        <p className="text-sm text-white/50">Connectez-vous pour laisser un avis</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError('Veuillez selectionner une note'); return; }
    setLoading(true);
    setError('');
    const supabase = createBrowserSupabaseClient();
    const { error: submitError } = await supabase.from('reviews').upsert(
      { product_id: productId, user_id: userId, rating, comment: comment.trim() || null },
      { onConflict: 'product_id,user_id' }
    );
    if (submitError) { setError('Erreur. Reessayez.'); } else { onReviewSubmitted(); }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
      <h4 className="text-sm font-medium text-white">{existingReview ? 'Modifier votre avis' : 'Laisser un avis'}</h4>
      <div>
        <p className="text-xs text-white/50 mb-2">Votre note</p>
        <StarRating rating={rating} interactive onChange={setRating} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Votre commentaire (optionnel)"
        rows={3}
        className="w-full px-3 py-2 bg-[#0a0a0f] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 resize-none"
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <Button type="submit" variant="primary" size="sm" loading={loading}>
        {existingReview ? 'Modifier' : 'Publier'}
      </Button>
    </form>
  );
}
