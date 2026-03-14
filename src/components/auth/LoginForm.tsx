'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { loginWithCredentials } from '@/actions/auth'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  })

  const onSubmit = handleSubmit(async (values) => {
    setPending(true)
    setServerError(null)
    const result = await loginWithCredentials(values)
    if (result?.fieldErrors) {
      Object.entries(result.fieldErrors).forEach(([key, messages]) => {
        if (messages?.[0]) setError(key as keyof LoginInput, { message: messages[0] })
      })
    }
    if (result?.error) {
      setServerError(result.error)
      setPending(false)
    }
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input id="email" type="email" placeholder="you@agency.com" className="h-11 rounded-xl border-slate-200 bg-slate-50/70 pl-9" {...register('email')} />
        </div>
        {errors.email?.message && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-700">Password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input id="password" type={showPassword ? 'text' : 'password'} className="h-11 rounded-xl border-slate-200 bg-slate-50/70 pl-9 pr-10" {...register('password')} />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-800"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password?.message && <p className="text-sm text-red-600">{errors.password.message}</p>}
      </div>

      {serverError && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>}
      <Button type="submit" className="h-11 w-full" disabled={pending}>
        {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</> : 'Sign In'}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-cyan-700 hover:text-cyan-800">
          Register
        </Link>
      </p>
    </form>
  )
}
