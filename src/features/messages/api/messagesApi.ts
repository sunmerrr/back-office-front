import { authenticatedApiClient } from '@/shared/api/interceptor'
import type { Notice, NoticeListParams, NoticeListResponse } from '../types'

export const messagesApi = {
  getNotices: async (params?: NoticeListParams): Promise<NoticeListResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.query) searchParams.set('query', params.query)

    return authenticatedApiClient.get('message/list', { searchParams }).json()
  },

  getNotice: async (id: string): Promise<Notice> => {
    return authenticatedApiClient.get(`message/${id}`).json()
  },

  createNotice: async (data: Partial<Notice>): Promise<Notice> => {
    return authenticatedApiClient.post('message/create', { json: data }).json()
  },

  updateNotice: async (id: string, data: Partial<Notice>): Promise<Notice> => {
    return authenticatedApiClient.put(`message/${id}`, { json: data }).json()
  },

  deleteNotice: async (id: string): Promise<void> => {
    return authenticatedApiClient.delete(`message/${id}`).json()
  },

  uploadImage: async (file: File): Promise<{ url: string; statusCode: number; message: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    return authenticatedApiClient.post('message/image', {
      body: formData,
      headers: {
        'Content-Type': undefined
      }
    }).json()
  },
}
