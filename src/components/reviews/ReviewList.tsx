'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Review } from '@/types/database';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import { formatDate } from '@/lib/utils';

interface ReviewListProps {
  productId: string;
  userId: string | null;
}

export default function ReviewList({ productId, userId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('reviews')
      .select('*, profile:profiles(full_name, avatar_url)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    setReviews((data as unknown as Review[]) || []);
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-white">Avis clients</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={averageRating} size="sm" />
            <span className="text-sm text-gray-400">
              {averageRating.toFixed(1)} ({reviews.length} avis)
            </span>
          </div>
        )}
      </div>

      {/* Review Form */}
      <ReviewForm
        productId={productId}
        userId={userId}
        onReviewSubmitted={fetchReviews}
      />

      {/* Reviews */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-800/50 rounded-xl p-6 space-y-3">
              <div className="h-4 bg-gray-700 rounded w-1/4" />
              <div className="h-3 bg-gray-700 rounded w-full" />
              <div className="h-3 bg-gray-700 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-800/30 border border-gray-800 rounded-xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center">
                    <span className="text-xs font-bold text-violet-300">
                      {(review.profile as unknown as { full_name?: string })?.full_name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">
                      {(review.profile as unknown as { full_name?: string })?.full_name || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(review.created_at)}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} size="sm" />
              </div>
              {review.comment && (
                <p className="text-sm text-gray-300 leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
