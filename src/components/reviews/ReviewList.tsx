'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { StarRating } from './StarRating';
import { ReviewForm } from './ReviewForm';
import { formatDate } from '@/lib/utils';

interface Review { id: string; rating: number; comment: string | null; created_at: string; user_id: string; }

export function ReviewList({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    const supabase = createBrowserSupabaseClient();
    const { data } = await supabase.from('reviews').select('*').eq('product_id', productId).order('created_at', { ascending: false });
    setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getUser().then(({ data: { user } }) => { setUserId(user?.id || null); });
    fetchReviews();
  }, [productId]);

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const existingReview = reviews.find((r) => r.user_id === userId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h3 className="text-xl font-bold text-white">Avis clients</h3>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(averageRating)} size="sm" />
            <span className="text-sm text-white/50">{averageRating.toFixed(1)} ({reviews.length} avis)</span>
          </div>
        )}
      </div>
      <ReviewForm productId={productId} userId={userId} existingReview={existingReview ? { rating: existingReview.rating, comment: existingReview.comment } : null} onReviewSubmitted={fetchReviews} />
      {loading ? (
        <div className="space-y-4">{[1, 2].map((i) => <div key={i} className="animate-pulse bg-white/5 rounded-xl h-24" />)}</div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-white/40 text-center py-6">Aucun avis pour le moment. Soyez le premier !</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-xs text-white/40">{formatDate(review.created_at)}</span>
              </div>
              {review.comment && <p className="text-sm text-white/70">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
