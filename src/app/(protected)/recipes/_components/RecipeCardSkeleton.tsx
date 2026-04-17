import { Skeleton } from '@/components/ui/Skeleton';

export const RecipeCardSkeleton = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Image */}
      <Skeleton className="h-40 w-full rounded-none" />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Category badge */}
        <Skeleton className="h-5 w-16 rounded-full" />

        {/* Title */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Meta: time + servings */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Tags */}
        <div className="mt-auto flex gap-1 pt-1">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>

        {/* Author byline */}
        <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
};
