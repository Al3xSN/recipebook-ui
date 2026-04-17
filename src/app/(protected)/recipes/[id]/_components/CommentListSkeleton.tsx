import { Skeleton } from '@/components/ui/Skeleton';

const CommentRowSkeleton = () => {
  return (
    <div className="flex gap-3">
      <Skeleton className="h-8 w-8 flex-shrink-0 rounded-full" />
      <div className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3">
        <div className="mb-2 flex items-center gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-1.5 h-4 w-2/3" />
      </div>
    </div>
  );
};

export const CommentListSkeleton = () => {
  return (
    <div className="mb-6 flex flex-col gap-4">
      <CommentRowSkeleton />
      <CommentRowSkeleton />
      <CommentRowSkeleton />
    </div>
  );
};
