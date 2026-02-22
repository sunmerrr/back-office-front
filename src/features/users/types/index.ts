import { PaginatedResponse } from '@/shared/types/api'
import { UserRole } from './UserRole'

export interface User {
  id: string
  userName: string
  userGameId: string
  email: string
  identifier: string
  allowUserNameChange: boolean
  provider: string
  providerAccountId: string | null
  iconIndex: number
  roles: string[]
  role: UserRole
  banned: boolean
  bannedUntil: number
  gold: number | string
  diamond: number | string
  createdAt: string
  adultConfirmed: number
  hashedCi: string | null
  dailyMaxLimit: string
  name?: string
  phoneNumber?: string
  birthDate?: string
  gender?: string
  secureCi?: string
  clan?: {
    id: string
    name: string
    role: number
  }
}

export interface UserGoldLogData {
  parentId: string | null
  type: string
  gameId: string | null
  title: string
  lastUpdatedTimestamp: number
  amount: string
  message?: string
  createdAt: number
}

export interface GoldHistoryResponse {
  data: {
    total: number // 유저 보유 골드 총합
    log: UserGoldLogData[]
  }
  total: number // 전체 로그 수
}

export interface DiamondHistoryResponse {
  data: {
    total: number
    log: UserGoldLogData[]
  }
  total: number
}

export interface UserTicketData {
  id: string
  ticketId: string
  title: string
  expiredTimestamp: number
  games: string[]
  isUsed?: boolean
}

export interface UserTicketListResponse {
  data: UserTicketData[]
  meta: {
    page: number
    limit: number
    total: number
  }
  statusCode: number
  message: string
}

export interface UserListParams {
  page?: number
  limit?: number
  query?: string
}

export interface UserGroup {
  id: string
  owner: string
  title: string
  count: number
  weightSum: number
  createdAt: string
}

export interface PaymentHistoryItem {
  itemId: number
  orderName: string
  amount: number
  currency: string
  status: string
  expiredAt?: number
}

export interface PaymentHistoryResponse {
  data: {
    paymentList: PaymentHistoryItem[]
  }
  statusCode: number
  message: string
}

export type UserListResponse = PaginatedResponse<User>
