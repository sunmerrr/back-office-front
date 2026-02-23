export type AuditAction =
  // 유저
  | 'GOLD_ADD' | 'GOLD_SUB'
  | 'DIAMOND_ADD' | 'DIAMOND_SUB'
  | 'TICKET_GRANT'
  | 'USER_BAN' | 'USER_UNBAN'
  | 'USER_ROLE_CHANGE'
  | 'NICKNAME_CHANGE'
  | 'PASSWORD_RESET'
  // 토너먼트
  | 'TOURNAMENT_CREATE' | 'TOURNAMENT_UPDATE' | 'TOURNAMENT_DELETE'
  | 'TOURNAMENT_FORCE_DELETE' | 'TOURNAMENT_CANCEL'
  | 'TOURNAMENT_FORCE_REGISTER' | 'TOURNAMENT_FORCE_UNREGISTER'
  // 티켓
  | 'TICKET_CREATE' | 'TICKET_UPDATE' | 'TICKET_DELETE' | 'TICKET_SEND'
  // 공지
  | 'NOTICE_CREATE' | 'NOTICE_UPDATE' | 'NOTICE_DELETE'
  | 'ANNOUNCEMENT_CREATE' | 'ANNOUNCEMENT_UPDATE' | 'ANNOUNCEMENT_DELETE'
  // 상점
  | 'SHOP_PRODUCT_CREATE' | 'SHOP_PRODUCT_UPDATE' | 'SHOP_PRODUCT_DELETE'
  // 시스템
  | 'IP_WHITELIST_ADD' | 'IP_WHITELIST_REMOVE'

export type AuditTargetType =
  | 'USER'
  | 'TOURNAMENT'
  | 'TICKET'
  | 'NOTICE'
  | 'ANNOUNCEMENT'
  | 'SHOP'
  | 'SYSTEM'

export interface AuditLog {
  id: string
  adminId: string
  adminName: string
  action: AuditAction
  targetType: AuditTargetType
  targetId: string
  targetName: string | null
  detail: Record<string, any> | null
  ip: string
  createdAt: string
}

export interface AuditLogListParams {
  page?: number
  limit?: number
  adminId?: string
  action?: AuditAction
  targetType?: AuditTargetType
  targetId?: string
  startDate?: string
  endDate?: string
}
