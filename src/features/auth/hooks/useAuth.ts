import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/authApi'
import { useAuthStore } from '@/shared/stores/authStore'
import type { LoginRequest } from '../types'

export const useAuth = () => {
  const queryClient = useQueryClient()

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      useAuthStore.getState().setUser(data.user)
      useAuthStore.getState().setTokens(data.accessToken, data.refreshToken)
      queryClient.setQueryData(['auth', 'user'], data.user)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      useAuthStore.getState().logout()
      queryClient.clear()
      window.location.href = '/auth/login'
    },
    onError: () => {
      // API 실패해도 클라이언트 측 로그아웃은 진행
      useAuthStore.getState().logout()
      queryClient.clear()
      window.location.href = '/auth/login'
    },
  })

  const { data: user } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken')
      if (!token) return null
      return queryClient.getQueryData(['auth', 'user']) || useAuthStore.getState().user || null
    },
  })

  return {
    user,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  }
}
