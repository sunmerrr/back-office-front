import { authenticatedApiClient } from '@/shared/api/interceptor'
import type { PaginatedResponse } from '@/shared/types/api'
import type { AuditLog, AuditLogListParams } from '../types'

export const auditLogsApi = {
  getAuditLogs: async (params?: AuditLogListParams): Promise<PaginatedResponse<AuditLog>> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.adminId) searchParams.set('adminId', params.adminId)
    if (params?.action) searchParams.set('action', params.action)
    if (params?.targetType) searchParams.set('targetType', params.targetType)
    if (params?.targetId) searchParams.set('targetId', params.targetId)
    if (params?.startDate) searchParams.set('startDate', params.startDate)
    if (params?.endDate) searchParams.set('endDate', params.endDate)

    return authenticatedApiClient.get('audit-log/list', { searchParams }).json()
  },

  getAuditLog: async (id: string): Promise<AuditLog> => {
    return authenticatedApiClient.get(`audit-log/${id}`).json()
  },
}
