import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/features/auth/types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  setUser: (user: User | null) => void
  setTokens: (accessToken: string | null, refreshToken: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      logout: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({ user: null, accessToken: null, refreshToken: null })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
