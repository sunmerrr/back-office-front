import { authenticatedApiClient } from '@/shared/api/interceptor'
import type { CreateTicketData, Ticket, TicketListParams, TargetMTT, TicketHistory, TicketHistoryListParams } from '../types'
import { PaginatedResponse } from '@/shared/types/api'

export const ticketsApi = {
  getTickets: async (params?: TicketListParams): Promise<{ items: Ticket[]; total: number }> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.category) searchParams.set('category', params.category)
    if (params?.title) searchParams.set('query', params.title)

    const response: any = await authenticatedApiClient.get('ticket/list', { searchParams }).json()
    
    // API 응답 구조 { data: [...], meta: { total: ... } } 대응
    return {
      items: response.data || [],
      total: response.meta?.total || 0
    }
  },

  getTicketHistory: async (params?: TicketHistoryListParams): Promise<PaginatedResponse<TicketHistory>> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    return authenticatedApiClient.get('send-ticket', { searchParams }).json()
  },

  getTicketHistoryDetail: async (id: string): Promise<TicketHistory> => {
    return authenticatedApiClient.get(`send-ticket/${id}`).json()
  },

  updateTicketHistory: async (id: string, data: { scheduledTimestamp: number; groups?: string[]; all?: boolean }): Promise<void> => {
    return authenticatedApiClient.put(`send-ticket/${id}`, { json: data }).json()
  },

  deleteTicketHistory: async (id: string): Promise<void> => {
    return authenticatedApiClient.delete(`send-ticket/${id}`).json()
  },

  createTicket: async (data: CreateTicketData): Promise<Ticket> => {
    return authenticatedApiClient.post('ticket/create', { json: data }).json()
  },

  updateTicket: async (id: string, data: Partial<CreateTicketData>): Promise<Ticket> => {
    return authenticatedApiClient.put(`ticket/${id}`, { json: data }).json()
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
    return authenticatedApiClient.get(`ticket/${id}`).json()
  },
  
  deleteTicket: async (id: string): Promise<void> => {
    return authenticatedApiClient.delete(`ticket/${id}`).json()
  },

  searchTournaments: async (query?: string): Promise<{ items: TargetMTT[]; total: number }> => {
    const searchParams = new URLSearchParams()
    searchParams.set('page', '1')
    searchParams.set('limit', '50') // 검색 시 더 많은 결과를 보여주기 위해 limit 상향
    if (query) searchParams.set('query', query)

    const response: any = await authenticatedApiClient.get('ticket/tournament', { searchParams }).json()
    
    // API 응답 구조 { data: [...], meta: { total: ... } } 대응
    return {
      items: response.data || [],
      total: response.meta?.total || 0
    }
  }
}
