import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TicketListParams } from '../types'

interface TicketState {
  filters: TicketListParams
  setFilters: (filters: TicketListParams) => void
  resetFilters: () => void
}

export const useTicketStore = create<TicketState>()(
  persist(
    (set) => ({
      filters: {},
      setFilters: (filters) => set({ filters }),
      resetFilters: () => set({ filters: {} }),
    }),
    {
      name: 'ticket-storage',
    }
  )
)