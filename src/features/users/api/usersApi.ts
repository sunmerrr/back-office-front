import { authenticatedApiClient } from '@/shared/api/interceptor'
import type { 
  User, 
  UserListParams, 
  UserListResponse, 
  GoldHistoryResponse, 
  UserTicketListResponse,
  PaymentHistoryResponse 
} from '../types'

export const usersApi = {
  getUsers: async (params?: UserListParams): Promise<UserListResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.query) searchParams.set('query', params.query)

    return authenticatedApiClient.get('user/list', { searchParams }).json()
  },

  getPaymentHistory: async (userId: string): Promise<PaymentHistoryResponse> => {
    return authenticatedApiClient.post('payment/history', { json: { userId } }).json()
  },

  getUser: async (id: string): Promise<User> => {
    return authenticatedApiClient.get('admin/user', { searchParams: { userId: id } }).json()
  },

  getUserTickets: async (page = 1, limit = 20): Promise<UserTicketListResponse> => {
    const searchParams = new URLSearchParams()
    searchParams.set('page', page.toString())
    searchParams.set('limit', limit.toString())
    return authenticatedApiClient.get('assets/tickets', { searchParams }).json()
  },

  getGoldHistory: async (userId: string, page = 1, limit = 20): Promise<GoldHistoryResponse> => {
    return authenticatedApiClient.get('admin/gold', { 
      searchParams: { userId, page, limit } 
    }).json()
  },

  addGold: async (userIds: string[], amount: number): Promise<void> => {
    const searchParams = new URLSearchParams()
    userIds.forEach(id => searchParams.append('userIds[]', id))
    searchParams.set('amount', amount.toString())
    return authenticatedApiClient.post('admin/gold/add', { searchParams }).json()
  },

  subGold: async (userIds: string[], amount: number): Promise<void> => {
    const searchParams = new URLSearchParams()
    userIds.forEach(id => searchParams.append('userIds[]', id))
    searchParams.set('amount', amount.toString())
    return authenticatedApiClient.post('admin/gold/sub', { searchParams }).json()
  },

  emptyGold: async (userIds: string[]): Promise<void> => {
    const searchParams = new URLSearchParams()
    userIds.forEach(id => searchParams.append('userIds', id))
    return authenticatedApiClient.post('admin/gold/empty', { searchParams }).json()
  },

  createUser: async (data: Partial<User>): Promise<User> => {
    return authenticatedApiClient.post('user', { json: data }).json()
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    return authenticatedApiClient.put(`user/${id}`, { json: data }).json()
  },

  updateUserRole: async (id: string, role: string): Promise<void> => {
    return authenticatedApiClient.post('user/roles', { json: { id, role } }).json()
  },

  banUser: async (id: string, bannedUntil: number): Promise<void> => {
    return authenticatedApiClient.post('user/ban', { json: { id, bannedUntil } }).json()
  },

  unbanUser: async (id: string): Promise<void> => {
    return authenticatedApiClient.post('user/unban', { json: { id } }).json()
  },

  deleteUser: async (id: string): Promise<void> => {
    return authenticatedApiClient.delete(`user/${id}`).json()
  },
}
