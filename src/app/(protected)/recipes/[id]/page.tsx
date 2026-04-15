import { notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { CATEGORY_LABELS, UNIT_LABELS } from '@/lib/recipe-enums';
import { RatingStars } from './_components/RatingStars';
import { CommentList } from './_components/CommentList';

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

function getAvatarColor(username: string): string {
  return AVATAR_COLORS[username.charCodeAt(0) % AVATAR_COLORS.length];
}

function formatTime(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;

  const recipe = await db.recipe.findUnique({
    where: { id },
    include: { ingredients: true, instructions: true, tags: true, user: true },
  });

  if (!recipe) notFound();

  const isOwner = recipe.userId === session?.user?.id;

  if (!isOwner) {
    if (recipe.visibility === 0) {
      notFound();
    } else if (recipe.visibility === 2) {
      const friendship = await db.friendship.findFirst({
        where: {
          OR: [
            { userAId: session!.user!.id, userBId: recipe.userId },
            { userAId: recipe.userId, userBId: session!.user!.id },
          ],
        },
      });
      if (!friendship) notFound();
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Hero image */}
      <div className="relative mb-6 overflow-hidden rounded-2xl">
        {recipe.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={recipe.imageUrl} alt={recipe.title} className="h-72 w-full object-cover" />
        ) : (
          <div className="flex h-72 w-full items-center justify-center bg-orange-50">
            <svg
              className="h-16 w-16 text-orange-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
        )}

        {/* Edit button */}
        {isOwner && (
          <Link
            href={`/recipes/${id}/edit`}
            className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-orange-500"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </Link>
        )}
      </div>

      {/* Category + Title */}
      <div className="mb-2">
        <span className="inline-block rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">
          {CATEGORY_LABELS[recipe.category] ?? 'Other'}
        </span>
      </div>
      <h1 className="mb-3 text-3xl font-bold tracking-tight text-gray-900">{recipe.title}</h1>

      {/* Author byline */}
      {!isOwner && (
        <Link
          href={`/profile/${recipe.user.username ?? ''}`}
          className="mb-4 inline-flex items-center gap-2"
        >
          {recipe.user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={recipe.user.avatarUrl}
              alt={recipe.user.displayName ?? recipe.user.username ?? ''}
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : (
            <span
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${getAvatarColor(recipe.user.username ?? '')}`}
            >
              {(recipe.user.displayName ?? recipe.user.username ?? '?').charAt(0).toUpperCase()}
            </span>
          )}
          <span className="text-sm text-gray-500 hover:text-gray-700">
            {recipe.user.displayName ?? recipe.user.username}
          </span>
        </Link>
      )}

      {/* Meta row */}
      <div className="mb-6 flex flex-wrap gap-6 text-sm text-gray-500">
        <span className="flex items-center gap-1.5">
          <svg
            className="h-4 w-4 text-orange-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>
            <span className="font-medium text-gray-700">Prep</span>{' '}
            {formatTime(recipe.prepTimeMinutes)}
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <svg
            className="h-4 w-4 text-orange-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>
            <span className="font-medium text-gray-700">Cook</span>{' '}
            {formatTime(recipe.cookTimeMinutes)}
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <svg
            className="h-4 w-4 text-orange-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>
            <span className="font-medium text-gray-700">Serves</span> {recipe.servings}
          </span>
        </span>
      </div>

      {/* Description */}
      {recipe.description && (
        <p className="mb-8 leading-relaxed text-gray-600">{recipe.description}</p>
      )}

      <hr className="mb-8 border-gray-200" />

      {/* Ingredients */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Ingredients</h2>
        <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
          {recipe.ingredients.map((ing, i) => (
            <li key={i} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium text-gray-900">{ing.name}</span>
              <span className="text-sm text-gray-500">
                {Number(ing.amount)} {UNIT_LABELS[ing.unit]}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Instructions */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Instructions</h2>
        <ol className="flex flex-col gap-4">
          {recipe.instructions
            .sort((a, b) => a.stepNumber - b.stepNumber)
            .map((step) => (
              <li key={step.stepNumber} className="flex gap-4">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                  {step.stepNumber}
                </span>
                <p className="pt-0.5 leading-relaxed text-gray-700">{step.text}</p>
              </li>
            ))}
        </ol>
      </section>

      <hr className="mb-8 border-gray-200" />

      {/* Rating — only show for non-owners */}
      {!isOwner && (
        <>
          <section className="mb-8">
            <RatingStars recipeId={id} />
          </section>
          <hr className="mb-8 border-gray-200" />
        </>
      )}

      {/* Comments */}
      <section>
        <CommentList recipeId={id} />
      </section>
    </div>
  );
}
