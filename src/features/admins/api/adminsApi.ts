import { authenticatedApiClient } from '@/shared/api/interceptor'
import type { PaginatedResponse } from '@/shared/types/api'
import type { Admin, AdminListParams, CreateAdminData, ResetPasswordData } from '../types'

export const adminsApi = {
  getAdmins: async (params?: AdminListParams): Promise<PaginatedResponse<Admin>> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)

    return authenticatedApiClient.get('admin/list', { searchParams }).json()
  },

  createAdmin: async (data: CreateAdminData): Promise<Admin> => {
    return authenticatedApiClient.post('admin/create', { json: data }).json()
  },

  updateRole: async (id: string, role: string): Promise<Admin> => {
    return authenticatedApiClient.patch(`admin/${id}/role`, { json: { role } }).json()
  },

  resetPassword: async (id: string, data: ResetPasswordData): Promise<{ message: string }> => {
    return authenticatedApiClient.patch(`admin/${id}/reset-password`, { json: data }).json()
  },

  updateStatus: async (id: string, status: string): Promise<Admin> => {
    return authenticatedApiClient.patch(`admin/${id}/status`, { json: { status } }).json()
  },
}
