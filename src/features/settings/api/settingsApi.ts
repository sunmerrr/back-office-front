import { authenticatedApiClient } from '@/shared/api/interceptor'

export interface SystemSetting {
  id: string
  key: string
  value: any
  updatedBy?: string
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

  // ── IP Whitelist (dedicated endpoints) ──

  getIpWhitelist: async (): Promise<{
    enabled: boolean
    ips: { ip: string; description?: string; addedAt: string }[]
  }> => {
    return authenticatedApiClient.get('ip-whitelist').json()
  },

  addIp: async (ip: string, description?: string): Promise<any> => {
    return authenticatedApiClient.post('ip-whitelist', { json: { ip, description } }).json()
  },

  removeIp: async (ip: string): Promise<any> => {
    return authenticatedApiClient.delete(`ip-whitelist/${encodeURIComponent(ip)}`).json()
  },

  toggleIpWhitelist: async (): Promise<any> => {
    return authenticatedApiClient.patch('ip-whitelist/toggle').json()
  },
}
