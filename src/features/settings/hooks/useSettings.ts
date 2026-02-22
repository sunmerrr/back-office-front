import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsApi } from '../api/settingsApi'

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.getAll(),
  })
}

export const useUpdateSetting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: any }) =>
      settingsApi.set(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}
