import { Skeleton } from '@/components/ui/Skeleton';
import { RecipeCardSkeleton } from '../recipes/_components/RecipeCardSkeleton';

const ExploreLoading = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-2 h-4 w-56" />
      </div>

      {/* Filter bar */}
      <Skeleton className="mb-8 h-32 w-full rounded-xl" />

      {/* Recipe grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default ExploreLoading;
