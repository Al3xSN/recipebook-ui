'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiAuth, ApiRequestError } from '@/lib/api';
import type { RecipeDto } from '@/types/recipe';
import { CATEGORY_LABELS, TAG_LABELS } from '@/lib/recipe-enums';
import { RecipeCard } from './_components/RecipeCard';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<RecipeDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiAuth<RecipeDto[]>('/recipes');
        setRecipes(data);
      } catch (err) {
        if (err instanceof ApiRequestError) {
          setError(err.detail);
        } else {
          setError('Failed to load recipes. Please refresh the page.');
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Recipes</h1>
        <Link
          href="/protected/recipes/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New recipe
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="search"
          placeholder="Search recipes…"
          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-400/20"
        />
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <select
          defaultValue=""
          className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-400/20"
        >
          <option value="">All categories</option>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(TAG_LABELS).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <div className="h-40 bg-gray-100" />
              <div className="flex flex-col gap-3 p-4">
                <div className="h-4 w-20 rounded-full bg-gray-100" />
                <div className="h-5 w-3/4 rounded bg-gray-100" />
                <div className="h-3 w-1/2 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Empty state */}
      {!isLoading && !error && recipes.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <div className="mb-4 flex items-center justify-center rounded-2xl bg-orange-100 p-4">
            <svg
              className="h-8 w-8 text-orange-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h2 className="mb-1 text-lg font-semibold text-gray-900">No recipes yet</h2>
          <p className="mb-6 text-sm text-gray-500">
            Add your first recipe to start building your collection.
          </p>
          <Link
            href="/protected/recipes/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add your first recipe
          </Link>
        </div>
      )}

      {/* Recipe grid */}
      {!isLoading && !error && recipes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
