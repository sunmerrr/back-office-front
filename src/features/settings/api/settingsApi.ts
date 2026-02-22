import { authenticatedApiClient } from '@/shared/api/interceptor'

export interface SystemSetting {
  id: number
  key: string
  value: any
  updatedBy?: number
  updatedAt: string
}

export const settingsApi = {
  getAll: async (): Promise<SystemSetting[]> => {
    return authenticatedApiClient.get('settings').json()
  },

  get: async (key: string): Promise<SystemSetting> => {
    return authenticatedApiClient.get(`settings/${key}`).json()
  },

  set: async (key: string, value: any): Promise<SystemSetting> => {
    return authenticatedApiClient.put(`settings/${key}`, { json: { value } }).json()
  },
}
