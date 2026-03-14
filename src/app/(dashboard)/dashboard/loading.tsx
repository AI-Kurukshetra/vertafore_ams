import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="glass-panel rounded-2xl p-6">
        <Skeleton className="h-5 w-36 rounded-full" />
        <Skeleton className="mt-4 h-10 w-80" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-panel rounded-2xl p-4 space-y-3">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="glass-panel rounded-2xl p-4 space-y-3">
            <Skeleton className="h-6 w-36" />
            {Array.from({ length: 5 }).map((_, j) => (
              <Skeleton key={j} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
