import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700/80">Welcome back</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Sign in to your workspace</h2>
      <p className="mt-1 text-sm text-slate-500">Continue managing clients, coverage, and renewals.</p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </div>
  )
}
