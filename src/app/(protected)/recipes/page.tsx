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
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{ padding: '20px 20px 8px' }}>
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <TimeGreeting />
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              fontWeight: 700,
              color: 'var(--text)',
              lineHeight: 1.2,
            }}
          >
            What&apos;s cooking today?
          </h1>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="flex items-center justify-center"
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'var(--bg2)',
              color: 'var(--text2)',
            }}
          >
            <BellIcon className="h-5 w-5" />
          </Link>
          <Link
            href={`/profile/${user.username}`}
            aria-label="Profile"
            className="flex items-center justify-center text-sm font-semibold"
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'var(--accent)',
              color: '#fff',
            }}
          >
            {initials}
          </Link>
        </div>
      </div>

      {/* Featured recipe */}
      {featured && (
        <div className="mb-5">
          <FeaturedRecipeCard recipe={featured} />
        </div>
      )}

      {/* Category pills */}
      <Suspense fallback={<div style={{ height: 36 }} />}>
        <div className="mb-5">
          <HomeCategoryPills />
        </div>
      </Suspense>

      {/* Recipe list */}
      {recipes.length === 0 && (
        <div
          className="py-20 text-center"
          style={{
            borderRadius: 16,
            border: '1px dashed var(--border)',
            background: 'var(--card)',
          }}
        >
          <p style={{ fontSize: 14, color: 'var(--text2)' }}>
            No recipes yet. Be the first to share one!
          </p>
        </div>
      )}

      {recipes.length > 0 && rest.length === 0 && featured && (
        <div
          className="py-12 text-center"
          style={{
            borderRadius: 16,
            border: '1px dashed var(--border)',
            background: 'var(--card)',
          }}
        >
          <p style={{ fontSize: 14, color: 'var(--text2)' }}>No other recipes in this category.</p>
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
