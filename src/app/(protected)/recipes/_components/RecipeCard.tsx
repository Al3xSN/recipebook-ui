'use client';

import { CATEGORY_LABELS, TAG_LABELS } from '@/lib/recipe-enums';
import type { RecipeDto } from '@/types/recipe';

interface RecipeCardProps {
  recipe: RecipeDto;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const totalMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  function formatTime(minutes: number) {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      {recipe.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={recipe.imageUrl} alt={recipe.title} className="h-40 w-full object-cover" />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-orange-50">
          <svg
            className="h-10 w-10 text-orange-200"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Category badge */}
        <div>
          <span className="inline-block rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">
            {CATEGORY_LABELS[recipe.category] ?? 'Other'}
          </span>
        </div>

        {/* Title */}
        <h2 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900">
          {recipe.title}
        </h2>

        {/* Meta: time + servings */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {formatTime(totalMinutes)}
          </span>
          <span className="flex items-center gap-1">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Tags */}
        {recipe.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1 pt-1">
            {recipe.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
              >
                {TAG_LABELS[tag] ?? tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                +{recipe.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
