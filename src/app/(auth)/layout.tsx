import { ShieldCheck, Sparkles } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(14,116,144,0.22),transparent_36%),radial-gradient(circle_at_88%_18%,rgba(245,158,11,0.2),transparent_34%),linear-gradient(160deg,#f8fbff_0%,#ecfeff_52%,#eff6ff_100%)]" />
      <div className="relative z-10 w-full max-w-4xl rounded-3xl border border-white/70 bg-white/65 p-5 shadow-[0_40px_120px_-50px_rgba(15,23,42,0.5)] backdrop-blur-xl md:p-8">
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div className="hidden md:block space-y-5 px-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
              <Sparkles className="h-3.5 w-3.5" /> Vertafore-inspired workflow
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900">
              <span className="title-gradient">SmartAgency Pro</span>
            </h1>
            <p className="text-sm leading-relaxed text-slate-600">
              A modern insurance command center for high-velocity agencies. Secure operations, policy intelligence, and clean workflows.
            </p>
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Trusted operations</p>
              <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-800">
                <ShieldCheck className="h-4 w-4 text-cyan-700" /> Role-aware access and audit-ready actions
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white/92 p-5 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.6)] md:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
