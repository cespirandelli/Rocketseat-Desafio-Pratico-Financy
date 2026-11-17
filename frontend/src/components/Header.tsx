import { Link, NavLink } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { cn } from '@/lib/utils'
import { Logo } from './Logo'
import { Avatar } from './Avatar'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/transacoes', label: 'Transações' },
  { to: '/categorias', label: 'Categorias' },
]

export function Header() {
  const user = useAuthStore((state) => state.user)

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto grid h-[69px] max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center px-12">
        <Link to="/">
          <Logo className="h-6" />
        </Link>

        <nav className="flex items-center gap-5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                cn(
                  'text-sm text-gray-600 transition-colors hover:text-gray-800',
                  isActive && 'font-semibold text-brand-base hover:text-brand-base'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/perfil" className="justify-self-end" title="Meu perfil">
          <Avatar name={user?.name} />
        </Link>
      </div>
    </header>
  )
}
