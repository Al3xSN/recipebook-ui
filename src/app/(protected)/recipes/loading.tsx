import { Skeleton } from '@/components/ui/Skeleton';
import { RecipeCardSkeleton } from './_components/RecipeCardSkeleton';

export default function RecipesLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      {/* Filter bar */}
      <Skeleton className="mb-8 h-24 w-full rounded-xl" />

      {/* Recipe grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
