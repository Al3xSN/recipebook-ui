import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/auth';
import { CATEGORY_LABELS } from '@/lib/recipe-enums';
import { searchRecipes } from '@/lib/server/recipe/search';
import { RecipeListCard } from '@/app/(protected)/recipes/_components/RecipeListCard';
import { SearchInput } from './_components/SearchInput';

export const metadata: Metadata = { title: 'Search' };

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

const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) => {
  const { search, category } = await searchParams;
  const session = await auth();
  const userId = session!.user.id;

  const hasQuery = !!search || category !== undefined;

  const results = hasQuery
    ? await searchRecipes({
        userId,
        search: search || undefined,
        category: category !== undefined ? Number(category) : undefined,
        pageSize: 20,
      })
    : null;

  const displayValue =
    search || (category !== undefined ? CATEGORY_LABELS[Number(category)] : undefined);

  return (
    <div className="min-h-screen p-5">
      <h1 className="mb-6 text-xl font-bold text-(--text)">Search</h1>

      <SearchInput defaultValue={displayValue} />

      {!hasQuery ? (
        <>
          <section className="mb-7">
            <p className="mb-3 text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Trending Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map((term) => (
                <Link
                  key={term}
                  href={`/search?search=${encodeURIComponent(term)}`}
                  className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-700 transition-colors hover:border-orange-300 hover:text-orange-600"
                >
                  {term}
                </Link>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-3 text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Browse by Category
            </p>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(CATEGORY_LABELS).map(([id, label]) => (
                <Link
                  key={id}
                  href={`/search?category=${id}`}
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
                </Link>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section>
          {results !== null && (
            <p className="mb-4 text-xs font-semibold tracking-widest text-gray-400 uppercase">
              {results.totalCount} result{results.totalCount !== 1 ? 's' : ''} for &ldquo;
              {displayValue}&rdquo;
            </p>
          )}
          {results && results.items.length > 0 ? (
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

export default SearchPage;
