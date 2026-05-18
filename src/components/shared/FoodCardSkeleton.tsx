import { Skeleton } from "@/components/ui/skeleton";

const FoodCardSkeleton = () => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
      {/* Image Skeleton */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      
      {/* Content Skeleton */}
      <div className="flex flex-col flex-1 p-6 space-y-4">
        <div className="flex justify-between items-start">
          <Skeleton className="h-7 w-2/3 rounded-lg" />
          <Skeleton className="h-7 w-12 rounded-lg" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
        </div>

        {/* Meta Info Skeletons */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-3 w-16 rounded-sm" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-3 w-16 rounded-sm" />
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="mt-auto pt-2">
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default FoodCardSkeleton;
