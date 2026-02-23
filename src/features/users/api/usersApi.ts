import { authenticatedApiClient } from '@/shared/api/interceptor'
import type {
  User,
  UserListParams,
  UserListResponse,
  GoldHistoryResponse,
  DiamondHistoryResponse,
  UserTicketListResponse,
  PaymentHistoryResponse,
  NicknameHistoryItem,
} from '../types'

// 백엔드 응답 → 프론트 User 타입 매핑
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapUser = (u: any): User => ({
  ...u,
  id: String(u.id),
  userName: u.userName ?? u.nickname ?? u.email ?? '',
  userGameId: u.userGameId ?? String(u.id),
  identifier: u.identifier ?? u.email ?? '',
  banned: u.banned ?? u.status === 'BANNED',
  bannedUntil: u.bannedUntil ? Number(u.bannedUntil) : 0,
  gold: u.gold ?? 0,
  diamond: u.diamond ?? 0,
  adultConfirmed: u.adultConfirmed ?? 0,
  allowUserNameChange: u.allowUserNameChange ?? false,
  provider: u.provider ?? '',
  providerAccountId: u.providerAccountId ?? null,
  iconIndex: u.iconIndex ?? 0,
  roles: u.roles ?? [u.role],
  hashedCi: u.hashedCi ?? null,
  dailyMaxLimit: u.dailyMaxLimit ?? '0',
})

export const usersApi = {
  getUsers: async (params?: UserListParams): Promise<UserListResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.query) searchParams.set('search', params.query)

    const res: { data: unknown[]; meta: { page: number; limit: number; total: number } } =
      await authenticatedApiClient.get('user/list', { searchParams }).json()

    return {
      data: res.data.map(mapUser),
      meta: res.meta,
    }
  },

  getPaymentHistory: async (userId: string): Promise<PaymentHistoryResponse> => {
    return authenticatedApiClient.get(`user/${userId}/payments`).json()
  },

  getUser: async (id: string): Promise<User> => {
    const res = await authenticatedApiClient.get(`user/${id}`).json()
    return mapUser(res)
  },

  getUserTickets: async (page = 1, limit = 20): Promise<UserTicketListResponse> => {
    const searchParams = new URLSearchParams()
    searchParams.set('page', page.toString())
    searchParams.set('limit', limit.toString())
    return authenticatedApiClient.get('assets/tickets', { searchParams }).json()
  },

  // ── Gold ──

  getGoldHistory: async (userId: string, page = 1, limit = 20): Promise<GoldHistoryResponse> => {
    return authenticatedApiClient.get('admin/gold', {
      searchParams: { userId, page, limit }
    }).json()
  },

  addGold: async (userIds: string[], amount: number, message?: string): Promise<void> => {
    return authenticatedApiClient.post('admin/gold/add', {
      json: { userIds, amount, message },
    }).json()
  },

  subGold: async (userIds: string[], amount: number, message?: string): Promise<void> => {
    return authenticatedApiClient.post('admin/gold/sub', {
      json: { userIds, amount, message },
    }).json()
  },

  emptyGold: async (userIds: string[]): Promise<void> => {
    return authenticatedApiClient.post('admin/gold/empty', {
      json: { userIds },
    }).json()
  },

  // ── Diamond ──

  getDiamondHistory: async (userId: string, page = 1, limit = 20): Promise<DiamondHistoryResponse> => {
    return authenticatedApiClient.get('admin/diamond', {
      searchParams: { userId, page, limit }
    }).json()
  },

  addDiamond: async (userIds: string[], amount: number, message?: string): Promise<void> => {
    return authenticatedApiClient.post('admin/diamond/add', {
      json: { userIds, amount, message },
    }).json()
  },

  subDiamond: async (userIds: string[], amount: number, message?: string): Promise<void> => {
    return authenticatedApiClient.post('admin/diamond/sub', {
      json: { userIds, amount, message },
    }).json()
  },

  // ── User CRUD ──

  createUser: async (data: Partial<User>): Promise<User> => {
    return authenticatedApiClient.post('user', { json: data }).json()
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    return authenticatedApiClient.put(`user/${id}`, { json: data }).json()
  },

  updateUserRole: async (id: string, role: string): Promise<void> => {
    return authenticatedApiClient.patch(`user/${id}/role`, { json: { role } }).json()
  },

  // ── Ban ──

  banUser: async (id: string, bannedUntil?: number, reason?: string): Promise<void> => {
    return authenticatedApiClient.post(`user/${id}/ban`, {
      json: { bannedUntil, reason },
    }).json()
  },

  unbanUser: async (id: string): Promise<void> => {
    return authenticatedApiClient.post(`user/${id}/unban`).json()
  },

  deleteUser: async (id: string): Promise<void> => {
    return authenticatedApiClient.delete(`user/${id}`).json()
  },

  // ── Nickname ──

  changeNickname: async (id: string, nickname: string, reason: string): Promise<User> => {
    const res = await authenticatedApiClient.post(`user/${id}/nickname`, {
      json: { nickname, reason },
    }).json()
    return mapUser(res)
  },

  getNicknameHistory: async (id: string): Promise<NicknameHistoryItem[]> => {
    const res: any[] = await authenticatedApiClient.get(`user/${id}/nickname-history`).json()
    return res.map((item: any) => ({
      id: String(item.id),
      userId: String(item.userId),
      oldName: item.oldName,
      newName: item.newName,
      changedBy: item.changedBy ? String(item.changedBy) : null,
      reason: item.reason ?? null,
      createdAt: item.createdAt,
    }))
  },
}
