'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RecipeCard } from '../recipes/_components/RecipeCard';
import { PLACEHOLDER_RECIPES } from '@/lib/placeholder-data';
import { CATEGORY_LABELS, TAG_LABELS } from '@/lib/recipe-enums';

export default function ExplorePage() {
  const [activeTag, setActiveTag] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Explore recipes</h1>
        <p className="mt-1 text-sm text-gray-500">Discover recipes shared by the community.</p>
      </div>

      {/* Search + Sort + Category */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search all recipes…"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-400/20"
          />
        </div>
        <select className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20">
          <option value="newest">Newest</option>
          <option value="popular">Most popular</option>
          <option value="rating">Top rated</option>
          <option value="time">Shortest time</option>
        </select>
        <select className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20">
          <option value="">All categories</option>
          {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Tag filter pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTag(null)}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            activeTag === null
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {Object.entries(TAG_LABELS).map(([val, label]) => {
          const tagNum = Number(val);
          return (
            <button
              key={val}
              type="button"
              onClick={() => setActiveTag(activeTag === tagNum ? null : tagNum)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                activeTag === tagNum
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Recipe grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLACEHOLDER_RECIPES.map((recipe) => (
          <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="block">
            <RecipeCard recipe={recipe} />
          </Link>
        ))}
      </div>
    </div>
  );
}
