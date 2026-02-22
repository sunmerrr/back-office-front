import { FC } from 'react'
import { Badge } from '@/shared/components/ui/badge'
import type { Tournament } from '../types'

const STATUS_CONFIG: Record<Tournament['status'], { label: string; className: string }> = {
  upcoming: {
    label: '예정',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-none',
  },
  ongoing: {
    label: '진행중',
    className: 'bg-green-100 text-green-800 hover:bg-green-100 border-none',
  },
  completed: {
    label: '완료',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100 border-none',
  },
  cancelled: {
    label: '취소',
    className: 'bg-red-100 text-red-800 hover:bg-red-100 border-none',
  },
}

interface TournamentStatusBadgeProps {
  status: Tournament['status']
}

export const TournamentStatusBadge: FC<TournamentStatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.upcoming
  return <Badge className={config.className}>{config.label}</Badge>
}
