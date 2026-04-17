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

const RecipeDetailLoading = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Hero image */}
      <Skeleton className="mb-6 h-72 w-full rounded-2xl" />

      {/* Category badge + title */}
      <Skeleton className="mb-3 h-5 w-16 rounded-full" />
      <Skeleton className="mb-4 h-8 w-2/3" />

      {/* Meta row */}
      <div className="mb-6 flex flex-wrap gap-6">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-20" />
      </div>

      {/* Description */}
      <div className="mb-8 flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>

      <hr className="mb-8 border-gray-200" />

      {/* Ingredients */}
      <section className="mb-8">
        <Skeleton className="mb-4 h-6 w-28" />
        <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </section>

      {/* Instructions */}
      <section className="mb-8">
        <Skeleton className="mb-4 h-6 w-28" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-7 w-7 flex-shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-2 pt-0.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="mb-8 border-gray-200" />

      {/* Comments */}
      <section>
        <Skeleton className="mb-4 h-5 w-24" />
        <div className="flex flex-col gap-4">
          <CommentRowSkeleton />
          <CommentRowSkeleton />
          <CommentRowSkeleton />
        </div>
      </section>
    </div>
  );
};

export default RecipeDetailLoading;
