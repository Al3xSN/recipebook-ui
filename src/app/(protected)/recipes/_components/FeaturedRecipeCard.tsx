import Link from 'next/link';
import Image from 'next/image';
import { CATEGORY_LABELS } from '@/lib/recipe-enums';
import { IRecipeDto } from '@/interfaces/IRecipe';
import { ClockIcon, StarIcon } from '@/components/icons';

interface IFeaturedRecipeCardProps {
  recipe: IRecipeDto;
}

const formatTime = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

export const FeaturedRecipeCard = ({ recipe }: IFeaturedRecipeCardProps) => {
  const totalMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="relative block h-56 overflow-hidden rounded-2xl"
    >
      {recipe.imageUrl ? (
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-(--bg2)" />
      )}

      <div className="absolute inset-0 [background:var(--gradient-card-overlay)]" />

      <div className="absolute top-3 left-3 flex gap-2">
        <span className="rounded-full bg-(--accent) px-1 py-2.5 text-[10px] font-semibold tracking-wider text-white uppercase">
          Featured
        </span>
        <span className="rounded-full bg-white/20 px-1 py-2.5 text-[10px] font-semibold tracking-wider text-white uppercase backdrop-blur-sm">
          {CATEGORY_LABELS[recipe.category] ?? 'Other'}
        </span>
      </div>

      <div className="absolute right-0 bottom-0 left-0 p-4">
        <h2 className="line-clamp-2 text-xl leading-tight font-bold text-white">{recipe.title}</h2>
        <div className="mt-2 flex items-center gap-4 text-[13px] text-white/80">
          {recipe.ratingCount > 0 && (
            <span className="flex items-center gap-1">
              <StarIcon className="h-3.5 w-3.5 fill-yellow-400" fill="currentColor" />
              {recipe.averageRating!.toFixed(1)}
              <span className="text-white/50">
                · {recipe.ratingCount} review{recipe.ratingCount !== 1 ? 's' : ''}
              </span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <ClockIcon className="h-3.5 w-3.5" />
            {formatTime(totalMinutes)}
          </span>
        </div>
      </div>
    </Link>
  );
};
