import Link from 'next/link';
import Image from 'next/image';
import { CATEGORY_LABELS } from '@/lib/recipe-enums';
import { IRecipeCardDto } from '@/interfaces/IRecipe';
import { BookIcon, ClockIcon, StarIcon } from '@/components/icons';

interface IRecipeListCardProps {
  recipe: IRecipeCardDto;
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
  const totalMinutes = recipe.prepTime + recipe.cookTime;

  return (
    <article className="relative flex items-center gap-3 rounded-2xl border border-solid border-(--border) bg-(--card) p-3 shadow-(--shadow-card-sm)">
      <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl bg-(--bg2)">
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-contain"
            sizes="72px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-(--bg2)">
            <BookIcon className="h-7 w-7 text-(--border)" strokeWidth={1.5} />
          </div>
        )}

        {showVisibility && recipe.visibility === 'PRIVATE' && (
          <span className="absolute bottom-1 left-1 rounded-md bg-[rgba(61,43,31,0.7)] px-1.5 py-0.5 text-[9px] font-semibold text-white">
            Private
          </span>
        )}

        {showVisibility && recipe.visibility === 'FRIENDS_ONLY' && (
          <span className="absolute bottom-1 left-1 rounded-md bg-[rgba(61,43,31,0.7)] px-1.5 py-0.5 text-[9px] font-semibold text-white">
            Friends
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-semibold tracking-[0.08em] text-(--accent) uppercase">
          {CATEGORY_LABELS[recipe.category] ?? 'Other'}
        </span>

        <h2 className="mt-0.5 truncate text-[15px] leading-snug font-semibold text-(--text)">
          <Link href={`/recipes/${recipe.id}`} className="after:absolute after:inset-0">
            {recipe.title}
          </Link>
        </h2>

        {showAuthor && (
          <p className="mt-0.5 truncate text-[12px] text-(--text2)">by {recipe.createdBy}</p>
        )}

        <div className="mt-2 flex items-center gap-3 text-[12px] text-(--text2)">
          <span className="flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />

            {formatTime(totalMinutes)}
          </span>

          {recipe.averageRating && (
            <span className="flex items-center gap-1">
              <StarIcon className="h-3 w-3 text-amber-400" fill="currentColor" />
              {recipe.averageRating!.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
