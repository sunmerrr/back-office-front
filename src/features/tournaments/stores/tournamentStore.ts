import { create } from 'zustand'
import type { Tournament } from '../types'

interface TournamentStore {
  selectedTournament: Tournament | null
  setSelectedTournament: (tournament: Tournament | null) => void
  filters: {
    status?: Tournament['status']
    startDate?: string
    endDate?: string
  }
  setFilters: (filters: TournamentStore['filters']) => void
}

export const useTournamentStore = create<TournamentStore>((set) => ({
  selectedTournament: null,
  setSelectedTournament: (tournament) => set({ selectedTournament: tournament }),
  filters: {},
  setFilters: (filters) => set({ filters }),
}))
