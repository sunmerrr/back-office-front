import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminsApi } from '../api/adminsApi'
import type { AdminListParams, CreateAdminData, ResetPasswordData } from '../types'

export const useAdmins = (params?: AdminListParams) => {
  return useQuery({
    queryKey: ['admins', params],
    queryFn: () => adminsApi.getAdmins(params),
  })
}

export const useCreateAdmin = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAdminData) => adminsApi.createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    },
  })
}

export const useUpdateAdminRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      adminsApi.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    },
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ResetPasswordData }) =>
      adminsApi.resetPassword(id, data),
  })
}

export const useUpdateAdminStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    },
  })
}
