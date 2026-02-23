import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { announcementsApi } from '../api/announcementsApi'
import type { AnnouncementListParams, CreateAnnouncementData, Announcement } from '../types'

export const useAnnouncements = (params?: AnnouncementListParams) => {
  return useQuery({
    queryKey: ['announcements', params],
    queryFn: () => announcementsApi.getAnnouncements(params),
  })
}

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAnnouncementData) => announcementsApi.createAnnouncement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAnnouncementData & { status: Announcement['status'] }> }) =>
      announcementsApi.updateAnnouncement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => announcementsApi.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}

export const useDeactivateAnnouncement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => announcementsApi.deactivateAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}
