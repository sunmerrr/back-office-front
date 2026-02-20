import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketsApi } from '../api/ticketsApi'
import type { CreateTicketData, TicketListParams, TicketHistoryListParams } from '../types'

export const useTickets = (params?: TicketListParams) => {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: () => ticketsApi.getTickets(params),
  })
}

export const useTicketHistory = (params?: TicketHistoryListParams) => {
  return useQuery({
    queryKey: ['ticket-history', params],
    queryFn: () => ticketsApi.getTicketHistory(params),
  })
}

export const useTicketHistoryDetail = (id: string | null) => {
  return useQuery({
    queryKey: ['ticket-history', id],
    queryFn: () => ticketsApi.getTicketHistoryDetail(id!),
    enabled: !!id,
  })
}

export const useUpdateTicketHistory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { scheduledTimestamp: number; groups?: string[]; all?: boolean } }) => 
      ticketsApi.updateTicketHistory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-history'] })
    },
  })
}

export const useDeleteTicketHistory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ticketsApi.deleteTicketHistory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-history'] })
    },
  })
}

export const useTicket = (id: string) => {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => ticketsApi.getTicket(id),
    enabled: !!id,
  })
}

export const useSearchTicketTournaments = (query: string) => {
  return useQuery({
    queryKey: ['ticket-tournaments', query],
    queryFn: () => ticketsApi.searchTournaments(query),
  })
}

export const useCreateTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTicketData) => ticketsApi.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}

export const useUpdateTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTicketData> }) => 
      ticketsApi.updateTicket(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.id] })
    },
  })
}

export const useSendTicket = () => {
  return useMutation({
    mutationFn: (data: { 
      ticket: string; 
      groups?: string[]; 
      specificUser?: string; 
      all: boolean; 
      scheduledTimestamp: number;
    }) => ticketsApi.sendTicket(data),
  })
}

export const useDeleteTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ticketsApi.deleteTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}
