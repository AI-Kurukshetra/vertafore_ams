import { Users } from 'lucide-react'

export default function EmptyClientsState() {
  return (
    <div className="glass-panel rounded-2xl border-dashed p-12 text-center">
      <Users className="mx-auto h-10 w-10 text-cyan-600" />
      <h3 className="mt-4 text-lg font-semibold text-slate-900">No clients found</h3>
      <p className="mt-1 text-sm text-slate-600">Try changing your filters or add a new client profile.</p>
    </div>
  )
}
