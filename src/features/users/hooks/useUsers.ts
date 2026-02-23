import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../api/usersApi'
import type { User, UserListParams } from '../types'

export const useUsers = (params?: UserListParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getUsers(params),
  })
}

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.getUser(id),
    enabled: !!id,
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<User>) => usersApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      usersApi.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] })
    },
  })
}

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      usersApi.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useGoldHistory = (userId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['goldHistory', userId, page, limit],
    queryFn: () => usersApi.getGoldHistory(userId, page, limit),
    enabled: !!userId,
  })
}

export const usePaymentHistory = (userId: string) => {
  return useQuery({
    queryKey: ['paymentHistory', userId],
    queryFn: () => usersApi.getPaymentHistory(userId),
    enabled: !!userId,
  })
}

export const useUserTickets = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['userTickets', page, limit],
    queryFn: () => usersApi.getUserTickets(page, limit),
  })
}

// ── Gold mutations ──

export const useAddGold = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userIds, amount, message }: { userIds: string[]; amount: number; message?: string }) =>
      usersApi.addGold(userIds, amount, message),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      variables.userIds.forEach(id => {
        queryClient.invalidateQueries({ queryKey: ['goldHistory', id] })
      })
    },
  })
}

export const useSubGold = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userIds, amount, message }: { userIds: string[]; amount: number; message?: string }) =>
      usersApi.subGold(userIds, amount, message),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      variables.userIds.forEach(id => {
        queryClient.invalidateQueries({ queryKey: ['goldHistory', id] })
      })
    },
  })
}

export const useEmptyGold = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userIds: string[]) => usersApi.emptyGold(userIds),
    onSuccess: (_, userIds) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      userIds.forEach(id => {
        queryClient.invalidateQueries({ queryKey: ['goldHistory', id] })
      })
    },
  })
}

export const useDiamondHistory = (userId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['diamondHistory', userId, page, limit],
    queryFn: () => usersApi.getDiamondHistory(userId, page, limit),
    enabled: !!userId,
  })
}

// ── Diamond mutations ──

export const useAddDiamond = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userIds, amount, message }: { userIds: string[]; amount: number; message?: string }) =>
      usersApi.addDiamond(userIds, amount, message),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      variables.userIds.forEach(id => {
        queryClient.invalidateQueries({ queryKey: ['users', id] })
        queryClient.invalidateQueries({ queryKey: ['diamondHistory', id] })
      })
    },
  })
}

export const useSubDiamond = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userIds, amount, message }: { userIds: string[]; amount: number; message?: string }) =>
      usersApi.subDiamond(userIds, amount, message),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      variables.userIds.forEach(id => {
        queryClient.invalidateQueries({ queryKey: ['users', id] })
        queryClient.invalidateQueries({ queryKey: ['diamondHistory', id] })
      })
    },
  })
}

// ── Ban mutations ──

export const useBanUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, bannedUntil, reason }: { id: string; bannedUntil?: number; reason: string }) =>
      usersApi.banUser(id, bannedUntil, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useUnbanUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => usersApi.unbanUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// ── Nickname ──

export const useChangeNickname = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, nickname, reason }: { id: string; nickname: string; reason: string }) =>
      usersApi.changeNickname(id, nickname, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['nicknameHistory', variables.id] })
    },
  })
}

export const useNicknameHistory = (userId: string) => {
  return useQuery({
    queryKey: ['nicknameHistory', userId],
    queryFn: () => usersApi.getNicknameHistory(userId),
    enabled: !!userId,
  })
}
