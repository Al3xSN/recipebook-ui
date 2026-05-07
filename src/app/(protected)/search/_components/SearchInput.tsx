'use client';

import { useState, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon } from '@/components/icons';

interface ISearchInputProps {
  defaultValue?: string;
}

export const SearchInput = ({ defaultValue }: ISearchInputProps) => {
  const [value, setValue] = useState(defaultValue ?? '');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (text: string) => {
    setValue(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(() => {
        if (text) {
          router.replace(`/search?search=${encodeURIComponent(text)}`);
        } else {
          router.replace('/search');
        }
      });
    }, 400);
  };

  const handleClear = () => {
    setValue('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    startTransition(() => router.replace('/search'));
  };

  return (
    <div className="relative mb-5">
      <SearchIcon className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search recipes, ingredients..."
        className={`w-full rounded-2xl border border-gray-200 bg-white py-3 pr-10 pl-11 transition-colors outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20${isPending ? 'opacity-50' : ''}`}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};
