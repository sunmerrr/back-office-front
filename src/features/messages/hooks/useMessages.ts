import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { messagesApi } from '../api/messagesApi'
import type { Notice, NoticeListParams } from '../types'

export const useNotices = (params?: NoticeListParams) => {
  return useQuery({
    queryKey: ['notices', params],
    queryFn: () => messagesApi.getNotices(params),
  })
}

export const useNotice = (id: string) => {
  return useQuery({
    queryKey: ['notices', id],
    queryFn: () => messagesApi.getNotice(id),
    enabled: !!id,
  })
}

export const useCreateNotice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Notice>) => messagesApi.createNotice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] })
    },
  })
}

export const useUpdateNotice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Notice> }) =>
      messagesApi.updateNotice(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notices'] })
      queryClient.invalidateQueries({ queryKey: ['notices', variables.id] })
    },
  })
}

export const useDeleteNotice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => messagesApi.deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] })
    },
  })
}

export const useUploadNoticeImage = () => {
  return useMutation({
    mutationFn: (file: File) => messagesApi.uploadImage(file),
  })
}
