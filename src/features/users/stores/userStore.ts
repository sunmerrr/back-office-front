import { create } from 'zustand'
import type { User } from '../types'

interface UserStore {
  selectedUser: User | null
  setSelectedUser: (user: User | null) => void
  filters: {
    role?: string
    banned?: boolean
    query?: string
  }
  setFilters: (filters: UserStore['filters']) => void
}

export const useUserStore = create<UserStore>((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
  filters: {},
  setFilters: (filters) => set({ filters }),
}))
