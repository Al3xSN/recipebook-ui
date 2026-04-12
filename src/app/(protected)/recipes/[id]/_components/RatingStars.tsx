'use client';

import { useState } from 'react';

export function RatingStars() {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(0);

  return (
    <div>
      <h2 className="mb-3 text-base font-semibold text-gray-900">Rate this recipe</h2>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setSelected(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
            className="transition-transform hover:scale-110"
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
    </div>
  );
}
