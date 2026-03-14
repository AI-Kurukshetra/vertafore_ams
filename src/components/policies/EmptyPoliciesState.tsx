import { FileText } from 'lucide-react'

export default function EmptyPoliciesState() {
  return (
    <div className="glass-panel rounded-2xl border-dashed p-12 text-center">
      <FileText className="mx-auto h-10 w-10 text-cyan-600" />
      <h3 className="mt-4 text-lg font-semibold text-slate-900">No policies found</h3>
      <p className="mt-1 text-sm text-slate-600">Create your first policy to start tracking coverage and renewals.</p>
    </div>
  )
}
