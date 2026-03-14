import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-36 rounded-xl" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>

      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-4 w-80" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-panel rounded-2xl p-5 space-y-3">
            <Skeleton className="h-6 w-44" />
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
