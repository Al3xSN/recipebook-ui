import { Skeleton } from '@/components/ui/Skeleton';
import { RecipeCardSkeleton } from './_components/RecipeCardSkeleton';

const RecipesLoading = () => {
  return (
    <div style={{ padding: '20px 20px 8px' }}>
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-52" />
        </div>
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-[38px] w-[38px] rounded-xl" />
          <Skeleton className="h-[38px] w-[38px] rounded-xl" />
        </div>
      </div>

      {/* Featured card */}
      <Skeleton className="mb-5 h-[210px] w-full rounded-[20px]" />

      {/* Pills */}
      <div className="mb-5 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-16 rounded-full" />
        ))}
      </div>

      {/* Recipe list */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default RecipesLoading;
