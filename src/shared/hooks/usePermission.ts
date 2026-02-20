import { useAuthStore } from '@/shared/stores/authStore'
import { normalizeRole, ROLE_PERMISSIONS } from '@/shared/types/permission'
import type { Permission } from '@/shared/types/permission'

export const usePermission = () => {
  const user = useAuthStore((s) => s.user)
  const role = user?.role ? normalizeRole(user.role) : null

  const hasPermission = (permission: Permission): boolean => {
    if (!role) return false
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
  }

  const isSuperAdmin = role === 'superadmin'

  return { hasPermission, isSuperAdmin, role }
}
