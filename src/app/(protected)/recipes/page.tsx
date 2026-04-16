import { Suspense } from 'react';
import Link from 'next/link';
import { cacheLife, cacheTag } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { toRecipeDto } from '@/lib/server/recipe-mapper';
import type { IRecipeDto } from '@/interfaces/IRecipe';
import { RecipeCard } from './_components/RecipeCard';
import { RecipeFilters } from './_components/RecipeFilters';

async function getUserRecipes(userId: string): Promise<IRecipeDto[]> {
  'use cache';
  cacheTag(`user-recipes-${userId}`);
  cacheLife({ stale: 30, revalidate: 60 });

  const recipes = await db.recipe.findMany({
    where: { userId },
    include: { ingredients: true, instructions: true, tags: true, user: true },
    orderBy: { createdAt: 'desc' },
  });
  return recipes.map(toRecipeDto);
}

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; tags?: string }>;
}) {
  const session = await auth();
  const userId = session!.user!.id;

  const { search = '', category = '', tags = '' } = await searchParams;

  const recipes = await getUserRecipes(userId);

  const activeTags = new Set(tags ? tags.split(',').map(Number) : []);
  const filteredRecipes = recipes.filter((r) => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== '' && r.category !== Number(category)) return false;
    if (activeTags.size > 0 && !r.tags.some((t) => activeTags.has(t))) return false;
    return true;
  });

  const hasFilters = search !== '' || category !== '' || activeTags.size > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Recipes</h1>
        <Link
          href="/recipes/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New recipe
        </Link>
      </div>

      {/* Filters — client component, Suspense required for useSearchParams */}
      <Suspense fallback={<div className="mb-8 h-24" />}>
        <RecipeFilters />
      </Suspense>

      {/* Empty state — no recipes at all */}
      {recipes.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <div className="mb-4 flex items-center justify-center rounded-2xl bg-orange-100 p-4">
            <svg
              className="h-8 w-8 text-orange-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h2 className="mb-1 text-lg font-semibold text-gray-900">No recipes yet</h2>
          <p className="mb-6 text-sm text-gray-500">
            Add your first recipe to start building your collection.
          </p>
          <Link
            href="/recipes/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add your first recipe
          </Link>
        </div>
      )}

      {/* No filter match */}
      {recipes.length > 0 && filteredRecipes.length === 0 && hasFilters && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-sm text-gray-500">No recipes match your filters.</p>
        </div>
      )}

      {/* Recipe grid */}
      {filteredRecipes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} currentUserId={userId} />
          ))}
        </div>
      )}
    </div>
  );
}
