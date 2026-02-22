import { FC, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  useUsers,
  useUpdateUserRole,
  useBanUser,
  useUnbanUser,
} from '../hooks/useUsers'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { ROLES } from '../types/UserRole'
import { usePermission } from '@/shared/hooks/usePermission'

export const UsersPage: FC = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading, error } = useUsers({
    page,
    limit,
    query: debouncedSearch,
  })

  const { hasPermission } = usePermission()
  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateUserRole()
  const { mutate: banUser, isPending: isBanning } = useBanUser()
  const { mutate: unbanUser, isPending: isUnbanning } = useUnbanUser()

  const totalPages = data?.meta ? Math.ceil(data.meta.total / data.meta.limit) : 0

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    if (window.confirm(`${newRole} 역할로 변경하시겠습니까?`)) {
      updateRole({ id: userId, role: newRole })
    }
  }

  const handleBan = (userId: string) => {
    const daysStr = window.prompt('차단할 기간(일)을 입력하세요:', '30')
    if (!daysStr) return

    const days = parseInt(daysStr, 10)
    if (isNaN(days) || days <= 0) {
      alert('유효한 숫자를 입력해주세요.')
      return
    }

    const reason = window.prompt('차단 사유를 입력하세요:') || '관리자 차단'
    const bannedUntil = new Date().getTime() + days * 24 * 60 * 60 * 1000
    if (window.confirm(`${days}일 동안 사용자를 차단하시겠습니까?`)) {
      banUser({ id: userId, bannedUntil, reason })
    }
  }

  const handleUnban = (userId: string) => {
    if (window.confirm('차단을 해제하시겠습니까?')) {
      unbanUser(userId)
    }
  }

  const handleRowClick = (userId: string) => {
    navigate({ to: '/users/$userId', params: { userId } })
  }

  const isActionPending = isUpdatingRole || isBanning || isUnbanning

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">회원 관리</h1>
        <Button>회원 등록</Button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="검색어 (이름, 이메일 등)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-center">ID</TableHead>
              <TableHead>사용자명</TableHead>
              <TableHead className="text-center">이메일 / 식별자</TableHead>
              <TableHead className="w-[180px] text-center">역할</TableHead>
              <TableHead className="text-center">성인인증</TableHead>
              <TableHead className="text-center">차단여부</TableHead>
              <TableHead className="text-center">생성일</TableHead>
              <TableHead className="text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-red-500">
                  데이터를 불러오는 중 오류가 발생했습니다.
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                  사용자가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleRowClick(user.id)}
                >
                  <TableCell className="font-medium text-center">{user.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold">{user.userName}</span>
                      <span className="text-xs text-gray-500">Game ID: {user.userGameId}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col text-sm items-center">
                      <span>{user.email}</span>
                      <span className="text-xs text-gray-500">{user.identifier}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    {hasPermission('user:role') ? (
                      <Select
                        defaultValue={user.role}
                        onValueChange={(value) => handleRoleChange(user.id, value)}
                        disabled={isActionPending}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline">
                        {ROLES.find((r) => r.value === user.role)?.label ?? user.role}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {user.adultConfirmed > 0 ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">
                          인증 완료
                        </Badge>
                      ) : (
                        <Badge variant="secondary">미인증</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col gap-1 items-center justify-center">
                      {user.banned ? (
                        <>
                          <Badge variant="destructive">차단됨</Badge>
                          {user.bannedUntil > 0 && (
                            <span className="text-[10px] text-gray-500">
                              ~ {new Date(user.bannedUntil).toLocaleDateString()}
                            </span>
                          )}
                        </>
                      ) : (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          정상
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-center">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    {user.banned ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnban(user.id)}
                        disabled={isActionPending}
                      >
                        차단 해제
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleBan(user.id)}
                        disabled={isActionPending}
                      >
                        차단
                      </Button>
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
    </div>
  )
}