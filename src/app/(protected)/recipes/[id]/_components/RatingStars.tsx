'use client';

import { useState } from 'react';
import { apiFetch, ApiRequestError } from '@/lib/api';

interface IRatingStars {
  recipeId: string;
}

export function RatingStars({ recipeId }: IRatingStars) {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRate(value: number) {
    setSelected(value);
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await apiFetch<{
        value: number;
        averageRating: number;
        totalCount: number;
      }>(`/api/recipes/${recipeId}/ratings`, {
        method: 'POST',
        body: JSON.stringify({ value }),
      });
      setAverageRating(result.averageRating);
      setTotalCount(result.totalCount);
    } catch (err) {
      if (err instanceof ApiRequestError) setError(err.detail);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="mb-3 text-base font-semibold text-gray-900">Rate this recipe</h2>

      {averageRating !== null && (
        <p className="mb-2 text-sm text-gray-500">
          Average: <span className="font-medium text-gray-700">{averageRating.toFixed(1)}</span> (
          {totalCount} rating{totalCount !== 1 ? 's' : ''})
        </p>
      )}

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            disabled={isSubmitting}
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
            className="transition-transform hover:scale-110 disabled:opacity-50"
          >
            <svg
              className={`h-7 w-7 transition-colors ${
                star <= (hovered || selected) ? 'text-orange-400' : 'text-gray-300'
              }`}
              viewBox="0 0 24 24"
              fill={star <= (hovered || selected) ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        ))}
        {selected > 0 && (
          <span className="ml-2 text-sm text-gray-500">
            {selected === 1 && 'Not for me'}
            {selected === 2 && 'It was okay'}
            {selected === 3 && 'Pretty good'}
            {selected === 4 && 'Really liked it'}
            {selected === 5 && 'Absolutely loved it!'}
          </span>
        )}
      </div>

      {selected > 0 && (
        <button
          type="button"
          onClick={() => setSelected(0)}
          className="mt-2 text-xs text-gray-400 hover:text-gray-600"
        >
          Clear rating
        </button>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
