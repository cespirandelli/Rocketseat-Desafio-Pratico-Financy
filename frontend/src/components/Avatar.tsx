import { cn, getInitials } from '@/lib/utils'

type AvatarProps = {
  name?: string
  size?: 'sm' | 'lg'
}

export function Avatar({ name, size = 'sm' }: AvatarProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-gray-300 text-gray-800',
        size === 'sm' ? 'size-9 text-sm font-medium' : 'size-16 text-2xl'
      )}
    >
      {getInitials(name)}
    </div>
  )
}
