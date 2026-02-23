import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tournamentsApi } from '../api/tournamentsApi'
import type { Tournament, TournamentListParams, CreateTournamentData } from '../types'

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
    mutationFn: (data: CreateTournamentData) => tournamentsApi.createTournament(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    },
  })
}

export const useUpdateTournament = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTournamentData & { status: Tournament['status'] }> }) =>
      tournamentsApi.updateTournament(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
      queryClient.invalidateQueries({ queryKey: ['tournaments', variables.id] })
    },
  })
}

export const useCopyTournament = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => tournamentsApi.copyTournament(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
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

export const useCancelTournament = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      tournamentsApi.cancelTournament(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
      queryClient.invalidateQueries({ queryKey: ['tournaments', variables.id] })
    },
  })
}

export const useTournamentParticipants = (id: string) => {
  return useQuery({
    queryKey: ['tournaments', id, 'participants'],
    queryFn: () => tournamentsApi.getParticipants(id),
    enabled: !!id,
  })
}

export const useAddParticipant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tournamentId, userId }: { tournamentId: string; userId: string }) =>
      tournamentsApi.addParticipant(tournamentId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments', variables.tournamentId, 'participants'] })
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    },
  })
}

export const useRemoveParticipant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tournamentId, userId }: { tournamentId: string; userId: string }) =>
      tournamentsApi.removeParticipant(tournamentId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments', variables.tournamentId, 'participants'] })
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    },
  })
}
