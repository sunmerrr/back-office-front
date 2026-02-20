import { authenticatedApiClient } from '@/shared/api/interceptor'
import type { UserGroup } from '../types'
import { PaginatedResponse } from '@/shared/types/api'

export interface GroupListParams {
  page?: number
  limit?: number
  query?: string
}

export const groupsApi = {
  getGroups: async (params?: GroupListParams): Promise<PaginatedResponse<UserGroup>> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.query && params.query.trim() !== '') searchParams.set('query', params.query)

    return authenticatedApiClient.get('group', { searchParams }).json()
  },
}
