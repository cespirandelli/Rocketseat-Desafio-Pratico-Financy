import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { User } from '@/types'

type AuthState = {
  user: User | null
  token: string | null
  remember: boolean
  setSession: (token: string, user: User, remember?: boolean) => void
  setUser: (user: User) => void
  logout: () => void
}

const storage = {
  getItem: (name: string) => localStorage.getItem(name) ?? sessionStorage.getItem(name),
  setItem: (name: string, value: string) => {
    const remember = JSON.parse(value)?.state?.remember
    if (remember) {
      localStorage.setItem(name, value)
      sessionStorage.removeItem(name)
    } else {
      sessionStorage.setItem(name, value)
      localStorage.removeItem(name)
    }
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name)
    sessionStorage.removeItem(name)
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      remember: true,
      setSession: (token, user, remember = true) => set({ token, user, remember }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'financy:auth',
      storage: createJSONStorage(() => storage),
    }
  )
)
