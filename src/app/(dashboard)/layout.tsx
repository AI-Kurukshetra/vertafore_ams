import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const profile = {
    full_name: user?.user_metadata?.full_name as string | undefined,
    email: user?.email,
  }

  return (
    <div className="min-h-screen">
      <div className="hidden md:fixed md:inset-y-0 md:flex"><Sidebar profile={profile} /></div>
      <div className="md:pl-[17rem]">
        <Header title="SmartAgency Pro" profile={profile} />
        <main className="relative overflow-hidden p-4 md:p-6">
          <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-emerald-200/20 blur-3xl" />
          <div className="relative z-10">{children}</div>
        </main>
      </div>
    </div>
  )
}
