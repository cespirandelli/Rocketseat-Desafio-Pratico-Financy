import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from './stores/auth'
import { AppLayout } from './components/AppLayout'
import { Login } from './pages/auth/Login'
import { Signup } from './pages/auth/Signup'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { Categories } from './pages/Categories'
import { Profile } from './pages/Profile'

export function App() {
  const isAuthenticated = useAuthStore((state) => !!state.token)

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transacoes" element={<Transactions />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/perfil" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
