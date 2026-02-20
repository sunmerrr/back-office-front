import { FC, ReactNode } from 'react'
import { usePermission } from '@/shared/hooks/usePermission'
import type { Permission } from '@/shared/types/permission'

type PermissionGateProps = {
  permission: Permission
  fallback?: ReactNode
  children: ReactNode
}

export const PermissionGate: FC<PermissionGateProps> = ({
  permission,
  fallback = null,
  children,
}) => {
  const { hasPermission } = usePermission()

  if (!hasPermission(permission)) return <>{fallback}</>

  return <>{children}</>
}
