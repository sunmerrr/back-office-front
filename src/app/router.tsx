import { createRouter, createRootRoute, createRoute, Outlet, redirect } from '@tanstack/react-router'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { MessagesPage } from '@/features/messages/pages/MessagesPage'
import { TicketsPage } from '@/features/tickets/pages/TicketsPage'
import { TournamentsPage } from '@/features/tournaments/pages/TournamentsPage'
import { UsersPage } from '@/features/users/pages/UsersPage'
import { UserDetailPage } from '@/features/users/pages/UserDetailPage'
import { AuditLogsPage } from '@/features/audit-logs/pages/AuditLogsPage'
import { AdminsPage } from '@/features/admins/pages/AdminsPage'
import { MainLayout } from '@/shared/components/layout/MainLayout'
import { useAuthStore } from '@/shared/stores/authStore'
import { normalizeRole } from '@/shared/types/permission'

export const requireSuperAdmin = () => {
  const user = useAuthStore.getState().user
  if (!user?.role || normalizeRole(user.role) !== 'superadmin') {
    throw redirect({ to: '/users' })
  }
}

// Root Route
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  ),
})

// Public Routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/login',
  component: LoginPage,
})

// Protected Routes Layout
const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_auth',
  component: () => (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ),
  beforeLoad: async ({ location }) => {
    const isAuthenticated = !!useAuthStore.getState().accessToken
    if (!isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})

// Feature Routes (Protected)
const messagesRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/messages',
  component: MessagesPage,
})

const ticketsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/tickets',
  component: TicketsPage,
})

const tournamentsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/tournaments',
  component: TournamentsPage,
})

const usersRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/users',
  component: UsersPage,
})

const userDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/users/$userId',
  component: UserDetailPage,
})

// Audit Logs Route (SUPERADMIN only)
const auditLogsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/audit-logs',
  component: AuditLogsPage,
  beforeLoad: () => requireSuperAdmin(),
})

// Admins Route (SUPERADMIN only)
const adminsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/admins',
  component: AdminsPage,
  beforeLoad: () => requireSuperAdmin(),
})

// Index Route (Protected)
const indexRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/',
  component: () => null,
  beforeLoad: () => {
    throw redirect({ to: '/users' })
  },
})

// Route Tree
const routeTree = rootRoute.addChildren([
  loginRoute,
  authenticatedRoute.addChildren([
    indexRoute,
    messagesRoute,
    ticketsRoute,
    tournamentsRoute,
    usersRoute,
    userDetailRoute,
    auditLogsRoute,
    adminsRoute,
  ]),
])

// Create Router
export const router = createRouter({ routeTree })

// Declare router types
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
