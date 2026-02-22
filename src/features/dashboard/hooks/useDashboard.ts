import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboardApi'

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardApi.getSummary(),
    refetchInterval: 60000, // 1분마다 자동 갱신
  })
}
