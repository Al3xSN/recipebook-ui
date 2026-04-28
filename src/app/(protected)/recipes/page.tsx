import { Suspense } from 'react';
import Link from 'next/link';

import { auth } from '@/auth';
import { getPublicRecipes } from '@/lib/server/recipe';
import { BellIcon } from '@/components/icons';
import { TimeGreeting } from '@/components/home/TimeGreeting';
import { FeaturedRecipeCard } from './_components/FeaturedRecipeCard';
import { HomeCategoryPills } from './_components/HomeCategoryPills';
import { RecipeListCard } from './_components/RecipeListCard';

const RecipesPage = async ({ searchParams }: { searchParams: Promise<{ category?: string }> }) => {
  const session = await auth();

  const user = session!.user!;

  const { category = '' } = await searchParams;
  const categoryNum = category !== '' ? Number(category) : undefined;

  const recipes = await getPublicRecipes(categoryNum);

  const featured =
    recipes.length > 0
      ? recipes.reduce((best, r) => ((r.averageRating ?? 0) > (best.averageRating ?? 0) ? r : best))
      : null;

  const rest = featured ? recipes.filter((r) => r.id !== featured.id) : recipes;

  const initials = (user.displayName ?? user.username ?? 'U')
    .split(' ')
    .map((w) => w.at(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="p-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <TimeGreeting />

          <h1 className="text-2xl font-bold text-(--text)">What&apos;s cooking today?</h1>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--bg2) text-(--text2)"
          >
            <BellIcon className="h-5 w-5" />
          </Link>

          <Link
            href={`/profile/${user.username}`}
            aria-label="Profile"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--accent) text-sm font-semibold text-white"
          >
            {initials}
          </Link>
        </div>
      </div>

      {featured && (
        <div className="mb-5">
          <FeaturedRecipeCard recipe={featured} />
        </div>
      )}

      <Suspense fallback={<div className="h-9" />}>
        <div className="mb-5">
          <HomeCategoryPills />
        </div>
      </Suspense>

      {recipes.length === 0 && (
        <div className="rounded-2xl border border-dashed border-(--border) bg-(--card) py-20 text-center">
          <p className="text-sm text-(--text2)">No recipes yet. Be the first to share one!</p>
        </div>
      )}

      {recipes.length > 0 && rest.length === 0 && featured && (
        <div className="border(--border) rounded-2xl border border-dashed bg-(--card) py-12 text-center">
          <p className="text-sm text-(--text2)">No other recipes in this category.</p>
        </div>
      )}

      {rest.length > 0 && (
        <div className="flex flex-col gap-3">
          {rest.map((recipe) => (
            <RecipeListCard key={recipe.id} recipe={recipe} showAuthor />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipesPage;
