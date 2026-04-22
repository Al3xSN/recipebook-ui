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
    <article
      className="relative flex flex-col overflow-hidden"
      style={{
        borderRadius: 16,
        border: '1px solid var(--border)',
        background: 'var(--card)',
        boxShadow: '0 2px 14px rgba(61,43,31,0.07)',
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
    >
      {/* Image */}
      <div className="relative h-44 w-full">
        {showVisibility && recipe.visibility === Visibility.PRIVATE && (
          <span
            className="absolute left-2 top-2 z-10 px-2 py-0.5 text-xs font-medium text-white"
            style={{ borderRadius: 100, background: 'rgba(61,43,31,0.65)' }}
          >
            Private
          </span>
        )}
        {showVisibility && recipe.visibility === Visibility.FRIENDS_ONLY && (
          <span
            className="absolute left-2 top-2 z-10 px-2 py-0.5 text-xs font-medium text-white"
            style={{ borderRadius: 100, background: 'rgba(61,43,31,0.65)' }}
          >
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
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: 'var(--bg2)' }}
          >
            <BookIcon className="h-10 w-10" style={{ color: 'var(--border)' }} strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        {/* Category label */}
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text3)',
          }}
        >
          {CATEGORY_LABELS[recipe.category] ?? 'Other'}
        </span>

        {/* Title — stretched link covers the full card */}
        <h2
          className="line-clamp-2 leading-snug"
          style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)' }}
        >
          <Link href={`/recipes/${recipe.id}`} className="after:absolute after:inset-0">
            {recipe.title}
          </Link>
        </h2>

        {/* Meta: time + servings */}
        <div className="flex items-center gap-3" style={{ fontSize: 13, color: 'var(--text2)' }}>
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
                style={{
                  borderRadius: 100,
                  background: 'var(--bg2)',
                  color: 'var(--text2)',
                  fontSize: 11,
                  fontWeight: 500,
                  padding: '2px 8px',
                }}
              >
                #{TAG_LABELS[tag] ?? tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span
                style={{
                  borderRadius: 100,
                  background: 'var(--bg2)',
                  color: 'var(--text3)',
                  fontSize: 11,
                  fontWeight: 500,
                  padding: '2px 8px',
                }}
              >
                +{recipe.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Author byline — relative z-10 sits above the stretched link overlay */}
        {showAuthor && (
          <Link
            href={`/profile/${recipe.author.username}`}
            className="relative z-10 mt-auto flex cursor-pointer items-center gap-2 pt-3"
            style={{ borderTop: '1px solid var(--border)' }}
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
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                style={{ background: 'var(--bg2)', color: 'var(--accent)' }}
              >
                {recipe.author.displayName.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="truncate text-xs" style={{ color: 'var(--text2)' }}>
              {recipe.author.displayName}
            </span>
          </Link>
        )}
      </div>
    </article>
  );
};
