'use client'

import { useState } from 'react'
import { AlertTriangle, Loader2, ShieldAlert } from 'lucide-react'
import { deleteClientAction } from '@/actions/clients'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export default function DeleteClientDialog({ clientId, label }: { clientId: string; label: string }) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      setError(null)
      await deleteClientAction(clientId)
    } catch {
      setIsDeleting(false)
      setError('Delete failed. Please retry.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" size="sm" />}><AlertTriangle className="h-3.5 w-3.5" /> Delete</DialogTrigger>
      <DialogContent className="rounded-2xl border border-red-200/70 bg-white/95 shadow-[0_32px_70px_-40px_rgba(220,38,38,0.45)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-700"><ShieldAlert className="h-4 w-4" /> Delete Client</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {label}? This will also delete linked policies.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-xl border border-red-200 bg-red-50/80 px-3 py-2 text-xs text-red-700">
          This is permanent and cannot be undone.
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" disabled={isDeleting} onClick={handleDelete}>
            {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Deleting...</> : 'Delete Client'}
          </Button>
        </DialogFooter>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </DialogContent>
    </Dialog>
  )
}
