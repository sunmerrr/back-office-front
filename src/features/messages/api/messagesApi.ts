import { authenticatedApiClient } from '@/shared/api/interceptor'
import type { Notice, NoticeListParams, NoticeListResponse } from '../types'

/** Map backend Message row → frontend Notice shape */
function mapNotice(raw: any): Notice {
  return {
    id: String(raw.id),
    titleKo: raw.titleKo || raw.title || '',
    titleEn: raw.titleEn || '',
    titleJa: raw.titleJa || '',
    descriptionKo: raw.descriptionKo || raw.body || '',
    descriptionEn: raw.descriptionEn || '',
    descriptionJa: raw.descriptionJa || '',
    imagePath: raw.imagePath || raw.imageUrl || undefined,
    sent: raw.status === 'SENT',
    all: raw.all ?? (raw.target === 'ALL'),
    scheduledTimestamp: raw.scheduledAt ? Number(raw.scheduledAt) : 0,
    groups: raw.groups || undefined,
    createdAt: raw.createdAt,
  }
}

export const messagesApi = {
  getNotices: async (params?: NoticeListParams): Promise<NoticeListResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.query) searchParams.set('query', params.query)

    const response: any = await authenticatedApiClient.get('message/list', { searchParams }).json()

    return {
      data: (response.data || []).map(mapNotice),
      meta: response.meta || { page: 1, limit: 20, total: 0 },
    }
  },

  getNotice: async (id: string): Promise<Notice> => {
    const raw: any = await authenticatedApiClient.get(`message/${id}`).json()
    return mapNotice(raw)
  },

  createNotice: async (data: Partial<Notice>): Promise<Notice> => {
    const body: any = {
      titleKo: data.titleKo,
      titleEn: data.titleEn,
      titleJa: data.titleJa,
      descriptionKo: data.descriptionKo,
      descriptionEn: data.descriptionEn,
      descriptionJa: data.descriptionJa,
      imagePath: data.imagePath,
      all: data.all,
      groups: data.groups,
    }
    if (data.scheduledTimestamp) {
      body.scheduledAt = data.scheduledTimestamp
    }

    const raw: any = await authenticatedApiClient.post('message/create', { json: body }).json()
    return mapNotice(raw)
  },

  updateNotice: async (id: string, data: Partial<Notice>): Promise<Notice> => {
    const body: any = {}
    if (data.titleKo !== undefined) body.titleKo = data.titleKo
    if (data.titleEn !== undefined) body.titleEn = data.titleEn
    if (data.titleJa !== undefined) body.titleJa = data.titleJa
    if (data.descriptionKo !== undefined) body.descriptionKo = data.descriptionKo
    if (data.descriptionEn !== undefined) body.descriptionEn = data.descriptionEn
    if (data.descriptionJa !== undefined) body.descriptionJa = data.descriptionJa
    if (data.imagePath !== undefined) body.imagePath = data.imagePath
    if (data.all !== undefined) body.all = data.all
    if (data.groups !== undefined) body.groups = data.groups
    if (data.scheduledTimestamp !== undefined) {
      body.scheduledAt = data.scheduledTimestamp || null
    }

    const raw: any = await authenticatedApiClient.patch(`message/${id}`, { json: body }).json()
    return mapNotice(raw)
  },

  deleteNotice: async (id: string): Promise<void> => {
    return authenticatedApiClient.delete(`message/${id}`).json()
  },

  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'post')
    const response: any = await authenticatedApiClient.post('images/upload', {
      body: formData,
    }).json()
    return { url: response.data || response.url || '' }
  },
}
