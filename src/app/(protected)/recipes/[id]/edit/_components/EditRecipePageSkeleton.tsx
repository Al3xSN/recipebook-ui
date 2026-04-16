import { Skeleton } from '@/components/ui/Skeleton';

function SectionSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

export function EditRecipePageSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Title */}
      <div className="mb-8">
        <Skeleton className="h-7 w-40" />
      </div>

      <div className="flex flex-col gap-8">
        <SectionSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />

        {/* Actions */}
        <div className="flex gap-3 border-t border-gray-200 pt-6">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
