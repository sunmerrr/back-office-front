export interface Tournament {
  id: string
  name: string
  description: string
  imagePath?: string
  startDate: string
  endDate: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  prizePool: number
  participants: number
  maxParticipants?: number
  cancelledReason?: string
  createdAt: string
  updatedAt: string
}

export interface TournamentParticipant {
  id: number
  userId: number
  email: string
  nickname?: string
  registeredAt: string
}

export interface TournamentListParams {
  page?: number
  limit?: number
  status?: Tournament['status']
  query?: string
}

export interface CreateTournamentData {
  name: string
  description?: string
  imagePath?: string
  startDate: string
  endDate: string
  prizePool?: number
  maxParticipants?: number
}
