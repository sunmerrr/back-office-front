import { useQuery } from '@tanstack/react-query'
import { auditLogsApi } from '../api/auditLogsApi'
import type { AuditLogListParams } from '../types'

export const useAuditLogs = (params?: AuditLogListParams) => {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: () => auditLogsApi.getAuditLogs(params),
  })
}

export const useAuditLog = (id: string) => {
  return useQuery({
    queryKey: ['audit-logs', id],
    queryFn: () => auditLogsApi.getAuditLog(id),
    enabled: !!id,
  })
}
