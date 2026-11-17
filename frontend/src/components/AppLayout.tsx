import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function AppLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-[1280px] p-12">
        <Outlet />
      </main>
    </div>
  )
}
