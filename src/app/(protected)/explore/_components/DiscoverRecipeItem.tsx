'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CATEGORY_LABELS } from '@/lib/recipe-enums';
import type { IRecipeDto } from '@/interfaces/IRecipe';

const CATEGORY_COLORS: Record<number, string> = {
  0: 'bg-amber-200',
  1: 'bg-lime-200',
  2: 'bg-orange-200',
  3: 'bg-rose-200',
  4: 'bg-yellow-200',
  5: 'bg-red-200',
  6: 'bg-sky-200',
  7: 'bg-green-200',
  8: 'bg-amber-100',
  9: 'bg-teal-200',
  10: 'bg-gray-200',
};

interface IDiscoverRecipeItemProps {
  recipe: IRecipeDto;
}

export const DiscoverRecipeItem = ({ recipe }: IDiscoverRecipeItemProps) => {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="flex items-center gap-4 rounded-2xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
        {recipe.imageUrl ? (
          <Image src={recipe.imageUrl} alt={recipe.title} fill className="object-cover" />
        ) : (
          <div className={`h-full w-full ${CATEGORY_COLORS[recipe.category] ?? 'bg-gray-200'}`} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-[#b07050]">
          {CATEGORY_LABELS[recipe.category]}
        </p>
        <p className="truncate text-sm font-bold text-gray-900">{recipe.title}</p>
        <p className="mt-0.5 text-xs text-gray-400">by {recipe.author.displayName}</p>
      </div>
    </Link>
  );
};
