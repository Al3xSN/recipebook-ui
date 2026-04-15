'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORY_LABELS, TAG_LABELS } from '@/lib/recipe-enums';

export function RecipeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const urlSearch = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const tagsParam = searchParams.get('tags') ?? '';
  const activeTags = new Set(tagsParam ? tagsParam.split(',').map(Number) : []);

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);

  // Derived state: sync input when URL changes via back/forward navigation
  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    setSearchInput(urlSearch);
  }

  // Debounce search input → URL
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      if (searchInput) {
        params.set('search', searchInput);
      } else {
        params.delete('search');
      }
      router.replace(`?${params.toString()}`);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput, router]);

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParamsRef.current.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`?${params.toString()}`);
  }

  function toggleTag(tagValue: number) {
    const next = new Set(activeTags);
    if (next.has(tagValue)) {
      next.delete(tagValue);
    } else {
      next.add(tagValue);
    }
    setParam('tags', next.size > 0 ? [...next].join(',') : null);
  }

  const hasFilters = urlSearch !== '' || category !== '' || activeTags.size > 0;

  return (
    <>
      {/* Search */}
      <div className="mb-4">
        <input
          type="search"
          placeholder="Search recipes…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-400/20"
        />
      </div>

      {/* Category + Tags */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <select
          value={category}
          onChange={(e) => setParam('category', e.target.value || null)}
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
          {Object.entries(TAG_LABELS).map(([value, label]) => {
            const tagNum = Number(value);
            const isActive = activeTags.has(tagNum);
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleTag(tagNum)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setSearchInput('');
              router.replace('?');
            }}
            className="text-sm font-medium text-orange-500 hover:text-orange-600"
          >
            Clear filters
          </button>
        )}
      </div>
    </>
  );
}
