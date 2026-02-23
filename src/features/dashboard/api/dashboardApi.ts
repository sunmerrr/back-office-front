import { authenticatedApiClient } from '@/shared/api/interceptor'

export interface DashboardSummary {
  users: { total: number; today: number; banned: number }
  payments: { todayAmount: string; todayCount: number; monthAmount: string; monthCount: number }
  tournaments: { upcoming: number; ongoing: number }
  recentAuditLogs: {
    id: string
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
