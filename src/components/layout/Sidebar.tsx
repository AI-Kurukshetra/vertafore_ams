'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BarChart3, Users, FileText, Loader2, LogOut, ShieldCheck, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { signOutAction } from '@/actions/auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type LinkProps = { href: string; label: string; icon: React.ComponentType<{ className?: string }> }

function SidebarLink({ href, label, icon: Icon }: LinkProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  const handleClick = () => {
    if (pathname === href) return
    setIsNavigating(true)
    router.push(href)
    setTimeout(() => setIsNavigating(false), 1000)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-300 min-h-11 border',
        isActive
          ? 'border-cyan-200 bg-gradient-to-r from-cyan-50 to-sky-50 text-cyan-800 shadow-[0_14px_24px_-16px_rgba(8,145,178,0.8)]'
          : 'border-transparent text-slate-600 hover:bg-white/70 hover:text-slate-900 hover:translate-x-1'
      )}
    >
      {isNavigating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      <span className="font-medium">{label}</span>
    </button>
  )
}

export default function Sidebar({ profile }: { profile?: { full_name?: string | null; email?: string | null } }) {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState<string | null>(null)

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      setSignOutError(null)
      await signOutAction()
    } catch {
      setIsSigningOut(false)
      setSignOutError('Sign out failed. Please retry.')
    }
  }

  return (
    <aside className="h-screen w-[17rem] border-r border-slate-200/70 bg-white/65 p-4 backdrop-blur-xl">
      <div className="flex h-full flex-col">
        <Link href="/dashboard" className="mb-8 block rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50/90 to-sky-50/80 p-4">
          <div className="flex items-center gap-2.5 text-xl font-semibold title-gradient">
            <ShieldCheck className="h-5 w-5 text-cyan-700" /> SmartAgency Pro
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-cyan-700/80">
            <Sparkles className="h-3.5 w-3.5" /> Next-gen AMS workspace
          </div>
        </Link>

        <nav className="space-y-2 reveal-item" style={{ ['--stagger' as string]: '80ms' }}>
          <SidebarLink href="/dashboard" label="Dashboard" icon={BarChart3} />
          <SidebarLink href="/clients" label="Clients" icon={Users} />
          <SidebarLink href="/policies" label="Policies" icon={FileText} />
        </nav>

        <div className="mt-auto space-y-3 rounded-2xl border border-slate-200/70 bg-white/85 p-3.5">
          <div className="text-sm">
            <p className="font-semibold text-slate-900 truncate">{profile?.full_name || 'Agent'}</p>
            <p className="text-xs text-slate-500 truncate">{profile?.email || 'agent@agency.com'}</p>
          </div>
          <Button type="button" variant="outline" className="w-full justify-start" disabled={isSigningOut} onClick={handleSignOut}>
            {isSigningOut ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing out...</> : <><LogOut className="mr-2 h-4 w-4" />Sign Out</>}
          </Button>
          {signOutError && <p className="text-xs text-red-600">{signOutError}</p>}
        </div>
      </div>
    </aside>
  )
}
