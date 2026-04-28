import { Skeleton } from '@/components/ui/Skeleton';

export const RecipeCardSkeleton = () => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-solid border-(--border) bg-(--card) p-3 shadow-(--shadow-card-sm)">
      <Skeleton className="h-18 w-18 shrink-0 rounded-xl" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-2.5 w-14" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
};
