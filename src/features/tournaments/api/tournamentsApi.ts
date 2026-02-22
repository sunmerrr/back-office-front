import { authenticatedApiClient } from '@/shared/api/interceptor'
import type { Tournament, TournamentListParams, TournamentParticipant, CreateTournamentData } from '../types'

/** 백엔드 status enum → 프론트 status 소문자 매핑 */
const STATUS_MAP: Record<string, Tournament['status']> = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  FINISHED: 'completed',
  CANCELLED: 'cancelled',
}

const REVERSE_STATUS_MAP: Record<string, string> = {
  upcoming: 'UPCOMING',
  ongoing: 'ONGOING',
  completed: 'FINISHED',
  cancelled: 'CANCELLED',
}

function mapTournament(raw: any): Tournament {
  return {
    id: String(raw.id),
    name: raw.name || '',
    description: raw.description || '',
    imagePath: raw.imagePath || undefined,
    startDate: raw.startAt || '',
    endDate: raw.endAt || '',
    status: STATUS_MAP[raw.status] || 'upcoming',
    prizePool: raw.prizePool || 0,
    participants: raw.participants ?? raw.participantCount ?? raw._count?.participants ?? 0,
    maxParticipants: raw.maxParticipants || undefined,
    cancelledReason: raw.cancelledReason || undefined,
    createdAt: raw.createdAt || '',
    updatedAt: raw.updatedAt || '',
  }
}

function mapParticipant(raw: any): TournamentParticipant {
  return {
    id: raw.id,
    userId: raw.user?.id || raw.userId,
    email: raw.user?.email || '',
    nickname: raw.user?.nickname || undefined,
    registeredAt: raw.registeredAt || '',
  }
}

export const tournamentsApi = {
  getTournaments: async (params?: TournamentListParams): Promise<{ items: Tournament[]; total: number }> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.query) searchParams.set('query', params.query)
    if (params?.status) searchParams.set('status', REVERSE_STATUS_MAP[params.status] || params.status)

    const response: any = await authenticatedApiClient.get('tournament/list', { searchParams }).json()

    return {
      items: (response.data || []).map(mapTournament),
      total: response.meta?.total || 0,
    }
  },

  getTournament: async (id: string): Promise<Tournament> => {
    const raw: any = await authenticatedApiClient.get(`tournament/${id}`).json()
    return mapTournament(raw)
  },

  createTournament: async (data: CreateTournamentData): Promise<Tournament> => {
    const body: any = {
      name: data.name,
      description: data.description,
      imagePath: data.imagePath,
      prizePool: data.prizePool,
      maxParticipants: data.maxParticipants,
      startAt: data.startDate,
      endAt: data.endDate,
    }
    const raw: any = await authenticatedApiClient.post('tournament/create', { json: body }).json()
    return mapTournament(raw)
  },

  updateTournament: async (id: string, data: Partial<CreateTournamentData & { status: Tournament['status'] }>): Promise<Tournament> => {
    const body: any = {}
    if (data.name !== undefined) body.name = data.name
    if (data.description !== undefined) body.description = data.description
    if (data.imagePath !== undefined) body.imagePath = data.imagePath
    if (data.prizePool !== undefined) body.prizePool = data.prizePool
    if (data.maxParticipants !== undefined) body.maxParticipants = data.maxParticipants
    if (data.startDate !== undefined) body.startAt = data.startDate
    if (data.endDate !== undefined) body.endAt = data.endDate
    if (data.status !== undefined) body.status = REVERSE_STATUS_MAP[data.status] || data.status

    const raw: any = await authenticatedApiClient.patch(`tournament/${id}`, { json: body }).json()
    return mapTournament(raw)
  },

  deleteTournament: async (id: string): Promise<void> => {
    return authenticatedApiClient.delete(`tournament/${id}`).json()
  },

  cancelTournament: async (id: string, reason: string): Promise<Tournament> => {
    const raw: any = await authenticatedApiClient.patch(`tournament/${id}/cancel`, { json: { reason } }).json()
    return mapTournament(raw)
  },

  getParticipants: async (id: string): Promise<TournamentParticipant[]> => {
    const raw: any = await authenticatedApiClient.get(`tournament/${id}/participants`).json()
    return (Array.isArray(raw) ? raw : []).map(mapParticipant)
  },

  addParticipant: async (tournamentId: string, userId: number): Promise<TournamentParticipant> => {
    const raw: any = await authenticatedApiClient.post(`tournament/${tournamentId}/participants`, { json: { userId } }).json()
    return mapParticipant(raw)
  },

  removeParticipant: async (tournamentId: string, userId: number): Promise<void> => {
    return authenticatedApiClient.delete(`tournament/${tournamentId}/participants/${userId}`).json()
  },
}
