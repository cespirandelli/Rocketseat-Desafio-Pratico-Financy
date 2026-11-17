import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { getCategoryColor } from '@/lib/categories'

type TagProps = {
  color?: string
  children: ReactNode
  className?: string
}

export function Tag({ color, children, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap',
        getCategoryColor(color).tag,
        className
      )}
    >
      {children}
    </span>
  )
}
