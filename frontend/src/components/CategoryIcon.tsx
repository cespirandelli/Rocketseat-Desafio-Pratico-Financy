import { cn } from '@/lib/utils'
import { getCategoryColor, getCategoryIcon } from '@/lib/categories'

type CategoryIconProps = {
  icon?: string
  color?: string
  className?: string
}

export function CategoryIcon({ icon, color, className }: CategoryIconProps) {
  const Icon = getCategoryIcon(icon)

  return (
    <div
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-lg',
        color ? getCategoryColor(color).icon : 'bg-gray-200 text-gray-500',
        className
      )}
    >
      <Icon className="size-4" />
    </div>
  )
}
