'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useEffect } from 'react';
import { CATEGORY_LABELS } from '@/lib/recipe-enums';

const PILLS = [
  { value: '', label: 'All' },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
];

export const HomeCategoryPills = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const category = searchParams.get('category') ?? '';

  const setCategory = (value: string) => {
    const params = new URLSearchParams();
    if (value) params.set('category', value);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 2,
        scrollbarWidth: 'none',
      }}
    >
      {PILLS.map(({ value, label }) => {
        const isActive = category === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setCategory(value)}
            style={{
              flexShrink: 0,
              borderRadius: 100,
              padding: '7px 16px',
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
  );
};
