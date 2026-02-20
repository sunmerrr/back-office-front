import { FC } from 'react'
import { Badge } from '@/shared/components/ui/badge'
import type { AuditAction } from '../types'

const ACTION_CONFIG: Record<AuditAction, { label: string; className: string }> = {
  // 유저 - blue
  GOLD_ADD: { label: '골드 지급', className: 'bg-blue-100 text-blue-800 border-none' },
  GOLD_SUB: { label: '골드 차감', className: 'bg-blue-100 text-blue-800 border-none' },
  DIAMOND_ADD: { label: '다이아 지급', className: 'bg-cyan-100 text-cyan-800 border-none' },
  DIAMOND_SUB: { label: '다이아 차감', className: 'bg-cyan-100 text-cyan-800 border-none' },
  TICKET_GRANT: { label: '티켓 지급', className: 'bg-blue-100 text-blue-800 border-none' },
  USER_BAN: { label: '유저 차단', className: 'bg-red-100 text-red-800 border-none' },
  USER_UNBAN: { label: '차단 해제', className: 'bg-green-100 text-green-800 border-none' },
  USER_ROLE_CHANGE: { label: '역할 변경', className: 'bg-amber-100 text-amber-800 border-none' },
  NICKNAME_CHANGE: { label: '닉네임 변경', className: 'bg-blue-100 text-blue-800 border-none' },
  PASSWORD_RESET: { label: '비밀번호 초기화', className: 'bg-amber-100 text-amber-800 border-none' },
  // 토너먼트 - purple
  TOURNAMENT_CREATE: { label: '토너먼트 생성', className: 'bg-purple-100 text-purple-800 border-none' },
  TOURNAMENT_UPDATE: { label: '토너먼트 수정', className: 'bg-purple-100 text-purple-800 border-none' },
  TOURNAMENT_DELETE: { label: '토너먼트 삭제', className: 'bg-purple-100 text-purple-800 border-none' },
  TOURNAMENT_FORCE_DELETE: { label: '토너먼트 강제삭제', className: 'bg-red-100 text-red-800 border-none' },
  TOURNAMENT_CANCEL: { label: '토너먼트 취소', className: 'bg-red-100 text-red-800 border-none' },
  TOURNAMENT_FORCE_REGISTER: { label: '강제 등록', className: 'bg-purple-100 text-purple-800 border-none' },
  TOURNAMENT_FORCE_UNREGISTER: { label: '강제 등록해제', className: 'bg-purple-100 text-purple-800 border-none' },
  // 티켓 - green
  TICKET_CREATE: { label: '티켓 생성', className: 'bg-green-100 text-green-800 border-none' },
  TICKET_UPDATE: { label: '티켓 수정', className: 'bg-green-100 text-green-800 border-none' },
  TICKET_DELETE: { label: '티켓 삭제', className: 'bg-green-100 text-green-800 border-none' },
  TICKET_SEND: { label: '티켓 발송', className: 'bg-green-100 text-green-800 border-none' },
  // 공지 - orange
  NOTICE_CREATE: { label: '우편 생성', className: 'bg-orange-100 text-orange-800 border-none' },
  NOTICE_UPDATE: { label: '우편 수정', className: 'bg-orange-100 text-orange-800 border-none' },
  NOTICE_DELETE: { label: '우편 삭제', className: 'bg-orange-100 text-orange-800 border-none' },
  ANNOUNCEMENT_CREATE: { label: '공지 등록', className: 'bg-orange-100 text-orange-800 border-none' },
  ANNOUNCEMENT_UPDATE: { label: '공지 수정', className: 'bg-orange-100 text-orange-800 border-none' },
  ANNOUNCEMENT_DELETE: { label: '공지 삭제', className: 'bg-orange-100 text-orange-800 border-none' },
  // 상점 - teal
  SHOP_PRODUCT_CREATE: { label: '상품 등록', className: 'bg-teal-100 text-teal-800 border-none' },
  SHOP_PRODUCT_UPDATE: { label: '상품 수정', className: 'bg-teal-100 text-teal-800 border-none' },
  SHOP_PRODUCT_DELETE: { label: '상품 삭제', className: 'bg-teal-100 text-teal-800 border-none' },
  // 시스템 - gray
  IP_WHITELIST_ADD: { label: 'IP 허용 추가', className: 'bg-gray-100 text-gray-800 border-none' },
  IP_WHITELIST_REMOVE: { label: 'IP 허용 삭제', className: 'bg-gray-100 text-gray-800 border-none' },
}

interface AuditLogActionBadgeProps {
  action: AuditAction
}

export const AuditLogActionBadge: FC<AuditLogActionBadgeProps> = ({ action }) => {
  const config = ACTION_CONFIG[action] ?? { label: action, className: 'bg-gray-100 text-gray-800 border-none' }
  return <Badge className={config.className}>{config.label}</Badge>
}

export const getActionLabel = (action: AuditAction): string => {
  return ACTION_CONFIG[action]?.label ?? action
}
