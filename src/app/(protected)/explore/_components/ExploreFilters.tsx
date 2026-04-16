'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORY_LABELS, TAG_LABELS } from '@/lib/recipe-enums';

interface IExploreFiltersProps {
  totalCount: number;
  totalPages: number;
}

export function ExploreFilters({ totalCount, totalPages }: IExploreFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const urlSearch = searchParams.get('search') ?? '';
  const sortOrder = searchParams.get('sortOrder') ?? '1';
  const category = searchParams.get('category') ?? '';
  const activeTag = searchParams.get('tags') ?? '';
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);

  // Derived state: sync input when URL changes via back/forward navigation
  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    setSearchInput(urlSearch);
  }

  // Debounce search input → URL, reset page on new search
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      if (searchInput) {
        params.set('search', searchInput);
      } else {
        params.delete('search');
      }
      params.delete('page');
      router.replace(`?${params.toString()}`);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput, router]);

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParamsRef.current.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page'); // Reset to page 1 on filter change
    router.replace(`?${params.toString()}`);
  }

  function setPage(newPage: number) {
    const params = new URLSearchParams(searchParamsRef.current.toString());
    if (newPage > 1) {
      params.set('page', String(newPage));
    } else {
      params.delete('page');
    }
    router.replace(`?${params.toString()}`);
  }

  return (
    <>
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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search all recipes…"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-400/20"
          />
        </div>
        <select
          value={sortOrder}
          onChange={(e) => setParam('sortOrder', e.target.value)}
          className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
        >
          <option value="1">Newest</option>
          <option value="2">Most popular</option>
          <option value="3">Top rated</option>
          <option value="4">Shortest time</option>
        </select>
        <select
          value={category}
          onChange={(e) => setParam('category', e.target.value || null)}
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
          onClick={() => setParam('tags', null)}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            activeTag === ''
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {Object.entries(TAG_LABELS).map(([val, label]) => (
          <button
            key={val}
            type="button"
            onClick={() => setParam('tags', activeTag === val ? null : val)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              activeTag === val
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
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
              onClick={() => setPage(page - 1)}
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
              onClick={() => setPage(page + 1)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
