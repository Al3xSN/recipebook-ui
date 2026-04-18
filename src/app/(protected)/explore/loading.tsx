import { Skeleton } from '@/components/ui/Skeleton';

const ExploreLoading = () => {
  return (
    <div className="min-h-screen px-4 py-8">
      {/* Header */}
      <Skeleton className="mb-5 h-9 w-36" />

      {/* Search bar */}
      <Skeleton className="mb-5 h-12 w-full rounded-2xl" />

      {/* Trending label */}
      <Skeleton className="mb-3 h-3 w-32" />

      {/* Trending pills */}
      <div className="mb-7 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>

      {/* Category label */}
      <Skeleton className="mb-3 h-3 w-40" />

      {/* Category grid */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
    </div>
  );
};

export default ExploreLoading;
