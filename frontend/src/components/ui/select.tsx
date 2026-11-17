import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { useId } from 'react'
import { cn } from '@/lib/utils'

type Option = {
  value: string
  label: string
}

type SelectProps = {
  label?: string
  value?: string
  onValueChange: (value: string) => void
  options: Option[]
  placeholder?: string
  error?: string
  className?: string
}

export function Select({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Selecione',
  error,
  className,
}: SelectProps) {
  const id = useId()

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <label htmlFor={id} className={cn('text-sm font-medium text-gray-700', error && 'text-danger')}>
          {label}
        </label>
      )}

      <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
        <SelectPrimitive.Trigger
          id={id}
          className={cn(
            'flex h-12 w-full items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white px-3 text-left text-base text-gray-800 outline-none focus:border-brand-base data-[placeholder]:text-gray-400',
            error && 'border-danger'
          )}
        >
          <span className="truncate">
            <SelectPrimitive.Value placeholder={placeholder} />
          </span>
          <SelectPrimitive.Icon>
            <ChevronDown className="size-4 text-gray-700" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={4}
            className="z-50 max-h-72 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm text-gray-700 outline-none select-none data-[highlighted]:bg-gray-100 data-[state=checked]:font-medium data-[state=checked]:text-gray-800"
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <Check className="size-4 text-brand-base" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  )
}
