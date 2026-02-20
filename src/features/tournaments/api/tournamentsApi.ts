import { authenticatedApiClient } from '@/shared/api/interceptor'
import type { Tournament, TournamentListParams } from '../types'

export const tournamentsApi = {
  getTournaments: async (params?: TournamentListParams): Promise<{ items: Tournament[]; total: number }> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.query) searchParams.set('query', params.query)
    if (params?.status) searchParams.set('status', params.status)

    return authenticatedApiClient.get('tournament/list', { searchParams }).json()
  },

  getTournament: async (id: string): Promise<Tournament> => {
    return authenticatedApiClient.get(`tournament/${id}`).json()
  },

  createTournament: async (data: Partial<Tournament>): Promise<Tournament> => {
    return authenticatedApiClient.post('tournament/create', { json: data }).json()
  },

  updateTournament: async (id: string, data: Partial<Tournament>): Promise<Tournament> => {
    return authenticatedApiClient.put(`tournament/${id}`, { json: data }).json()
  },

  deleteTournament: async (id: string): Promise<void> => {
    return authenticatedApiClient.delete(`tournament/${id}`).json()
  },
}