import { FC } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePermission } from '@/shared/hooks/usePermission'
import { Badge } from '@/shared/components/ui/badge'
import type { User } from '@/features/auth/types'

export const Header: FC = () => {
  const { user, logout } = useAuth()
  const { role } = usePermission()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Back Office</h1>
        <div className="flex items-center gap-4">
          {user && (user as User).name && (
            <>
              {role && (
                <Badge variant={role === 'superadmin' ? 'default' : 'secondary'}>
                  {role === 'superadmin' ? 'Super Admin' : 'Operator'}
                </Badge>
              )}
              <span className="text-sm text-gray-600">{(user as User).name}</span>
              <button
                onClick={() => logout()}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
