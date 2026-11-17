import type { ReactNode } from 'react'
import { Logo } from '@/components/Logo'

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center gap-8 px-4 py-12">
      <Logo className="h-8" />

      <div className="flex w-full max-w-md flex-col gap-8 rounded-xl border border-gray-200 bg-white p-8">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  )
}

export function Divider() {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-gray-300" />
      <span className="text-sm text-gray-500">ou</span>
      <span className="h-px flex-1 bg-gray-300" />
    </div>
  )
}
