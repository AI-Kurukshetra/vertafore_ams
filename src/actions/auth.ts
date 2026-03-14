'use server'

import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '@/lib/validations/auth'

export type ActionState = {
  error?: string
  success?: string
  fieldErrors?: Record<string, string[]>
}

function normalizeAuthError(message?: string) {
  if (!message) return 'Something went wrong. Please try again.'
  if (/rate limit|too many requests|email rate limit exceeded/i.test(message)) {
    return 'Too many signup attempts. Please wait a few minutes and try again.'
  }
  if (/already registered|already been registered|user already registered/i.test(message)) {
    return 'Email already registered'
  }
  return message
}

function normalizeLoginError(message?: string) {
  if (!message) return 'Something went wrong. Please try again.'
  if (/rate limit|too many requests/i.test(message)) {
    return 'Too many sign-in attempts. Please wait a few minutes and try again.'
  }
  if (/invalid login credentials|invalid email|invalid password/i.test(message)) {
    return 'Invalid email or password'
  }
  return message
}

function getAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!key || key.startsWith('REPLACE_WITH_') || !projectUrl) return null

  return createSupabaseAdminClient(projectUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

async function doLogin(data: LoginInput): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    ...data,
    email: data.email.trim().toLowerCase(),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    if (/email not confirmed|email not verified|confirm.*email/i.test(error.message)) {
      const adminClient = getAdminClient()
      if (adminClient) {
        const { data: usersData, error: usersError } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 })
        if (!usersError) {
          const matched = usersData.users.find((user) => (user.email || '').toLowerCase() === parsed.data.email)
          if (matched) {
            const { error: confirmError } = await adminClient.auth.admin.updateUserById(matched.id, { email_confirm: true })
            if (!confirmError) {
              const retry = await supabase.auth.signInWithPassword(parsed.data)
              if (!retry.error) {
                redirect('/dashboard')
              }
            }
          }
        }
      }
    }

    return { error: normalizeLoginError(error.message) }
  }

  redirect('/dashboard')
}

async function doRegister(data: RegisterInput): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    ...data,
    full_name: data.full_name.trim(),
    email: data.email.trim().toLowerCase(),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const {
    data: { user: existingUser },
  } = await supabase.auth.getUser()

  // Prevent stale sessions from showing a previously logged-in user's identity after signup.
  if (existingUser) {
    await supabase.auth.signOut()
  }

  const adminClient = getAdminClient()

  if (adminClient) {

    const { error: createError } = await adminClient.auth.admin.createUser({
      email: parsed.data.email,
      password: parsed.data.password,
      email_confirm: true,
      user_metadata: { full_name: parsed.data.full_name },
    })

    if (createError) {
      return { error: normalizeAuthError(createError.message) }
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    })

    if (signInError) {
      return { success: 'Account created. Please sign in.' }
    }

    redirect('/dashboard')
  }

  const { data: signUpData, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.full_name } },
  })

  if (error) {
    return { error: normalizeAuthError(error.message) }
  }

  // Supabase can return an obfuscated user (no identities) for existing emails.
  if (!signUpData.session && signUpData.user && Array.isArray(signUpData.user.identities) && signUpData.user.identities.length === 0) {
    return { error: 'Email already registered' }
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (signInError) {
    if (/email not confirmed|email not verified|confirm.*email/i.test(signInError.message)) {
      return { error: 'Automatic account confirmation is not configured. Set SUPABASE_SERVICE_ROLE_KEY to disable email verification in-app.' }
    }
    return { error: normalizeLoginError(signInError.message) }
  }

  redirect('/dashboard')
}

export async function loginWithCredentials(data: LoginInput): Promise<ActionState> {
  return doLogin(data)
}

export async function registerWithCredentials(data: RegisterInput): Promise<ActionState> {
  return doRegister(data)
}

export async function resendVerificationEmail(email: string): Promise<ActionState> {
  const parsed = loginSchema.shape.email.safeParse(email.trim().toLowerCase())

  if (!parsed.success) {
    return { fieldErrors: { email: ['Please enter a valid email address'] } }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: parsed.data,
  })

  if (error) {
    return { error: normalizeAuthError(error.message) }
  }

  return { success: 'Verification email sent. Please check your inbox and spam folder.' }
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return doLogin({
    email: String(formData.get('email') || ''),
    password: String(formData.get('password') || ''),
  })
}

export async function registerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return doRegister({
    full_name: String(formData.get('full_name') || ''),
    email: String(formData.get('email') || ''),
    password: String(formData.get('password') || ''),
    confirm_password: String(formData.get('confirm_password') || ''),
  })
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
