// 백오피스 관리자 역할
// superadmin, admin → 'superadmin' 동일 취급
export type AdminRole = 'superadmin' | 'operator'

export const normalizeRole = (serverRole: string): AdminRole => {
  const role = serverRole.toLowerCase()
  if (role === 'superadmin' || role === 'admin') return 'superadmin'
  return 'operator'
}

export type Permission =
  | 'user:read'
  | 'user:ban'
  | 'user:nickname'
  | 'user:currency'
  | 'user:delete'
  | 'user:role'
  | 'payment:refund'
  | 'chat:read'
  | 'message:send'
  | 'announcement:manage'
  | 'tournament:create'
  | 'tournament:start'
  | 'tournament:register'
  | 'tournament:delete'
  | 'tournament:cancel'
  | 'ticket:manage'
  | 'shop:manage'
  | 'audit:read'
  | 'settings:manage'

const ALL_PERMISSIONS: Permission[] = [
  'user:read',
  'user:ban',
  'user:nickname',
  'user:currency',
  'user:delete',
  'user:role',
  'payment:refund',
  'chat:read',
  'message:send',
  'announcement:manage',
  'tournament:create',
  'tournament:start',
  'tournament:register',
  'tournament:delete',
  'tournament:cancel',
  'ticket:manage',
  'shop:manage',
  'audit:read',
  'settings:manage',
]

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  superadmin: ALL_PERMISSIONS,
  operator: [
    'user:read',
    'user:ban',
    'user:nickname',
    'chat:read',
    'message:send',
    'tournament:create',
    'tournament:start',
    'tournament:register',
    'ticket:manage',
  ],
}
