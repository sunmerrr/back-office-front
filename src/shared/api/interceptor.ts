import type { BeforeRequestHook, AfterResponseHook } from 'ky'
import { apiClient } from './client'
import { useAuthStore } from '@/shared/stores/authStore'
import type { RefreshResponse } from '@/features/auth/types'

// --- Silent Refresh State ---
let isRefreshing = false
let refreshPromise: Promise<RefreshResponse | null> | null = null

function getAuthToken(): string | null {
  return localStorage.getItem('accessToken') || null
}

function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken') || null
}

function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('refreshToken', refreshToken)
  useAuthStore.getState().setTokens(accessToken, refreshToken)
}

function clearAuthAndRedirect() {
  useAuthStore.getState().logout()
  if (window.location.pathname !== '/auth/login') {
    window.location.href = '/auth/login'
  }
}

async function doRefresh(): Promise<RefreshResponse | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  try {
    const response: RefreshResponse = await apiClient
      .post('auth/refresh', { json: { refreshToken } })
      .json()
    saveTokens(response.accessToken, response.refreshToken)
    return response
  } catch {
    return null
  }
}

async function silentRefresh(): Promise<RefreshResponse | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = doRefresh().finally(() => {
    isRefreshing = false
    refreshPromise = null
  })

  return refreshPromise
}

// --- Hooks ---

export const requestInterceptor: BeforeRequestHook = async (request) => {
  const token = getAuthToken()

  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`)
  }

  return request
}

export const responseInterceptor: AfterResponseHook = async (
  request,
  options,
  response
) => {
  if (response.status !== 401) {
    return response
  }

  // refresh 엔드포인트 자체가 401이면 무한루프 방지
  if (request.url.includes('/auth/refresh')) {
    clearAuthAndRedirect()
    return response
  }

  const result = await silentRefresh()

  if (!result) {
    clearAuthAndRedirect()
    return response
  }

  // 원래 요청을 새 토큰으로 재시도
  request.headers.set('Authorization', `Bearer ${result.accessToken}`)
  return fetch(request, options)
}

export const authenticatedApiClient = apiClient.extend({
  hooks: {
    beforeRequest: [requestInterceptor],
    afterResponse: [responseInterceptor],
  },
})
