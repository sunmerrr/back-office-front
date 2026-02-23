export interface PrizeEntry {
  rank: number
  percent: number
}

export interface PauseConfig {
  type: 'level' | 'players' | 'percent'
  value: number
}

export interface HitRunConfig {
  enabled: boolean
  minHands: number
  penalty?: string
}

export interface Tournament {
  id: string
  name: string
  description: string
  imagePath?: string
  startDate: number | null
  endDate: number | null
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  prizePool: string
  participants: number
  maxParticipants?: number
  cancelledReason?: string

  // Buyin
  buyinGold: string | null
  buyinTicketId: string | null
  ticketOnly: boolean

  // Prize
  prizeStructure: PrizeEntry[] | null
  prizeTicketId: string | null

  // 노출
  visibility: boolean

  // Pause / Hit & Run
  pauseConfig: PauseConfig | null
  hitRunConfig: HitRunConfig | null

  createdAt: string
  updatedAt: string
}

export interface TournamentParticipant {
  id: string
  userId: string
  email: string
  nickname?: string
  registeredAt: number
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
  startDate: number
  endDate: number
  prizePool?: string
  maxParticipants?: number

  // Buyin
  buyinGold?: string
  buyinTicketId?: string
  ticketOnly?: boolean

  // Prize
  prizeStructure?: PrizeEntry[]
  prizeTicketId?: string

  // 노출
  visibility?: boolean

  // Pause / Hit & Run
  pauseConfig?: PauseConfig
  hitRunConfig?: HitRunConfig
}
