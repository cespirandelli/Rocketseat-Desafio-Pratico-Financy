import { CircleArrowDown, CircleArrowUp } from 'lucide-react'
import type { TransactionType as Type } from '@/types'

export function TransactionType({ type }: { type: Type }) {
  if (type === 'income') {
    return (
      <span className="inline-flex items-center gap-2 text-sm font-medium text-green-dark">
        <CircleArrowUp className="size-4" />
        Entrada
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-red-dark">
      <CircleArrowDown className="size-4" />
      Saída
    </span>
  )
}
