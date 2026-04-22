import { Skeleton } from '@/components/ui/Skeleton';
import { RecipeCardSkeleton } from '../../recipes/_components/RecipeCardSkeleton';

const ProfileLoading = () => {
  return (
    <div style={{ padding: '20px 20px 8px' }}>
      {/* Profile header */}
      <div className="mb-6 flex items-start gap-4">
        <Skeleton className="h-20 w-20 flex-shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-1 h-4 w-64" />
          <Skeleton className="mt-2 h-9 w-28 rounded-xl" />
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-6 flex gap-4">
        <Skeleton className="h-12 w-24 rounded-xl" />
        <Skeleton className="h-12 w-24 rounded-xl" />
        <Skeleton className="h-12 w-24 rounded-xl" />
      </div>

      {/* Recipe list */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default ProfileLoading;
