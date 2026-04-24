import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { auth } from '@/auth';
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from '@/lib/recipe-enums';
import { BookIcon, EditIcon, StarIcon } from '@/components/icons';
import {
  getRecipeById,
  canAccessRecipe,
  RecipeNotFoundError,
  RecipeAccessError,
} from '@/lib/server/recipe';
import { db } from '@/lib/db';
import { DeleteRecipeButton } from './_components/DeleteRecipeButton';
import { RecipeHeroActions } from './_components/RecipeHeroActions';
import { RecipeDetailTabs } from './_components/RecipeDetailTabs';

const AVATAR_COLORS = [
  'bg-orange-400',
  'bg-blue-400',
  'bg-green-400',
  'bg-purple-400',
  'bg-pink-400',
  'bg-teal-400',
  'bg-red-400',
  'bg-yellow-400',
];

const getAvatarColor = (username: string) =>
  AVATAR_COLORS[username.charCodeAt(0) % AVATAR_COLORS.length];

const formatTime = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

const RecipeDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  const { id } = await params;

  let recipe: Awaited<ReturnType<typeof getRecipeById>>;
  try {
    recipe = await getRecipeById(id);
    await canAccessRecipe(recipe, session!.user!.id);
  } catch (e) {
    if (e instanceof RecipeNotFoundError || e instanceof RecipeAccessError) notFound();
    throw e;
  }

  const isOwner = recipe.userId === session?.user?.id;

  const [ratingStats, commentCount] = await Promise.all([
    db.rating.aggregate({
      where: { recipeId: id },
      _avg: { value: true },
      _count: { value: true },
    }),
    db.comment.count({ where: { recipeId: id } }),
  ]);

  const averageRating = ratingStats._avg.value;
  const totalRatings = ratingStats._count.value;
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <div className="mx-auto max-w-lg">
      {/* Hero image */}
      <div className="relative">
        {recipe.imageUrl ? (
          <div className="relative h-64 w-full">
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="(max-width: 512px) 100vw, 512px"
              priority
            />
          </div>
        ) : (
          <div className="flex h-64 w-full items-center justify-center bg-[#e8d5cc]">
            <BookIcon className="h-16 w-16 text-[#c4a99a]" strokeWidth={1.5} />
          </div>
        )}

        <RecipeHeroActions />

        {/* Owner edit/delete */}
        {isOwner && (
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <Link
              href={`/recipes/${id}/edit`}
              className="flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-orange-500"
            >
              <EditIcon className="h-3.5 w-3.5" />
              Edit
            </Link>
            <DeleteRecipeButton recipeId={id} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {/* Category + rating */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
            {CATEGORY_LABELS[recipe.category] ?? 'Other'}
          </span>
          {averageRating !== null && totalRatings > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className="h-3.5 w-3.5 text-orange-400"
                    fill={star <= Math.round(averageRating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-orange-500">
                {averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-gray-900">{recipe.title}</h1>

        {/* Author */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href={`/profile/${recipe.author.username}`}
            className="inline-flex items-center gap-2"
          >
            {recipe.author.avatarUrl ? (
              <Image
                src={recipe.author.avatarUrl}
                alt={recipe.author.displayName}
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <span
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${getAvatarColor(recipe.author.username)}`}
              >
                {recipe.author.displayName.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="text-sm text-gray-500 hover:text-gray-700">
              by {recipe.author.displayName}
            </span>
          </Link>
          {totalRatings > 0 && (
            <span className="text-xs text-gray-400">
              {totalRatings} review{totalRatings !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Stats row */}
        <div className="mb-1 grid grid-cols-3 divide-x divide-gray-200 rounded-2xl border border-gray-200 bg-white py-3">
          <div className="flex flex-col items-center gap-0.5 px-3">
            <span className="text-base font-bold text-gray-900">{formatTime(totalTime)}</span>
            <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
              Time
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5 px-3">
            <span className="text-base font-bold text-gray-900">{recipe.servings}</span>
            <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
              Servings
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5 px-3">
            <span className="text-base font-bold text-gray-900">
              {recipe.difficulty ? DIFFICULTY_LABELS[recipe.difficulty] : '—'}
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
              Level
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <RecipeDetailTabs
        recipe={recipe}
        recipeId={id}
        commentCount={commentCount}
        isOwner={isOwner}
      />
    </div>
  );
};

export default RecipeDetailPage;
