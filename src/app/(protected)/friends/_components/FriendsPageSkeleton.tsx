import { Skeleton } from '@/components/ui/Skeleton';

const FriendRowSkeleton = () => (
  <div className="flex items-center gap-3 py-3.5">
    <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
    <div className="flex flex-1 flex-col gap-1.5">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-3 w-40" />
    </div>
    <div className="flex shrink-0 gap-2">
      <Skeleton className="h-8 w-20 rounded-lg" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
  </div>
);

export const FriendsPageSkeleton = () => (
  <div className="mx-auto max-w-lg px-4 pt-5 pb-10">
    <div className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>

    <div className="mb-5 flex gap-1 border-b border-(--border) pb-3">
      <Skeleton className="h-5 w-24 rounded" />
      <Skeleton className="h-5 w-20 rounded" />
      <Skeleton className="h-5 w-20 rounded" />
    </div>

    <Skeleton className="mb-4 h-10 w-full rounded-full" />

    <div className="divide-y divide-(--border)">
      <FriendRowSkeleton />
      <FriendRowSkeleton />
      <FriendRowSkeleton />
    </div>
  </div>
);
