import Link from 'next/link';
import Image from 'next/image';
import { CATEGORY_LABELS, TAG_LABELS } from '@/lib/recipe-enums';
import { Visibility } from '@generated/prisma/client';
import type { RecipeDto } from '@/types/recipe';

interface RecipeCardProps {
  recipe: RecipeDto;
  showVisibility?: boolean;
  currentUserId?: string;
}

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

export function RecipeCard({ recipe, showVisibility = false, currentUserId }: RecipeCardProps) {
  const totalMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
  const showAuthor = recipe.userId !== currentUserId;

  function formatTime(minutes: number) {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }

  return (
    <article className="relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative h-40 w-full">
        {showVisibility && recipe.visibility === Visibility.PRIVATE && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-gray-800/70 px-2 py-0.5 text-xs font-medium text-white">
            Private
          </span>
        )}
        {showVisibility && recipe.visibility === Visibility.FRIENDS_ONLY && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-blue-600/80 px-2 py-0.5 text-xs font-medium text-white">
            Friends only
          </span>
        )}
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-orange-50">
            <svg
              className="h-10 w-10 text-orange-200"
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
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Category badge */}
        <div>
          <span className="inline-block rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">
            {CATEGORY_LABELS[recipe.category] ?? 'Other'}
          </span>
        </div>

        {/* Title — stretched link covers the full card */}
        <h2 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900">
          <Link href={`/recipes/${recipe.id}`} className="after:absolute after:inset-0">
            {recipe.title}
          </Link>
        </h2>

        {/* Meta: time + servings */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
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
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {formatTime(totalMinutes)}
          </span>
          <span className="flex items-center gap-1">
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Tags */}
        {recipe.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1 pt-1">
            {recipe.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
              >
                {TAG_LABELS[tag] ?? tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                +{recipe.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Author byline — relative z-10 sits above the stretched link overlay */}
        {showAuthor && (
          <Link
            href={`/profile/${recipe.author.username}`}
            className="relative z-10 mt-auto flex cursor-pointer items-center gap-2 border-t border-gray-100 pt-3"
          >
            {recipe.author.avatarUrl ? (
              <Image
                src={recipe.author.avatarUrl}
                alt={recipe.author.displayName}
                width={24}
                height={24}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <span
                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${getAvatarColor(recipe.author.username)}`}
              >
                {recipe.author.displayName.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="truncate text-xs text-gray-500 hover:text-gray-700">
              {recipe.author.displayName}
            </span>
          </Link>
        )}
      </div>
    </article>
  );
}
