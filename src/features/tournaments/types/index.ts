export interface Tournament {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  prizePool: number
  participants: number
  maxParticipants?: number
  createdAt: string
  updatedAt: string
}

export interface TournamentListParams {
  page?: number
  limit?: number
  status?: Tournament['status']
  startDate?: string
  endDate?: string
  query?: string
}