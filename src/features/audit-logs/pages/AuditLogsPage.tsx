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
import { useAuditLogs } from '../hooks/useAuditLogs'
import { AuditLogFilters } from '../components/AuditLogFilters'
import { AuditLogActionBadge } from '../components/AuditLogActionBadge'
import { AuditLogDetailDialog } from '../components/AuditLogDetailDialog'
import type { AuditAction, AuditLog, AuditTargetType } from '../types'

const TARGET_TYPE_LABELS: Record<string, string> = {
  USER: '유저',
  TOURNAMENT: '토너먼트',
  TICKET: '티켓',
  NOTICE: '우편',
  ANNOUNCEMENT: '공지',
  SHOP: '상점',
  SYSTEM: '시스템',
}

export const AuditLogsPage: FC = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [action, setAction] = useState<AuditAction | undefined>()
  const [targetType, setTargetType] = useState<AuditTargetType | undefined>()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const { data, isLoading, error } = useAuditLogs({
    page,
    limit,
    action,
    targetType,
    startDate: startDate ? new Date(startDate).toISOString() : undefined,
    endDate: endDate ? new Date(endDate + 'T23:59:59').toISOString() : undefined,
  })

  const totalPages = data?.meta ? Math.ceil(data.meta.total / data.meta.limit) : 0

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const handleRowClick = (log: AuditLog) => {
    setSelectedLog(log)
    setDetailOpen(true)
  }

  const handleResetFilters = () => {
    setAction(undefined)
    setTargetType(undefined)
    setStartDate('')
    setEndDate('')
    setPage(1)
  }

  const handleActionChange = (value: AuditAction | undefined) => {
    setAction(value)
    setPage(1)
  }

  const handleTargetTypeChange = (value: AuditTargetType | undefined) => {
    setTargetType(value)
    setPage(1)
  }

  const handleStartDateChange = (value: string) => {
    setStartDate(value)
    setPage(1)
  }

  const handleEndDateChange = (value: string) => {
    setEndDate(value)
    setPage(1)
  }

  const getSummary = (log: AuditLog): string => {
    if (!log.detail) return '-'
    const d = log.detail
    if (d.reason) return d.reason as string
    if (d.amount) return `${d.amount > 0 ? '+' : ''}${d.amount}`
    if (d.oldName && d.newName) return `${d.oldName} → ${d.newName}`
    if (d.oldRole && d.newRole) return `${d.oldRole} → ${d.newRole}`
    return '-'
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">오딧 로그</h1>

      <AuditLogFilters
        action={action}
        targetType={targetType}
        startDate={startDate}
        endDate={endDate}
        onActionChange={handleActionChange}
        onTargetTypeChange={handleTargetTypeChange}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onReset={handleResetFilters}
      />

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[170px]">일시</TableHead>
              <TableHead className="w-[100px]">관리자</TableHead>
              <TableHead className="w-[150px] text-center">액션</TableHead>
              <TableHead className="w-[100px] text-center">대상 타입</TableHead>
              <TableHead>대상</TableHead>
              <TableHead>요약</TableHead>
              <TableHead className="w-[120px]">IP</TableHead>
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
                  오딧 로그가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((log) => (
                <TableRow
                  key={log.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleRowClick(log)}
                >
                  <TableCell className="text-sm text-gray-600">
                    {new Date(log.createdAt).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell className="font-medium">{log.adminName}</TableCell>
                  <TableCell className="text-center">
                    <AuditLogActionBadge action={log.action} />
                  </TableCell>
                  <TableCell className="text-center text-sm text-gray-600">
                    {TARGET_TYPE_LABELS[log.targetType] ?? log.targetType}
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.targetName ?? log.targetId}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 truncate max-w-[200px]">
                    {getSummary(log)}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-gray-400">
                    {log.ip}
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

      <AuditLogDetailDialog
        log={selectedLog}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
