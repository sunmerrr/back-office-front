import { useQuery } from '@tanstack/react-query'
import { groupsApi } from '../api/groupsApi'

export const useSearchGroups = (query: string) => {
  return useQuery({
    queryKey: ['groups', 'search', query],
    queryFn: () => groupsApi.getGroups({ query, page: 1, limit: 50 }),
  })
}
