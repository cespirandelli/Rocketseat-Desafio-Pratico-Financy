import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'danger'
}

export function IconButton({ className, variant = 'default', ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-lg border border-gray-300 bg-white transition-colors hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4',
        variant === 'danger' ? 'text-danger' : 'text-gray-700',
        className
      )}
      {...props}
    />
  )
}
