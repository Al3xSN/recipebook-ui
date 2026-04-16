import { Skeleton } from '@/components/ui/Skeleton';
import { RecipeCardSkeleton } from '../../recipes/_components/RecipeCardSkeleton';

export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Profile header */}
      <div className="mb-6 flex items-start gap-5">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-1 h-4 w-64" />
          <Skeleton className="mt-2 h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-6 flex gap-4">
        <Skeleton className="h-12 w-24 rounded-xl" />
        <Skeleton className="h-12 w-24 rounded-xl" />
        <Skeleton className="h-12 w-24 rounded-xl" />
      </div>

      {/* Section heading */}
      <Skeleton className="mb-4 h-5 w-24" />

      {/* Recipe grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
