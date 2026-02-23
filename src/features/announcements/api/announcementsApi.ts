import { authenticatedApiClient } from '@/shared/api/interceptor'
import type { Announcement, AnnouncementListParams, CreateAnnouncementData } from '../types'

function mapAnnouncement(raw: any): Announcement {
  return {
    id: String(raw.id),
    type: raw.type,
    title: raw.title || '',
    content: raw.content ?? null,
    imagePath: raw.imagePath ?? null,
    startAt: Number(raw.startAt),
    endAt: raw.endAt ? Number(raw.endAt) : null,
    status: raw.status,
    sortOrder: raw.sortOrder ?? 0,
    createdBy: String(raw.createdBy),
    createdAt: raw.createdAt || '',
    updatedAt: raw.updatedAt || '',
  }
}

export const announcementsApi = {
  getAnnouncements: async (params?: AnnouncementListParams): Promise<{ items: Announcement[]; total: number }> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.type) searchParams.set('type', params.type)
    if (params?.status) searchParams.set('status', params.status)

    const response: any = await authenticatedApiClient.get('announcement/list', { searchParams }).json()
    return {
      items: (response.data || []).map(mapAnnouncement),
      total: response.meta?.total || 0,
    }
  },

  getAnnouncement: async (id: string): Promise<Announcement> => {
    const raw: any = await authenticatedApiClient.get(`announcement/${id}`).json()
    return mapAnnouncement(raw)
  },

  createAnnouncement: async (data: CreateAnnouncementData): Promise<Announcement> => {
    const raw: any = await authenticatedApiClient.post('announcement/create', { json: data }).json()
    return mapAnnouncement(raw)
  },

  updateAnnouncement: async (id: string, data: Partial<CreateAnnouncementData & { status: Announcement['status'] }>): Promise<Announcement> => {
    const body: any = { ...data }
    const raw: any = await authenticatedApiClient.patch(`announcement/${id}`, { json: body }).json()
    return mapAnnouncement(raw)
  },

  deleteAnnouncement: async (id: string): Promise<void> => {
    return authenticatedApiClient.delete(`announcement/${id}`).json()
  },

  deactivateAnnouncement: async (id: string): Promise<Announcement> => {
    const raw: any = await authenticatedApiClient.patch(`announcement/${id}/deactivate`).json()
    return mapAnnouncement(raw)
  },
}
