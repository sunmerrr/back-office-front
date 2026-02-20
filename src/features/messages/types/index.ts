import { PaginatedResponse } from '@/shared/types/api'
import { UserGroup } from '@/features/users/types'

export interface Notice {
  id: string
  titleKo: string
  titleEn: string
  titleJa: string
  descriptionKo: string
  descriptionEn: string
  descriptionJa: string
  imagePath?: string
  sent: boolean
  all: boolean
  scheduledTimestamp: number
  groups?: UserGroup[] | string[]
  createdAt?: string // Assuming createdAt might exist based on common patterns, though not in list response example
}

export interface NoticeListParams {
  page?: number
  limit?: number
  query?: string
}

export type NoticeListResponse = PaginatedResponse<Notice>
