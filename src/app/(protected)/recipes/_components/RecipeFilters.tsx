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
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
          style={{ color: 'var(--text3)' }}
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
          style={{
            width: '100%',
            borderRadius: 10,
            border: '1px solid var(--border)',
            background: 'var(--bg2)',
            color: 'var(--text)',
            padding: '10px 12px 10px 36px',
            fontSize: 14,
            outline: 'none',
            transition: 'border-color 150ms',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => setSearchInput('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text3)' }}
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
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 2,
          scrollbarWidth: 'none',
        }}
      >
        {CATEGORY_PILLS.map(({ value, label }) => {
          const isActive = category === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              style={{
                flexShrink: 0,
                borderRadius: 100,
                padding: '6px 14px',
                fontSize: 13,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                transition: 'background 140ms, color 140ms',
                background: isActive ? 'var(--accent)' : 'var(--bg2)',
                color: isActive ? '#fff' : 'var(--text2)',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
