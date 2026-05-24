export function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="aspect-[3/4] rounded-2xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      <div className="space-y-2">
        <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8 animate-pulse">
      <div className="aspect-[3/4] rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
      <div className="space-y-4">
        <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-8 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-24 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
      </div>
    </div>
  );
}
