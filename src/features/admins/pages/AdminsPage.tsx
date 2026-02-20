import { FC, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Plus, KeyRound } from 'lucide-react'
import { useAdmins, useUpdateAdminRole, useUpdateAdminStatus } from '../hooks/useAdmins'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useAuthStore } from '@/shared/stores/authStore'
import { CreateAdminDialog } from '../components/CreateAdminDialog'
import { ResetPasswordDialog } from '../components/ResetPasswordDialog'
import type { Admin } from '../types'

const ROLE_OPTIONS = [
  { value: 'SUPERADMIN', label: 'Super Admin' },
  { value: 'OPERATOR', label: 'Operator' },
]

export const AdminsPage: FC = () => {
  const currentUser = useAuthStore((s) => s.user)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [createOpen, setCreateOpen] = useState(false)
  const [resetTarget, setResetTarget] = useState<Admin | null>(null)
  const [resetOpen, setResetOpen] = useState(false)

  const { data, isLoading, error } = useAdmins({
    page,
    limit,
    search: debouncedSearch || undefined,
  })

  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateAdminRole()
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateAdminStatus()

  const totalPages = data?.meta ? Math.ceil(data.meta.total / data.meta.limit) : 0
  const isActionPending = isUpdatingRole || isUpdatingStatus

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage)
  }

  const handleRoleChange = (admin: Admin, newRole: string) => {
    if (newRole === 'SUPERADMIN') {
      const confirmed = window.confirm(
        `${admin.nickname}에게 슈퍼 어드민 권한을 부여하시겠습니까?\n모든 기능에 접근할 수 있습니다.`
      )
      if (!confirmed) return
    }
    updateRole({ id: admin.id, role: newRole })
  }

  const handleStatusToggle = (admin: Admin) => {
    const newStatus = admin.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE'
    const msg =
      newStatus === 'BANNED'
        ? `${admin.nickname} 계정을 비활성화하시겠습니까?`
        : `${admin.nickname} 계정을 활성화하시겠습니까?`
    if (window.confirm(msg)) {
      updateStatus({ id: admin.id, status: newStatus })
    }
  }

  const handleResetPassword = (admin: Admin) => {
    setResetTarget(admin)
    setResetOpen(true)
  }

  const isSelf = (admin: Admin) => String(currentUser?.id) === String(admin.id)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">관리자 계정 관리</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          계정 생성
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="이메일 또는 닉네임으로 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] text-center">ID</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>닉네임</TableHead>
              <TableHead className="w-[160px] text-center">역할</TableHead>
              <TableHead className="w-[80px] text-center">상태</TableHead>
              <TableHead className="w-[120px] text-center">생성일</TableHead>
              <TableHead className="w-[180px] text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-red-500">
                  데이터를 불러오는 중 오류가 발생했습니다.
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                  관리자가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="text-center font-medium">{admin.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {admin.email}
                      {isSelf(admin) && (
                        <Badge variant="outline" className="text-xs">나</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{admin.nickname}</TableCell>
                  <TableCell className="text-center">
                    {isSelf(admin) ? (
                      <Badge variant={admin.role === 'SUPERADMIN' ? 'default' : 'secondary'}>
                        {ROLE_OPTIONS.find((r) => r.value === admin.role)?.label ?? admin.role}
                      </Badge>
                    ) : (
                      <Select
                        value={admin.role}
                        onValueChange={(v) => handleRoleChange(admin, v)}
                        disabled={isActionPending}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {admin.status === 'ACTIVE' ? (
                      <Badge className="bg-green-100 text-green-800 border-none">정상</Badge>
                    ) : (
                      <Badge variant="destructive">비활성</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-center">
                    {new Date(admin.createdAt).toLocaleDateString('ko-KR')}
                  </TableCell>
                  <TableCell className="text-center">
                    {isSelf(admin) ? (
                      <span className="text-xs text-gray-400">-</span>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleResetPassword(admin)}
                          title="비밀번호 초기화"
                        >
                          <KeyRound className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={admin.status === 'ACTIVE' ? 'destructive' : 'outline'}
                          size="sm"
                          onClick={() => handleStatusToggle(admin)}
                          disabled={isActionPending}
                        >
                          {admin.status === 'ACTIVE' ? '비활성화' : '활성화'}
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(page - 1)
                }}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= page - 2 && pageNum <= page + 2)
              ) {
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      isActive={page === pageNum}
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(pageNum)
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              } else if (pageNum === page - 3 || pageNum === page + 3) {
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }
              return null
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(page + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <CreateAdminDialog open={createOpen} onOpenChange={setCreateOpen} />
      <ResetPasswordDialog
        admin={resetTarget}
        open={resetOpen}
        onOpenChange={setResetOpen}
      />
    </div>
  )
}
