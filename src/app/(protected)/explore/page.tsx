'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { RecipeCard } from '../recipes/_components/RecipeCard';
import { CATEGORY_LABELS, TAG_LABELS } from '@/lib/recipe-enums';
import { apiFetch } from '@/lib/api';
import type { RecipeDto } from '@/types/recipe';

interface PagedResult {
  items: RecipeDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function ExplorePage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('1');
  const [category, setCategory] = useState('');
  const [activeTag, setActiveTag] = useState<number | null>(null);
  const [recipes, setRecipes] = useState<RecipeDto[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Debounce search input — also resets page
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch when filters or page change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    params.set('sortOrder', sortOrder);
    if (category) params.set('category', category);
    if (activeTag !== null) params.set('tags', String(activeTag));
    params.set('page', String(page));

    let cancelled = false;
    apiFetch<PagedResult>(`/api/recipes/explore?${params}`)
      .then((result) => {
        if (cancelled) return;
        setRecipes(result.items);
        setTotalPages(result.totalPages);
        setTotalCount(result.totalCount);
        setHasFetched(true);
      })
      .catch(() => {
        if (!cancelled) {
          setRecipes([]);
          setHasFetched(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, sortOrder, category, activeTag, page]);

  function handleSortChange(value: string) {
    setSortOrder(value);
    setPage(1);
  }

  function handleCategoryChange(value: string) {
    setCategory(value);
    setPage(1);
  }

  function handleTagToggle(tagNum: number) {
    setActiveTag((prev) => (prev === tagNum ? null : tagNum));
    setPage(1);
  }

  function handleClearTag() {
    setActiveTag(null);
    setPage(1);
  }

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all recipes…"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-400/20"
          />
        </div>
        <select
          value={sortOrder}
          onChange={(e) => handleSortChange(e.target.value)}
          className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
        >
          <option value="1">Newest</option>
          <option value="2">Most popular</option>
          <option value="3">Top rated</option>
          <option value="4">Shortest time</option>
        </select>
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
        >
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
          onClick={handleClearTag}
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
              onClick={() => handleTagToggle(tagNum)}
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
      {!hasFetched ? (
        <p className="text-sm text-gray-400">Loading recipes…</p>
      ) : recipes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <p className="text-sm text-gray-500">No recipes found. Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="block">
                <RecipeCard recipe={recipe} currentUserId={currentUserId} />
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-gray-500">{totalCount} recipes found</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
