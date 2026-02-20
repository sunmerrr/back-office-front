import { apiClient } from '@/shared/api/client'
import { authenticatedApiClient } from '@/shared/api/interceptor'
import type { LoginRequest, LoginResponse } from '../types'

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post('auth/backoffice/login', { json: data }).json()
  },

  logout: async (): Promise<void> => {
    return authenticatedApiClient.post('auth/logout').json()
  },

  refreshToken: async (): Promise<LoginResponse> => {
    return apiClient.post('auth/refresh').json()
  },
}
