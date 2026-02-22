import { authenticatedApiClient } from '@/shared/api/interceptor'

export interface DashboardSummary {
  users: { total: number; today: number; banned: number }
  payments: { todayAmount: number; todayCount: number; monthAmount: number; monthCount: number }
  tournaments: { upcoming: number; ongoing: number }
  recentAuditLogs: {
    id: number
    adminName: string
    action: string
    targetName?: string
    createdAt: string
  }[]
}

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    return authenticatedApiClient.get('dashboard/summary').json()
  },
}
