import Link from 'next/link';
import Image from 'next/image';
import { CATEGORY_LABELS } from '@/lib/recipe-enums';
import type { IRecipeDto } from '@/interfaces/IRecipe';
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
      className="relative block overflow-hidden"
      style={{ borderRadius: 20, height: 210 }}
    >
      {/* Background image */}
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
        <div style={{ position: 'absolute', inset: 0, background: 'var(--bg2)' }} />
      )}

      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(30,16,8,0.85) 0%, rgba(30,16,8,0.2) 55%, transparent 100%)',
        }}
      />

      {/* Top badges */}
      <div className="absolute left-3 top-3 flex gap-2">
        <span
          className="text-white"
          style={{
            borderRadius: 100,
            background: 'var(--accent)',
            padding: '4px 10px',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Featured
        </span>
        <span
          className="text-white"
          style={{
            borderRadius: 100,
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(4px)',
            padding: '4px 10px',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {CATEGORY_LABELS[recipe.category] ?? 'Other'}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h2
          className="line-clamp-2 leading-tight text-white"
          style={{ fontSize: 20, fontWeight: 700 }}
        >
          {recipe.title}
        </h2>
        <div
          className="mt-2 flex items-center gap-4"
          style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}
        >
          {recipe.ratingCount > 0 && (
            <span className="flex items-center gap-1">
              <StarIcon className="h-3.5 w-3.5" fill="currentColor" style={{ color: '#f59e0b' }} />
              {recipe.averageRating!.toFixed(1)}
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>
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
