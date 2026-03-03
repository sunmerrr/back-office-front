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

// ── IP Whitelist ──

export const useIpWhitelist = () => {
  return useQuery({
    queryKey: ['ipWhitelist'],
    queryFn: () => settingsApi.getIpWhitelist(),
  })
}

export const useAddIp = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ip, description }: { ip: string; description?: string }) =>
      settingsApi.addIp(ip, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ipWhitelist'] })
    },
  })
}

export const useRemoveIp = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ip: string) => settingsApi.removeIp(ip),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ipWhitelist'] })
    },
  })
}

export const useToggleIpWhitelist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => settingsApi.toggleIpWhitelist(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ipWhitelist'] })
    },
  })
}
