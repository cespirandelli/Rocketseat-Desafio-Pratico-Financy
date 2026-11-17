import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type DialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function Dialog({ open, onOpenChange, title, description, children, className }: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-gray-800/20 backdrop-blur-[1px]" />
        <DialogPrimitive.Content
          {...(!description && { 'aria-describedby': undefined })}
          className={cn(
            'fixed top-1/2 left-1/2 z-50 flex max-h-[90vh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-6 overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl outline-none',
            className
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <DialogPrimitive.Title className="text-base font-semibold text-gray-800">
                {title}
              </DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="text-sm text-gray-600">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-200">
              <X className="size-4" />
            </DialogPrimitive.Close>
          </div>

          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
