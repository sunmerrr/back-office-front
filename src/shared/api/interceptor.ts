import type { BeforeRequestHook, AfterResponseHook } from 'ky'
import { apiClient } from './client'

function getAuthToken(): string | null {
  return localStorage.getItem('accessToken') || null
}

export const requestInterceptor: BeforeRequestHook = async (request) => {
  const token = getAuthToken()
  
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`)
  }
  
  return request
}

export const responseInterceptor: AfterResponseHook = async (
  _request,
  _options,
  response
) => {
  if (response.status === 401) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    
    if (window.location.pathname !== '/auth/login') {
      window.location.href = '/auth/login'
    }
  }
  
  return response
}

export const authenticatedApiClient = apiClient.extend({
  hooks: {
    beforeRequest: [requestInterceptor],
    afterResponse: [responseInterceptor],
  },
})
