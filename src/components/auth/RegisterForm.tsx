'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react'
import { registerWithCredentials } from '@/actions/auth'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function RegisterForm() {
  const [pending, setPending] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [serverSuccess, setServerSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  })
  const password = useWatch({ control, name: 'password' }) || ''

  const strength = useMemo(() => {
    let score = 0
    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    return score
  }, [password])

  const onSubmit = handleSubmit(async (values) => {
    setPending(true)
    setServerError(null)
    setServerSuccess(null)
    const result = await registerWithCredentials(values)
    if (result?.fieldErrors) {
      Object.entries(result.fieldErrors).forEach(([key, messages]) => {
        if (messages?.[0]) setError(key as keyof RegisterInput, { message: messages[0] })
      })
    }
    if (result?.error) {
      setServerError(result.error)
      setPending(false)
      return
    }
    if (result?.success) {
      setServerSuccess(result.success)
      setPending(false)
    }
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-slate-700">Full Name</Label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input id="full_name" className="h-11 rounded-xl border-slate-200 bg-slate-50/70 pl-9" {...register('full_name')} />
        </div>
        {errors.full_name?.message && <p className="text-sm text-red-600">{errors.full_name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input id="email" type="email" className="h-11 rounded-xl border-slate-200 bg-slate-50/70 pl-9" {...register('email')} />
        </div>
        {errors.email?.message && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-700">Password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input id="password" type={showPassword ? 'text' : 'password'} className="h-11 rounded-xl border-slate-200 bg-slate-50/70 pl-9 pr-10" {...register('password')} />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-800" onClick={() => setShowPassword((v) => !v)}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs text-slate-600">
          Password strength: <span className={strength >= 3 ? 'text-emerald-600' : strength === 2 ? 'text-amber-600' : 'text-rose-600'}>
            {strength >= 3 ? 'Strong' : strength === 2 ? 'Medium' : 'Weak'}
          </span>
        </div>
        {errors.password?.message && <p className="text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm_password" className="text-slate-700">Confirm Password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input id="confirm_password" type={showConfirmPassword ? 'text' : 'password'} className="h-11 rounded-xl border-slate-200 bg-slate-50/70 pl-9 pr-10" {...register('confirm_password')} />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-800" onClick={() => setShowConfirmPassword((v) => !v)}>
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirm_password?.message && <p className="text-sm text-red-600">{errors.confirm_password.message}</p>}
      </div>

      {serverError && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>}
      {serverSuccess && <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{serverSuccess}</p>}

      <Button type="submit" className="h-11 w-full" disabled={pending}>
        {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</> : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-cyan-700 hover:text-cyan-800">Sign In</Link>
      </p>
    </form>
  )
}
