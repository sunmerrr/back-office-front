export type AnnouncementType = 'BANNER' | 'POPUP' | 'WEB'
export type AnnouncementStatus = 'ACTIVE' | 'SCHEDULED' | 'EXPIRED' | 'INACTIVE'

export interface Announcement {
  id: string
  type: AnnouncementType
  title: string
  content: string | null
  imagePath: string | null
  startAt: number
  endAt: number | null
  status: AnnouncementStatus
  sortOrder: number
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface AnnouncementListParams {
  page?: number
  limit?: number
  type?: AnnouncementType
  status?: AnnouncementStatus
}

export interface CreateAnnouncementData {
  type: AnnouncementType
  title: string
  content?: string
  imagePath?: string
  startAt: number
  endAt?: number
  sortOrder?: number
}
