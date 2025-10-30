import { useState } from 'react'
import { AddApplicationDialog } from '../AddApplicationDialog'
import { Button } from '@/components/ui/button'

export default function AddApplicationDialogExample() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <AddApplicationDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
