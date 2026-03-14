import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="p-6 space-y-4">
      <div className="glass-panel rounded-2xl p-5 space-y-2">
        <Skeleton className="h-4 w-36 rounded-full" />
        <Skeleton className="h-9 w-56" />
      </div>

      <div className="glass-panel rounded-2xl p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <Skeleton className="h-11 w-full md:w-80 rounded-xl" />
          <Skeleton className="h-11 w-full md:w-40 rounded-xl" />
          <Skeleton className="h-11 w-full md:w-40 rounded-xl" />
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-2 space-y-2">
        <Skeleton className="h-12 w-full rounded-xl" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
