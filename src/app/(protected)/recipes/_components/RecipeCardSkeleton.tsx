import { Skeleton } from '@/components/ui/Skeleton';

export const RecipeCardSkeleton = () => {
  return (
    <div
      className="flex items-center gap-3"
      style={{
        borderRadius: 16,
        border: '1px solid var(--border)',
        background: 'var(--card)',
        padding: '12px',
        boxShadow: '0 2px 10px rgba(61,43,31,0.06)',
      }}
    >
      <Skeleton className="h-[72px] w-[72px] flex-shrink-0 rounded-xl" />
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
