import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { groupsApi } from '../api/groupsApi'

export const useSearchGroups = (query: string) => {
  return useQuery({
    queryKey: ['groups', 'search', query],
    queryFn: () => groupsApi.getGroups({ query, page: 1, limit: 50 }),
  })
}

export const useGroups = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['groups', page, limit],
    queryFn: () => groupsApi.getGroups({ page, limit }),
  })
}

export const useCreateGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { title: string; description?: string }) =>
      groupsApi.createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}

export const useUpdateGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title?: string; description?: string } }) =>
      groupsApi.updateGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}

export const useDeleteGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => groupsApi.deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}
