'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORY_LABELS } from '@/lib/recipe-enums';

const CATEGORY_PILLS = [
  { value: '', label: 'All' },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
];

export const RecipeFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const urlSearch = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);

  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    setSearchInput(urlSearch);
  }

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

  const setCategory = (value: string) => {
    const params = new URLSearchParams(searchParamsRef.current.toString());
    if (value) {
      params.set('category', value);
    } else {
      params.delete('category');
    }
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <svg
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-(--text3)"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="search"
          placeholder="Search my recipes…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full rounded-[10px] border border-solid border-(--border) bg-(--bg2) py-2.5 pr-3 pl-9 text-base text-(--text) transition-colors duration-150 outline-none focus:border-(--accent)"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => setSearchInput('')}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-(--text3)"
            aria-label="Clear search"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]">
        {CATEGORY_PILLS.map(({ value, label }) => {
          const isActive = category === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={`shrink-0 cursor-pointer rounded-full border-none px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150 ${isActive ? 'bg-(--accent) text-white' : 'bg-(--bg2) text-(--text2)'}`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
