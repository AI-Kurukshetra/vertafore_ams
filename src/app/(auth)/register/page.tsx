import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700/80">Get started</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Create your agency account</h2>
      <p className="mt-1 text-sm text-slate-500">Launch your modern AMS workflow in seconds.</p>
      <div className="mt-6">
        <RegisterForm />
      </div>
    </div>
  )
}
