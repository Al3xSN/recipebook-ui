import Link from 'next/link';
import Image from 'next/image';
import { CATEGORY_LABELS, TAG_LABELS } from '@/lib/recipe-enums';
import { Visibility } from '@generated/prisma/client';
import type { IRecipeDto } from '@/interfaces/IRecipe';
import { BookIcon, ClockIcon, UsersIcon } from '@/components/icons';

interface IRecipeCardProps {
  recipe: IRecipeDto;
  showVisibility?: boolean;
  currentUserId?: string;
}

export const RecipeCard = ({ recipe, showVisibility = false, currentUserId }: IRecipeCardProps) => {
  const totalMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
  const showAuthor = recipe.userId !== currentUserId;

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <article className="relative flex flex-col overflow-hidden rounded-2xl border border-solid border-(--border) bg-(--card) shadow-(--shadow-card) transition-all duration-150">
      {/* Image */}
      <div className="relative h-44 w-full">
        {showVisibility && recipe.visibility === Visibility.PRIVATE && (
          <span className="absolute top-2 left-2 z-10 rounded-full bg-[rgba(61,43,31,0.65)] px-2 py-0.5 text-xs font-medium text-white">
            Private
          </span>
        )}
        {showVisibility && recipe.visibility === Visibility.FRIENDS_ONLY && (
          <span className="absolute top-2 left-2 z-10 rounded-full bg-[rgba(61,43,31,0.65)] px-2 py-0.5 text-xs font-medium text-white">
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
          <div className="flex h-full w-full items-center justify-center bg-(--bg2)">
            <BookIcon className="h-10 w-10 text-(--border)" strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        {/* Category label */}
        <span className="text-[10px] font-semibold tracking-[0.1em] text-(--text3) uppercase">
          {CATEGORY_LABELS[recipe.category] ?? 'Other'}
        </span>

        {/* Title — stretched link covers the full card */}
        <h2 className="line-clamp-2 text-[17px] leading-snug font-semibold text-(--text)">
          <Link href={`/recipes/${recipe.id}`} className="after:absolute after:inset-0">
            {recipe.title}
          </Link>
        </h2>

        {/* Meta: time + servings */}
        <div className="flex items-center gap-3 text-[13px] text-(--text2)">
          <span className="flex items-center gap-1">
            <ClockIcon className="h-3.5 w-3.5" />
            {formatTime(totalMinutes)}
          </span>
          <span className="flex items-center gap-1">
            <UsersIcon className="h-3.5 w-3.5" />
            {recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Tags */}
        {recipe.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1 pt-1">
            {recipe.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-(--bg2) px-2 py-0.5 text-[11px] font-medium text-(--text2)"
              >
                #{TAG_LABELS[tag] ?? tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="rounded-full bg-(--bg2) px-2 py-0.5 text-[11px] font-medium text-(--text3)">
                +{recipe.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Author byline — relative z-10 sits above the stretched link overlay */}
        {showAuthor && (
          <Link
            href={`/profile/${recipe.author.username}`}
            className="relative z-10 mt-auto flex cursor-pointer items-center gap-2 border-t border-(--border) pt-3"
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
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-(--bg2) text-xs font-semibold text-(--accent)">
                {recipe.author.displayName.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="truncate text-xs text-(--text2)">{recipe.author.displayName}</span>
          </Link>
        )}
      </div>
    </article>
  );
};
