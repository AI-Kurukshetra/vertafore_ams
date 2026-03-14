import { Sparkles } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import MobileDrawer from '@/components/layout/MobileDrawer'

export default function Header({ title, profile }: { title: string; profile?: { full_name?: string | null; email?: string | null } }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/75 px-4 py-3 backdrop-blur-xl md:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <MobileDrawer profile={profile} />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
            <p className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-cyan-600" /> Agency operations command center
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white/85 px-3 py-2">
          <Avatar className="h-9 w-9 ring-2 ring-cyan-100">
            <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-sky-600 text-white">
              {(profile?.full_name || 'A').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm leading-tight">
            <p className="font-semibold text-slate-900">{profile?.full_name || 'Agent'}</p>
            <p className="text-xs text-slate-500">{profile?.email || 'agent@agency.com'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
