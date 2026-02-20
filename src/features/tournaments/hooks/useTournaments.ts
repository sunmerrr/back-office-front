import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tournamentsApi } from '../api/tournamentsApi'
import type { Tournament, TournamentListParams } from '../types'

export const useTournaments = (params?: TournamentListParams) => {
  return useQuery({
    queryKey: ['tournaments', params],
    queryFn: () => tournamentsApi.getTournaments(params),
  })
}

export const useTournament = (id: string) => {
  return useQuery({
    queryKey: ['tournaments', id],
    queryFn: () => tournamentsApi.getTournament(id),
    enabled: !!id,
  })
}

export const useCreateTournament = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Tournament>) => tournamentsApi.createTournament(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    },
  })
}

export const useUpdateTournament = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tournament> }) =>
      tournamentsApi.updateTournament(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
      queryClient.invalidateQueries({ queryKey: ['tournaments', variables.id] })
    },
  })
}

export const useDeleteTournament = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => tournamentsApi.deleteTournament(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    },
  })
}
