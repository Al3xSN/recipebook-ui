'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { CATEGORY_LABELS } from '@/lib/recipe-enums';
import { apiFetch } from '@/lib/api';
import { ISearchRecipesResult } from '@/lib/server/recipe/search';
import { RecipeListCard } from '@/app/(protected)/recipes/_components/RecipeListCard';
import { SearchIcon } from '@/components/icons';

const TRENDING_SEARCHES = [
  'Brown Butter',
  'Miso',
  'Mediterranean',
  'No-bake',
  'Vegan',
  'Lamb',
  'Yuzu',
  'Lentil',
];

const CATEGORY_IMAGES: Record<number, string> = {
  0: '/breakfast.jpg',
  1: '/lunch.jpg',
  2: '/dinner.jpg',
  3: '/dessert.jpg',
  4: '/snack.jpg',
  5: '/appetizer.jpg',
  6: '/soup.jpg',
  7: '/salad.jpg',
  8: '/bread.jpg',
  9: '/beverage.jpg',
};

const DiscoverPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [results, setResults] = useState<ISearchRecipesResult | null>(null);
  const [loading, setLoading] = useState(false);

  const searchInputRef = useRef(searchInput);
  const categoryIdRef = useRef(categoryId);

  useEffect(() => {
    searchInputRef.current = searchInput;
    categoryIdRef.current = categoryId;
  });

  useEffect(() => {
    if (!searchInput && categoryId === null) {
      setResults(null);
      return;
    }

    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ pageSize: '20' });
        if (categoryIdRef.current !== null) {
          params.set('category', String(categoryIdRef.current));
        } else if (searchInputRef.current) {
          params.set('search', searchInputRef.current);
        }

        const data = await apiFetch<ISearchRecipesResult>(`/api/recipes/explore?${params}`);
        setResults(data);
      } catch {
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(t);
  }, [searchInput, categoryId]);

  const handleSearchChange = (text: string) => {
    setSearchInput(text);
    setCategoryId(null);
  };

  const handleCategoryClick = (id: number, label: string) => {
    setCategoryId(id);
    setSearchInput(label);
  };

  const handleTrendingClick = (term: string) => {
    setSearchInput(term);
    setCategoryId(null);
  };

  const handleClear = () => {
    setSearchInput('');
    setCategoryId(null);
    setResults(null);
  };

  const isLanding = !searchInput && categoryId === null;

  return (
    <div className="min-h-screen p-5">
      <h1 className="mb-6 text-xl font-bold text-(--text)">Discover</h1>

      <div className="relative mb-5">
        <SearchIcon className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search recipes, ingredients..."
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pr-10 pl-11 transition-colors outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
        />

        {searchInput && (
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

      {isLanding ? (
        <>
          <section className="mb-7">
            <p className="mb-3 text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Trending Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleTrendingClick(term)}
                  className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-700 transition-colors hover:border-orange-300 hover:text-orange-600"
                >
                  {term}
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-3 text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Browse by Category
            </p>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(CATEGORY_LABELS).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleCategoryClick(Number(id), label)}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative h-28 w-full overflow-hidden">
                    {CATEGORY_IMAGES[Number(id)] ? (
                      <Image
                        src={CATEGORY_IMAGES[Number(id)]}
                        alt={label}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200" />
                    )}
                  </div>
                  <div className="px-3 py-2 text-left">
                    <span className="text-sm font-semibold text-gray-800">{label}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section>
          {!loading && results !== null && (
            <p className="mb-4 text-xs font-semibold tracking-widest text-gray-400 uppercase">
              {results.totalCount} result{results.totalCount !== 1 ? 's' : ''} for &ldquo;
              {searchInput}&rdquo;
            </p>
          )}
          {loading ? (
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-2xl bg-white p-3 shadow-sm">
                  <div className="h-16 w-16 shrink-0 animate-pulse rounded-xl bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-2.5 w-16 animate-pulse rounded bg-gray-200" />
                    <div className="h-3.5 w-40 animate-pulse rounded bg-gray-200" />
                    <div className="h-2.5 w-24 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : results && results.items.length > 0 ? (
            <div className="flex flex-col gap-3">
              {results.items.map((recipe) => (
                <RecipeListCard key={recipe.id} recipe={recipe} showAuthor />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <p className="text-sm text-gray-400">No recipes found. Try a different search.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default DiscoverPage;
