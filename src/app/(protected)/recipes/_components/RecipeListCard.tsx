import Link from 'next/link';
import Image from 'next/image';
import { CATEGORY_LABELS } from '@/lib/recipe-enums';
import type { IRecipeDto } from '@/interfaces/IRecipe';
import { BookIcon, ClockIcon, StarIcon } from '@/components/icons';

interface IRecipeListCardProps {
  recipe: IRecipeDto;
  showAuthor?: boolean;
  showVisibility?: boolean;
}

const formatTime = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

export const RecipeListCard = ({
  recipe,
  showAuthor = false,
  showVisibility = false,
}: IRecipeListCardProps) => {
  const totalMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <article
      className="relative flex items-center gap-3"
      style={{
        borderRadius: 16,
        border: '1px solid var(--border)',
        background: 'var(--card)',
        padding: '12px',
        boxShadow: '0 2px 10px rgba(61,43,31,0.06)',
      }}
    >
      {/* Thumbnail */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{ width: 72, height: 72, borderRadius: 12 }}
      >
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="72px"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: 'var(--bg2)' }}
          >
            <BookIcon className="h-7 w-7" style={{ color: 'var(--border)' }} strokeWidth={1.5} />
          </div>
        )}

        {showVisibility && recipe.visibility === 'PRIVATE' && (
          <span
            className="absolute bottom-1 left-1 px-1.5 py-0.5 text-white"
            style={{
              borderRadius: 6,
              background: 'rgba(61,43,31,0.7)',
              fontSize: 9,
              fontWeight: 600,
            }}
          >
            Private
          </span>
        )}
        {showVisibility && recipe.visibility === 'FRIENDS_ONLY' && (
          <span
            className="absolute bottom-1 left-1 px-1.5 py-0.5 text-white"
            style={{
              borderRadius: 6,
              background: 'rgba(61,43,31,0.7)',
              fontSize: 9,
              fontWeight: 600,
            }}
          >
            Friends
          </span>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
          }}
        >
          {CATEGORY_LABELS[recipe.category] ?? 'Other'}
        </span>

        <h2
          className="truncate leading-snug"
          style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginTop: 2 }}
        >
          <Link href={`/recipes/${recipe.id}`} className="after:absolute after:inset-0">
            {recipe.title}
          </Link>
        </h2>

        {showAuthor && (
          <p className="truncate" style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
            by {recipe.author.displayName}
          </p>
        )}

        <div
          className="mt-2 flex items-center gap-3"
          style={{ fontSize: 12, color: 'var(--text2)' }}
        >
          <span className="flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />
            {formatTime(totalMinutes)}
          </span>
          {recipe.ratingCount > 0 && (
            <span className="flex items-center gap-1">
              <StarIcon className="h-3 w-3" fill="currentColor" style={{ color: '#f59e0b' }} />
              {recipe.averageRating!.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
