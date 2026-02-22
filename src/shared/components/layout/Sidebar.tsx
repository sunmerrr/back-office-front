import { FC, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Ticket,
  Users,
  MessageSquare,
  Trophy,
  FileText,
  Shield,
  DollarSign,
  LayoutDashboard,
  Settings,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Button } from '@/shared/components/ui/button'
import { usePermission } from '@/shared/hooks/usePermission'
import type { Permission } from '@/shared/types/permission'

type NavItem = {
  name: string
  path: string
  icon: typeof Users
  permission?: Permission
}

const navigation: NavItem[] = [
  { name: '대시보드', path: '/dashboard', icon: LayoutDashboard },
  { name: '회원 관리', path: '/users', icon: Users },
  { name: '메시지 관리', path: '/messages', icon: MessageSquare },
  { name: '티켓 관리', path: '/tickets', icon: Ticket },
  { name: '토너먼트', path: '/tournaments', icon: Trophy },
  { name: '결제 내역', path: '/payments', icon: DollarSign },
  { name: '감사 로그', path: '/audit-logs', icon: FileText, permission: 'audit:read' },
  { name: '관리자 관리', path: '/admins', icon: Shield, permission: 'settings:manage' },
  { name: '시스템 설정', path: '/settings', icon: Settings, permission: 'settings:manage' },
]

export const Sidebar: FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { hasPermission } = usePermission()

  const filteredNav = navigation.filter(
    (item) => !item.permission || hasPermission(item.permission)
  )

  return (
    <aside
      className={cn(
        "relative border-r bg-white flex flex-col transition-all duration-300 ease-in-out h-full",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="absolute top-4 -right-3 z-50">
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-full border bg-white shadow-md hover:bg-gray-100 flex items-center justify-center"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5 text-gray-600" />
          )}
        </Button>
      </div>

      <nav className="flex flex-col gap-1 p-2 flex-1 pt-4 overflow-x-hidden">
        {filteredNav.map((item) => (
          <Link
            key={item.path}
            to={item.path}
          >
            {({ isActive }) => (
              <div
                className={cn(
                  "flex items-center h-10 rounded-md transition-all duration-200 group relative cursor-pointer",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  isCollapsed ? "px-2 justify-center" : "px-3"
                )}
              >
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                  <item.icon className="h-5 w-5" />
                </div>

                <span
                  className={cn(
                    "ml-3 text-sm font-medium transition-all duration-300 whitespace-nowrap overflow-hidden",
                    isCollapsed ? "opacity-0 w-0 ml-0" : "opacity-100 w-auto"
                  )}
                >
                  {item.name}
                </span>
              </div>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
