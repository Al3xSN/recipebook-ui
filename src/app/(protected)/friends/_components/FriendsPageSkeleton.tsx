import { Skeleton } from '@/components/ui/Skeleton';

const FriendRowSkeleton = () => {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="flex flex-shrink-0 gap-2">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
};

export const FriendsPageSkeleton = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Title */}
      <div className="mb-6">
        <Skeleton className="h-7 w-24" />
      </div>

      {/* TabBar */}
      <div className="mb-6 flex gap-2">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>

      {/* Friend rows */}
      <div className="flex flex-col gap-2">
        <FriendRowSkeleton />
        <FriendRowSkeleton />
        <FriendRowSkeleton />
      </div>
    </div>
  );
};
