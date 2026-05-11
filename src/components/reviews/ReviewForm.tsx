'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import StarRating from './StarRating';
import Button from '@/components/ui/Button';

interface ReviewFormProps {
  productId: string;
  userId: string | null;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ productId, userId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!userId) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
        <p className="text-gray-400">
          Connectez-vous pour laisser un avis.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: insertError } = await supabase.from('reviews').upsert(
      {
        product_id: productId,
        user_id: userId,
        rating,
        comment: comment.trim() || null,
      },
      { onConflict: 'product_id,user_id' }
    );

    if (insertError) {
      setError('Erreur lors de l\'envoi de votre avis. Réessayez.');
    } else {
      setRating(0);
      setComment('');
      onReviewSubmitted();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">Laisser un avis</h3>

      <div>
        <label className="block text-sm text-gray-300 mb-2">Votre note</label>
        <StarRating
          rating={rating}
          interactive
          onRatingChange={setRating}
          size="lg"
        />
      </div>

      <div>
        <label htmlFor="review-comment" className="block text-sm text-gray-300 mb-2">
          Votre commentaire (optionnel)
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Partagez votre expérience..."
          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button type="submit" loading={loading}>
        Publier l&apos;avis
      </Button>
    </form>
  );
}
