import { authenticatedApiClient } from '@/shared/api/interceptor'
import type { CreateTicketData, Ticket, TicketListParams, TargetMTT, TicketHistory, TicketHistoryListParams } from '../types'
import { PaginatedResponse } from '@/shared/types/api'

/** Map backend Ticket row → frontend Ticket shape */
function mapTicket(raw: any): Ticket {
  return {
    id: String(raw.id),
    title: raw.name,
    category: raw.category || 'tournament',
    value: raw.value || '',
    amount: raw.amount,
    sentAmount: raw.sentAmount ?? raw._count?.grants ?? 0,
    pendingAmount: raw.pendingAmount ?? 0,
    startTimestamp: raw.startAt ? new Date(raw.startAt).getTime() : undefined,
    expiredTimestamp: raw.expiresAt ? new Date(raw.expiresAt).getTime() : undefined,
    games: raw.games || undefined,
    userId: raw.userId ? String(raw.userId) : '',
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
}

/** Map backend TicketSendHistory → frontend TicketHistory */
function mapTicketHistory(raw: any): TicketHistory {
  return {
    id: String(raw.id),
    owner: raw.adminId ? String(raw.adminId) : '',
    scheduledTimestamp: raw.scheduledAt ? new Date(raw.scheduledAt).getTime() : 0,
    ticket: raw.ticket ? mapTicket(raw.ticket) : ({} as Ticket),
    sent: raw.sent ?? false,
    all: raw.all ?? true,
    groups: raw.groups || undefined,
  }
}

export const ticketsApi = {
  getTickets: async (params?: TicketListParams): Promise<{ items: Ticket[]; total: number }> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.category) searchParams.set('category', params.category)
    if (params?.title) searchParams.set('query', params.title)

    const response: any = await authenticatedApiClient.get('ticket/list', { searchParams }).json()

    return {
      items: (response.data || []).map(mapTicket),
      total: response.meta?.total || 0
    }
  },

  getTicketHistory: async (params?: TicketHistoryListParams): Promise<PaginatedResponse<TicketHistory>> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const response: any = await authenticatedApiClient.get('send-ticket', { searchParams }).json()

    return {
      data: (response.data || []).map(mapTicketHistory),
      meta: response.meta || { page: 1, limit: 20, total: 0 },
    }
  },

  getTicketHistoryDetail: async (id: string): Promise<TicketHistory> => {
    const raw: any = await authenticatedApiClient.get(`send-ticket/${id}`).json()
    return mapTicketHistory(raw)
  },

  updateTicketHistory: async (id: string, data: { scheduledTimestamp: number; groups?: string[]; all?: boolean }): Promise<void> => {
    return authenticatedApiClient.patch(`send-ticket/${id}`, { json: data }).json()
  },

  deleteTicketHistory: async (id: string): Promise<void> => {
    return authenticatedApiClient.delete(`send-ticket/${id}`).json()
  },

  createTicket: async (data: CreateTicketData): Promise<Ticket> => {
    const body: any = {
      name: data.title,
      category: data.category,
      value: data.value,
      amount: data.amount,
      games: data.games,
    }
    if (data.startTimestamp) body.startAt = new Date(data.startTimestamp).toISOString()
    if (data.expiredTimestamp) body.expiresAt = new Date(data.expiredTimestamp).toISOString()

    const raw: any = await authenticatedApiClient.post('ticket/create', { json: body }).json()
    return mapTicket(raw)
  },

  updateTicket: async (id: string, data: Partial<CreateTicketData>): Promise<Ticket> => {
    const body: any = {}
    if (data.title !== undefined) body.name = data.title
    if (data.category !== undefined) body.category = data.category
    if (data.value !== undefined) body.value = data.value
    if (data.amount !== undefined) body.amount = data.amount
    if (data.games !== undefined) body.games = data.games
    if (data.startTimestamp !== undefined) body.startAt = data.startTimestamp ? new Date(data.startTimestamp).toISOString() : null
    if (data.expiredTimestamp !== undefined) body.expiresAt = data.expiredTimestamp ? new Date(data.expiredTimestamp).toISOString() : null

    const raw: any = await authenticatedApiClient.patch(`ticket/${id}`, { json: body }).json()
    return mapTicket(raw)
  },

  sendTicket: async (data: {
    ticket: string;
    groups?: string[];
    specificUser?: string;
    all: boolean;
    scheduledTimestamp: number;
  }): Promise<void> => {
    return authenticatedApiClient.post('send-ticket', { json: data }).json()
  },

  getTicket: async (id: string): Promise<Ticket> => {
    const raw: any = await authenticatedApiClient.get(`ticket/${id}`).json()
    return mapTicket(raw)
  },

  deleteTicket: async (id: string): Promise<void> => {
    return authenticatedApiClient.delete(`ticket/${id}`).json()
  },

  searchTournaments: async (query?: string): Promise<{ items: TargetMTT[]; total: number }> => {
    const searchParams = new URLSearchParams()
    searchParams.set('page', '1')
    searchParams.set('limit', '50')
    if (query) searchParams.set('query', query)

    const response: any = await authenticatedApiClient.get('ticket/tournament', { searchParams }).json()

    return {
      items: response.data || [],
      total: response.meta?.total || 0
    }
  }
}
