'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Sidebar from '@/components/layout/Sidebar'

export default function MobileDrawer({ profile }: { profile?: { full_name?: string | null; email?: string | null } }) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Menu" />}>
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <Sidebar profile={profile} />
      </SheetContent>
    </Sheet>
  )
}
