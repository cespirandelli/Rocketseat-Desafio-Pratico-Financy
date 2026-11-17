import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  icon?: LucideIcon
  prefix?: string
  helper?: string
  error?: string
  rightElement?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, prefix, helper, error, rightElement, className, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
      <div className={cn('group flex flex-col gap-2', className)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium text-gray-700 group-focus-within:text-brand-base',
              error && 'text-danger group-focus-within:text-danger'
            )}
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            'flex h-12 items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 transition-colors focus-within:border-brand-base',
            error && 'border-danger focus-within:border-danger',
            props.disabled && 'bg-gray-100'
          )}
        >
          {Icon && (
            <Icon
              className={cn(
                'size-4 shrink-0 text-gray-400 group-focus-within:text-brand-base',
                error && 'text-danger group-focus-within:text-danger'
              )}
            />
          )}
          {prefix && <span className="text-base text-gray-800">{prefix}</span>}
          <input
            id={inputId}
            ref={ref}
            className="h-full w-full min-w-0 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400 disabled:text-gray-500"
            {...props}
          />
          {rightElement}
        </div>

        {(error || helper) && (
          <span className={cn('text-xs text-gray-500', error && 'text-danger')}>
            {error ?? helper}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
