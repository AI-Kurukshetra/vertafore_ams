import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="glass-panel rounded-2xl p-5 space-y-2">
        <Skeleton className="h-4 w-36 rounded-full" />
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="glass-panel rounded-2xl p-2 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
