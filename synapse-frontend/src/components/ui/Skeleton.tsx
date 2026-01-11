export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-md ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}