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
    <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]">
      {PILLS.map(({ value, label }) => {
        const isActive = category === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setCategory(value)}
            className={`shrink-0 cursor-pointer rounded-full border-none px-4 py-2 text-[13px] font-medium transition-colors duration-150 ${isActive ? 'bg-(--accent) text-white' : 'bg-(--bg2) text-(--text2)'}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
